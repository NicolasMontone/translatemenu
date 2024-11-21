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
         - **Name** of the dish.
         - **Price** (as a number, without currency symbols). If unavailable, set to "-".
         - **Provide a detailed explanation of what the dish is**, in the user's dialect and language. Do not just extract the description from the menu; instead, explain the dish to the user.
      
      2. **Adapt descriptions** to the user's dialect and cultural context based on their location (**"${
        preferences?.country
      }"**):
         - Use local terms or analogies familiar to someone from **"${
           preferences?.country
         }"**.
         - For example:
           - If the user is from **"Japan"** and the dish is **"raw fish slices"**, describe it as **"Similar to Sashimi, thin slices of raw fish"**.
      
      3. **Identify top dishes** that match the user's preferences:
         - The user is from **"${preferences?.country}"**.
         - Their preferences are:
           ${
             preferences?.selectedPreferences
               ? JSON.stringify(preferences?.selectedPreferences, null, 2)
               : 'None specified'
           }.
         - Consider their dietary restrictions, allergies, health preferences, cuisine preferences, and any additional information to select dishes that best match their needs.
      
      4. **Output** the data in the following structured format:
      
      \`\`\`json
      {
        "isMenu": true,
        "menuItems": [
          {
            "name": "Dish Name",
            "price": Price as a number or "-",
            "description": "Detailed explanation of the dish in user's dialect and language",
            "recommended": true
          },
          {
            "name": "Dish Name",
            "price": Price as a number or "-",
            "description": "Detailed explanation of the dish in user's dialect and language",
            "recommended": false
          },
          ...
        ]
      }
      \`\`\`
      
      **Please ensure that:**
      
      - All prices are numbers without currency symbols.
      - Descriptions are detailed explanations of the dishes, tailored to the user's dialect and cultural context.
      - Do not just extract the descriptions from the menu; expand upon them to explain what the dish is.
      - **Top dishes align with the user's preferences and dietary requirements.**
      - The response includes only the structured data without additional text.
      - If none of the images are menus, set **"isMenu"** to **false** and return empty arrays for **"menuItems"** and **"topDishes"**.
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
