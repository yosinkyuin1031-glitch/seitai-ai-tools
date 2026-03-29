import { createClient } from '@/lib/supabase/client'

export interface SavedContent {
  id: string
  user_id: string
  tool_type: 'blog' | 'quiz' | 'diagnosis'
  title: string
  input_data: Record<string, unknown>
  output_data: Record<string, unknown>
  is_favorite: boolean
  created_at: string
  updated_at: string
}

const supabase = createClient()

export async function saveContent(data: {
  tool_type: 'blog' | 'quiz' | 'diagnosis'
  title: string
  input_data: Record<string, unknown>
  output_data: Record<string, unknown>
}) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('ログインが必要です')

  const { data: content, error } = await supabase
    .from('ai_tool_contents')
    .insert({ ...data, user_id: user.id })
    .select()
    .single()

  if (error) throw error
  return content as SavedContent
}

export async function getContents(toolType?: string) {
  let query = supabase
    .from('ai_tool_contents')
    .select('*')
    .order('created_at', { ascending: false })

  if (toolType) {
    query = query.eq('tool_type', toolType)
  }

  const { data, error } = await query
  if (error) throw error
  return (data || []) as SavedContent[]
}

export async function toggleFavorite(id: string, isFavorite: boolean) {
  const { error } = await supabase
    .from('ai_tool_contents')
    .update({ is_favorite: !isFavorite })
    .eq('id', id)

  if (error) throw error
}

export async function deleteContent(id: string) {
  const { error } = await supabase
    .from('ai_tool_contents')
    .delete()
    .eq('id', id)

  if (error) throw error
}
