import { supabase } from './supabase'

export async function getSettings(): Promise<Record<string, string>> {
  const { data } = await supabase
    .from('site_settings')
    .select('key, value')

  if (!data) return {}

  return data.reduce((acc, item) => {
    acc[item.key] = item.value
    return acc
  }, {} as Record<string, string>)
}