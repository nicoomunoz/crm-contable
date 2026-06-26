import { createClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const id = params.id

  const [clienteRes, tramitesRes] = await Promise.all([
    supabase.from('clientes').select('*').eq('id', id).single(),
    supabase.from('tramites')
      .select('id, tipo_tramite, estado, fecha_vencimiento, creado_por, asignado_a')
      .eq('cliente_id', id)
      .order('created_at', { ascending: false })
  ])

  return NextResponse.json({
    cliente: clienteRes.data,
    tramites: tramitesRes.data || []
  })
}
