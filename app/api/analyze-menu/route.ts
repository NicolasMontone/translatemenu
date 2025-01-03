import { openai } from '@ai-sdk/openai'
import { generateObject } from 'ai'
import { menuSchema } from '@/schemas/menu'
import sharp from 'sharp'
import { currentUser } from '@clerk/nextjs/server'
import { getPreferencesByClerkId } from '@/db/preferences'
import Replicate from 'replicate'
import { getUserByClerkId } from '@/db/user'
import { imageWebhookUrl } from '../../../webhook-url'
import { saveGeneration } from '../../../db/generations'

export const maxDuration = 60 // This function can run for a maximum of 60 seconds

const REPLICATE_API_TOKEN = 'r8_exSgcUEv6P5vPoZPeM1f2oGKJDDwTTM4NeH5x'
const replicate = new Replicate({
  auth: REPLICATE_API_TOKEN,
})

async function generateImage(
  generationId: string,
  dishName: string,
  description: string
): Promise<string | null> {
  try {
    const prompt = `A professional, appetizing photo of ${dishName}. ${description}. Food photography style, restaurant quality presentation, on a clean plate with subtle garnish, soft natural lighting, shallow depth of field. No text or watermarks.`

    const input = {
      width: 1024,
      height: 1024,
      prompt,
      scheduler: 'K_EULER',
      num_outputs: 1,
      guidance_scale: 0,
      negative_prompt: 'worst quality, low quality',
      num_inference_steps: 4,
    }

    const imageId = crypto.randomUUID()

    const finalImageId = `${generationId}:${imageId}`
    await replicate.predictions.create({
      version:
        '5599ed30703defd1d160a25a63321b4dec97101d98b4674bcc56e41f62f35637',
      input,
      model: 'bytedance/sdxl-lightning-4step',
      webhook: imageWebhookUrl(finalImageId),
    })

    return finalImageId
  } catch (error) {
    console.error(`Failed to generate image for ${dishName}:`, error)
    return null
  }
}

export async function POST(request: Request) {
  try {
    const user = await currentUser()

    if (!user) {
      return new Response('Unauthorized', { status: 401 })
    }
    const supabaseUser = await getUserByClerkId(user.id)

    if (!supabaseUser) {
      return new Response('Unauthorized', { status: 401 })
    }

    if (!supabaseUser.is_pro) {
      return new Response('User is not pro', { status: 403 })
    }

    const preferences = await getPreferencesByClerkId(user.id)

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
            "recommended": true,
            "titleEnglish": "English Name of the Dish",
            "descriptionEnglish": "English Description of the Dish"
          },
          {
            "name": "Dish Name",
            "price": Price as a number or "-",
            "description": "Detailed explanation of the dish in user's dialect and language",
            "recommended": false,
            "titleEnglish": "English Name of the Dish",
            "descriptionEnglish": "English Description of the Dish"
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

    const newGeneration = await saveGeneration({
      user_id: supabaseUser.id.toString(),
      data: result.object,
    })

    if (!result.object.isMenu) {
      return new Response(JSON.stringify(result.object), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Generate images for each menu item sequentially with a for loop
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const resultWithImages: any = { ...result.object }
    for (let i = 0; i < resultWithImages.menuItems.length; i++) {
      const item = resultWithImages.menuItems[i]
      // Only generate images for items with names and descriptions
      if (item.name && item.description) {
        const imageId = await generateImage(
          newGeneration.id.toString(),
          item.titleEnglish,
          item.descriptionEnglish
        )
        resultWithImages.menuItems[i].image = imageId
      }
    }

    // Return the enhanced menu data with images
    const enhancedResult = {
      ...result.object,
      menuItems: resultWithImages.menuItems,
    }

    console.log(JSON.stringify(enhancedResult, null, 2))
    return new Response(JSON.stringify(enhancedResult), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error processing menu:', error)
    return new Response('Error processing menu', { status: 500 })
  }
}
