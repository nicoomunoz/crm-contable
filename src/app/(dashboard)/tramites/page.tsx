export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import TramitesTable from './TramitesTable'

export default async function TramitesPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const nombreUsuarioActual = user?.user_metadata?.full_name || user?.email?.split('@')[0] || ''

  const [tramitesRes, clientesRes, comentariosRes, usuariosRes] = await Promise.all([
    supabase.from('tramites').select('*').order('created_at', { ascending: false }),
    supabase.from('clientes').select('id, razon_social'),
    supabase.from('comentarios').select('tramite_id'),
    supabase.from('usuarios').select('nombre, es_jefe').order('nombre'),
  ])

  const tramites = tramitesRes.data || []
  const clientes = clientesRes.data || []
  const todosLosComentarios = comentariosRes.data || []
  const usuarios = usuariosRes.data || []

  const tramitesConCliente = tramites.map(t => ({
    ...t,
    clientes: clientes.find(c => c.id === t.cliente_id) || null
  }))

  return (
    <div className="space-y-6 px-4">
      <div className="flex justify-between items-end px-2">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-blue-600 mb-1">Estudio Grimalt</p>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Trámites</h1>
        </div>
        <Link href="/tramites/nuevo" className="bg-slate-950 text-white px-8 py-3.5 rounded-2xl font-black text-[11px] uppercase shadow-2xl hover:bg-blue-600 transition-all active:scale-95 tracking-widest">
          + Iniciar Nuevo
        </Link>
      </div>
      <TramitesTable
        tramites={tramitesConCliente}
        clientes={clientes}
        comentariosRaw={todosLosComentarios}
        usuarios={usuarios}
        nombreUsuarioActual={nombreUsuarioActual}
      />
    </div>
  )
}
