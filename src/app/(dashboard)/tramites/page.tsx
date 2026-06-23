export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { updateTramiteStatus, deleteTramite } from '@/app/actions'
import { Clock, CheckCircle2, MessageSquare, Trash2, Calendar } from 'lucide-react'

export default async function TramitesPage() {
  const supabase = createClient()
  const [tramitesRes, clientesRes] = await Promise.all([
    supabase.from('tramites').select('*').order('created_at', { ascending: false }),
    supabase.from('clientes').select('id, razon_social')
  ])

  const tramites = tramitesRes.data || []
  const clientes = clientesRes.data || []

  return (
    <div className="space-y-6 px-4">
      <div className="flex justify-between items-center mb-8 bg-white p-8 rounded-3xl shadow-sm border border-slate-50">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter">TRÁMITES</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Control del estudio</p>
        </div>
        <Link href="/tramites/nuevo" className="bg-slate-950 text-white px-8 py-3 rounded-2xl font-black text-[11px] uppercase shadow-xl hover:bg-blue-600 transition-all">
          + Iniciar Nuevo
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 mt-6">
        {tramites.map((t) => {
          const nombreCliente = clientes.find((c) => c.id === t.cliente_id)?.razon_social || 'ESTUDIO'
          return (
            <div key={t.id} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:border-blue-300">
              
              <div className="flex-1 space-y-1">
                <p className="text-blue-600 font-black text-[10px] uppercase mb-1">{nombreCliente}</p>
                <h3 className="text-xl font-black text-slate-900 tracking-tighter italic uppercase">{t.tipo_tramite}</h3>
                <div className="flex gap-4 mt-2">
                    {t.fecha_vencimiento && <span className="text-red-500 font-black text-[9px] uppercase italic border-b-2 border-red-50"><Calendar size={10} className="inline mr-1"/>Vence: {t.fecha_vencimiento}</span>}
                    <span className="text-slate-300 font-bold text-[8px] uppercase tracking-widest uppercase">Autor: {t.creado_por || 'S'}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border-2 shadow-sm ${
                    t.estado === 'pendiente' ? 'bg-orange-50 text-orange-500 border-orange-100' : 
                    t.estado === 'en_proceso' ? 'bg-blue-50 text-blue-500 border-blue-100' : 
                    'bg-emerald-50 text-emerald-600 border-emerald-100 font-black uppercase italic'
                }`}>
                    {t.estado}
                </span>

                <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl shadow-inner border border-slate-100">
                    <form action={updateTramiteStatus}>
                       <input type="hidden" name="id" value={t.id} />
                       <input type="hidden" name="nuevoEstado" value="en_proceso" />
                       <button className="h-9 w-9 bg-white text-slate-300 hover:text-blue-600 rounded-lg flex items-center justify-center transition shadow-sm"><Clock size={16}/></button>
                    </form>
                    <form action={updateTramiteStatus}>
                       <input type="hidden" name="id" value={t.id} />
                       <input type="hidden" name="nuevoEstado" value="finalizado" />
                       <button className="h-9 w-9 bg-white text-slate-300 hover:text-emerald-500 rounded-lg flex items-center justify-center transition shadow-sm font-black italic"><CheckCircle2 size={16}/></button>
                    </form>
                </div>

                <div className="flex gap-1 border-l border-slate-100 pl-4 items-center">
                    <Link href={`/tramites/actualizar-nota?id=${t.id}`} className="p-3 text-slate-200 hover:text-blue-600 transition"><MessageSquare size={18}/></Link>
                    <form action={deleteTramite}>
                       <input type="hidden" name="id" value={t.id} />
                       <button onClick={(e) => {if(!confirm("¿Borrar trámite definitivamente?")) e.preventDefault()}} className="p-3 text-slate-200 hover:text-red-500 transition"><Trash2 size={18}/></button>
                    </form>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
