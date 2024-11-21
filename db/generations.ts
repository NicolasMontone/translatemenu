import type { Database } from './database.types'
import { supabase } from './supabase'

export async function saveGeneration(
  generation: Database['public']['Tables']['generations']['Insert']
) {
  const { error, data } = await supabase
    .from('generations')
    .insert(generation)
    .select()
    .single()

  if (error) {
    console.error('Error saving generation:', error)
    throw error
  }

  return data
}

export async function updateGenerationById(
  id: string,
  generation: Database['public']['Tables']['generations']['Update']
) {
  const { error } = await supabase
    .from('generations')
    .update(generation)
    .eq('id', id)

  if (error) {
    console.error('Error updating generation:', error)
    throw error
  }
}
