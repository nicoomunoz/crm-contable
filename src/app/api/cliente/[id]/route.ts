import { createClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient()

  // Verificar sesión
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  // Validar que el id sea un UUID válido
  const id = params.id
  if (!UUID_REGEX.test(id)) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })

  const [clienteRes, tramitesRes] = await Promise.all([
    supabase.from('clientes').select('*').eq('id', id).single(),
    supabase.from('tramites')
      .select('id, tipo_tramite, estado, fecha_vencimiento, creado_por, asignado_a')
      .eq('cliente_id', id)
      .order('created_at', { ascending: false })
  ])

  if (!clienteRes.data) return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 })

  return NextResponse.json({
    cliente: clienteRes.data,
    tramites: tramitesRes.data || []
  })
}
