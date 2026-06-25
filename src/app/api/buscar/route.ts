import { createClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.trim()
  if (!query || query.length < 2) return NextResponse.json({ clientes: [], tramites: [], comentarios: [] })

  const supabase = createClient()

  const [clientesRes, tramitesRes, comentariosRes] = await Promise.all([
    supabase.from('clientes').select('id, razon_social, cuit, email').ilike('razon_social', `%${query}%`).limit(5),
    supabase.from('tramites').select('id, tipo_tramite, estado, cliente_id, creado_por').ilike('tipo_tramite', `%${query}%`).limit(5),
    supabase.from('comentarios').select('id, contenido, autor, tramite_id, created_at').ilike('contenido', `%${query}%`).limit(5),
  ])

  // Cruzar tramites con clientes
  const clienteIds = [...new Set(tramitesRes.data?.map(t => t.cliente_id) || [])]
  const { data: clientesExtra } = await supabase.from('clientes').select('id, razon_social').in('id', clienteIds)

  const tramitesConCliente = (tramitesRes.data || []).map(t => ({
    ...t,
    razon_social: clientesExtra?.find(c => c.id === t.cliente_id)?.razon_social || 'Cliente'
  }))

  // Cruzar comentarios con tramites
  const tramiteIds = [...new Set(comentariosRes.data?.map(c => c.tramite_id) || [])]
  const { data: tramitesExtra } = await supabase.from('tramites').select('id, tipo_tramite, cliente_id').in('id', tramiteIds)
  const clienteIds2 = [...new Set(tramitesExtra?.map(t => t.cliente_id) || [])]
  const { data: clientesExtra2 } = await supabase.from('clientes').select('id, razon_social').in('id', clienteIds2)

  const comentariosConInfo = (comentariosRes.data || []).map(c => {
    const tramite = tramitesExtra?.find(t => t.id === c.tramite_id)
    const cliente = clientesExtra2?.find(cl => cl.id === tramite?.cliente_id)
    return { ...c, tipo_tramite: tramite?.tipo_tramite, razon_social: cliente?.razon_social }
  })

  return NextResponse.json({
    clientes: clientesRes.data || [],
    tramites: tramitesConCliente,
    comentarios: comentariosConInfo,
  })
}
