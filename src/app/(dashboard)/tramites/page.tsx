export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import TramitesTable from './TramitesTable'

export default async function TramitesPage() {
  const supabase = createClient()

  // Traemos Trámites, Clientes y la lista de todos los comentarios (solo el tramite_id)
  const [tramitesRes, clientesRes, comentariosRes] = await Promise.all([
    supabase.from('tramites').select('*').order('created_at', { ascending: false }),
    supabase.from('clientes').select('id, razon_social'),
    supabase.from('comentarios').select('tramite_id') // Solo pedimos el ID del trámite para contar
  ])

  const tramites = tramitesRes.data || []
  const clientes = clientesRes.data || []
  const todosLosComentarios = comentariosRes.data || []

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

      {/* Le pasamos la lista de comentarios al componente de la tabla */}
      <TramitesTable 
        tramites={tramites} 
        clientes={clientes} 
        comentariosRaw={todosLosComentarios} 
      />
    </div>
  )
}
