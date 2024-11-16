import { openai } from '@ai-sdk/openai'
import { generateObject } from 'ai'
import { menuSchema } from '@/schemas/menu'
import sharp from 'sharp'
import { currentUser } from '@clerk/nextjs/server'
import { getPreferences } from '@/db/preferences'

export const maxDuration = 60 // This function can run for a maximum of 60 seconds

export async function POST(request: Request) {
  try {
    const user = await currentUser()

    if (!user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const preferences = await getPreferences(user.id)

    const formData = await request.formData()
    const images = formData.getAll('images') as File[]

    if (images.length === 0) {
      return new Response('No images provided', { status: 400 })
    }

    const base64Images = await Promise.all(
      images.map(async (image) => {
        const imageBuffer = await image.arrayBuffer()
        const processedBuffer = await sharp(Buffer.from(imageBuffer))
          .jpeg({ quality: 70 })
          .toBuffer()
        return processedBuffer.toString('base64')
      })
    )

    const result = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: menuSchema,
      system: `You are an assistant that processes restaurant menus and returns structured data.
        You will receive one or more images of a restaurant menu. Your tasks are:

        1. **Extract all dishes** from the menu, including:
          - **Name** of the dish
          - **Price** (as a string number, without currency symbols) if available, otherwise set to "-"
          - **Provide a detailed explanation of what the dish is**, in the user's dialect and language. Do not just extract the description from the menu; instead, explain the dish to the user.

        2. **Adapt descriptions** to the user's dialect based on their location:
          - If the user is from **"Argentina"** and the dish is **"ribeye steak"**, the description should be **"Es un corte de carne conocido como Tapa de asado"**
          - If the user is from **"Spain"** and the dish is **"ribeye steak"**, the description should be **"Es un corte de carne conocido como Tapa de cuadril"**
          - If the user is from **"Mexico"** and the dish is **"corn on the cob"**, the description should be **"Es como Elote, una mazorca de maíz asada o hervida"**
          - If the user is from **"France"** and the dish is **"grilled cheese sandwich"**, the description should be **"Es similar a un Croque-monsieur, un sándwich tostado con queso y jamón"**
          - If the user is from **"Japan"** and the dish is **"raw fish slices"**, the description should be **"Es como Sashimi, finas láminas de pescado crudo"**

        3. THIS IS THE MOST IMPORTANT PART **Identify top dishes** that match the user's preferences:
          - The user is from **"Argentina"**
          - Their preferences are **"healthy and meat lover"**
          - The top dishes should be **"steak"** and **"salad"**

        4. **Output** the data in the following structured format:

        \`\`\`json
        {
          "isMenu": true,
          "menuItems": [
            {
              "name": "Dish Name",
              "price": Price as a number,
              "description": "Detailed explanation of the dish in user's dialect and language"
            },
            ...
          ],
          "topDishes": [
            {
              "name": "Dish Name",
              "price": Price as a number,
              "description": "Detailed explanation of the dish in user's dialect and language"
            },
            ...
          ]
        }
        \`\`\`

        **Please ensure that:**

        - All prices are numbers without currency symbols.
        - Descriptions are detailed explanations of the dishes, tailored to the user's dialect and language.
        - Do not just extract the descriptions from the menu; expand upon them to explain what the dish is.
        - Top dishes align with the user's preferences.
        - The response includes only the structured data without additional text.
        - If none of the images are menus, set "isMenu" to false and return an empty array for "menuItems" and "topDishes".
        - Combine information from all provided images to create a comprehensive menu.
      `,
      messages: [
        {
          role: 'user',
          content: base64Images.map((image) => ({
            type: 'image',
            image: image,
          })),
        },
      ],
    })

    return new Response(JSON.stringify(result.object), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error processing menu:', error)
    return new Response('Error processing menu', { status: 500 })
  }
}
