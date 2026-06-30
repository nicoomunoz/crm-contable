import { createClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { data, error } = await supabase
    .from('documentos_tramite')
    .select('peso')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const totalBytes = (data || []).reduce((sum, d) => sum + (d.peso || 0), 0)
  const totalMB = totalBytes / (1024 * 1024)
  const limiteMB = 1024 // 1GB
  const porcentaje = Math.min((totalMB / limiteMB) * 100, 100)

  return NextResponse.json({
    totalMB: Math.round(totalMB * 100) / 100,
    limiteMB,
    porcentaje: Math.round(porcentaje * 10) / 10,
    cantidadArchivos: data?.length || 0,
  })
}
