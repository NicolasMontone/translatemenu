import { supabase } from '@/db/supabase'
export async function POST(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string
    }>
  }
) {
  const payload = await req.json()
  const { id } = await params

  const generationId = id.split(':')[0]
  const imageId = id.split(':')[1]

  try {
    // Get the image URL from the Replicate response
    const imageUrl = payload.output[0]

    // Fetch the image
    const imageResponse = await fetch(imageUrl)
    const imageBuffer = await imageResponse.arrayBuffer()

    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from('generations')
      .upload(`${generationId}/${imageId}`, imageBuffer, {
        contentType: 'image/png',
        upsert: true,
      })

    if (error) {
      console.error('Error uploading to Supabase:', error)
      return new Response(JSON.stringify({ error: 'Failed to save image' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error processing image:', error)
    return new Response(JSON.stringify({ error: 'Failed to process image' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
