import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import PCDetail from './PCDetail'

export default async function PCPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: pc } = await supabase
    .from('prebuilt_pcs')
    .select('*, prebuilt_variants(*)')
    .eq('id', id)
    .single()

  if (!pc) notFound()

  return <PCDetail pc={pc} />
}