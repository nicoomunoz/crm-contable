import { createClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const tramite_id = request.nextUrl.searchParams.get('tramite_id')
  const supabase = createClient()

  const { data, error } = await supabase
    .from('comentarios')
    .select('id, autor, contenido, created_at')
    .eq('tramite_id', tramite_id as string)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json([], { status: 500 })
  return NextResponse.json(data)
}
