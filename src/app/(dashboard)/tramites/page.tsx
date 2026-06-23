export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { updateTramiteStatus, deleteTramite } from '@/app/actions'
import { Clock, CheckCircle2, MessageSquare, Calendar, Edit3, Trash2 } from 'lucide-react'

export default async function TramitesPage() {
  const supabase = createClient()
  
  const [tramitesRes, clientesRes] = await Promise.all([
    supabase.from('tramites').select('*').order('created_at', { ascending: false }),
    supabase.from('clientes').select('id, razon_social')
  ])

  const tramites = tramitesRes.data || []
  const clientes = clientesRes.data || []

  return (
    <div className="space-y-6 px-4 pb-20">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8 bg-slate-900 p-8 rounded-[2rem] text-white shadow-2xl">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter uppercase">Tramites</h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1 border-l-2 border-blue-600 pl-3">Estudio Contable</p>
        </div>
        <Link href="/tramites/nuevo" className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase shadow-xl hover:bg-blue-500 transition-all">
          + Iniciar Nuevo
        </Link>
      </div>

      {/* LISTA DE TRÁMITES */}
      <div className="grid grid-cols-1 gap-6">
        {tramites.length === 0 ? (
          <div className="text-center py-20 text-slate-300 font-black uppercase text-xs">Sin tramites cargados</div>
        ) : (
          tramites.map((t) => {
            const clienteObj = clientes.find(c => c.id === t.cliente_id)
            const nombreCliente = clienteObj ? clienteObj.razon_social : 'ESTUDIO'
            
            return (
              <div key={t.id} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:shadow-2xl transition-all">
                
                {/* INFO */}
                <div className="flex-1 space-y-2">
                  <span className="text-blue-600 font-black text-[10px] uppercase tracking-widest italic">{nombreCliente}</span>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tighter leading-none italic">{t.tipo_tramite}</h2>
                  <div className="flex items-center gap-4 mt-2">
                    {t.fecha_vencimiento && <span className="text-red-500 font-black text-[9px] uppercase italic flex items-center gap-1 border border-red-100 px-2 rounded-lg bg-red-50 py-1"><Calendar size={10} />Vence: {t.fecha_vencimiento}</span>}
                    <span className="text-slate-400 font-bold text-[9px] uppercase italic tracking-tighter bg-slate-50 px-2 py-1 rounded-lg">Responsable: {t.creado_por || 'Admin'}</span>
                  </div>
                </div>

                {/* ACCIONES */}
                <div className="flex flex-wrap items-center gap-4">
                  
                  {/* ESTADO BADGE */}
                  <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                    t.estado === 'pendiente' ? 'bg-orange-50 text-orange-500 border-orange-100' : 
                    t.estado === 'en_proceso' ? 'bg-blue-50 text-blue-500 border-blue-100' : 
                    'bg-emerald-50 text-emerald-500 border-emerald-100'
                  }`}>
                    {t.estado}
                  </div>

                  {/* FORM ESTADO */}
                  <div className="flex gap-1.5 bg-slate-100 p-1 rounded-2xl border shadow-inner">
                    <form action={updateTramiteStatus}>
                      <input type="hidden" name="id" value={t.id} />
                      <input type="hidden" name="nuevoEstado" value="en_proceso" />
                      <button className="h-9 w-9 bg-white text-slate-300 hover:text-blue-600 rounded-xl flex items-center justify-center transition shadow-sm hover:scale-105 active:scale-95"><Clock size={16} /></button>
                    </form>
                    <form action={updateTramiteStatus}>
                      <input type="hidden" name="id" value={t.id} />
                      <input type="hidden" name="nuevoEstado" value="finalizado" />
                      <button className="h-9 w-9 bg-white text-slate-300 hover:text-emerald-500 rounded-xl flex items-center justify-center transition shadow-sm hover:scale-105 active:scale-95 italic"><CheckCircle2 size={16} /></button>
                    </form>
                  </div>

                  {/* BOTONES ADMINISTRACION */}
                  <div className="flex gap-2 pl-4 border-l border-slate-100">
                    <Link href={`/tramites/editar?id=${t.id}`} className="h-10 w-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-slate-900 hover:text-white transition shadow-sm border border-slate-200">
                      <Edit3 size={16} />
                    </Link>
                    <Link href={`/tramites/actualizar-nota?id=${t.id}`} className="h-10 w-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition shadow-sm border border-slate-200 font-black">
                      <MessageSquare size={16} />
                    </Link>
                    <form action={deleteTramite}>
                      <input type="hidden" name="id" value={t.id} />
                      <button onClick={(e) => !confirm('¿Eliminar trámite definitivo?') && e.preventDefault()} className="h-10 w-10 bg-red-50 text-red-200 rounded-xl flex items-center justify-center hover:bg-red-600 hover:text-white transition border border-red-100 shadow-sm">
                        <Trash2 size={16} />
                      </button>
                    </form>
                  </div>
                </div>

              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
