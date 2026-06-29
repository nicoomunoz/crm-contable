import { createClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function GET(request: NextRequest) {
  const supabase = createClient()

  // Verificar sesión
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json([], { status: 401 })

  const tramite_id = request.nextUrl.searchParams.get('tramite_id')

  // Validar que sea UUID válido
  if (!tramite_id || !UUID_REGEX.test(tramite_id)) return NextResponse.json([], { status: 400 })

  const { data, error } = await supabase
    .from('comentarios')
    .select('id, autor, contenido, created_at')
    .eq('tramite_id', tramite_id)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json([], { status: 500 })
  return NextResponse.json(data)
}
