import { supabase } from '@/db/supabase'

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string
    }>
  }
) {
  const { id } = await params

  const [generationId, imageId] = id.split(':')
  const path = `${generationId}/${imageId}`

  try {
    // Download the image from Supabase Storage
    const { data, error } = await supabase.storage
      .from('generations')
      .download(path)

    if (error || !data) {
      console.error('Error fetching image:', error)
      return new Response('Image not found', { status: 404 })
    }

    // Convert the blob to an array buffer
    const arrayBuffer = await data.arrayBuffer()

    // Return the image with proper content type
    return new Response(arrayBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error processing image request:', error)
    return new Response('Error processing image', { status: 500 })
  }
}
