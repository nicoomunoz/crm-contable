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
      {/* HEADER SIMPLE */}
      <div className="flex justify-between items-center mb-8 px-4 border-b pb-6 border-slate-100">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic">TRÁMITES</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Estudio Contable</p>
        </div>
        <Link href="/tramites/nuevo" className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase shadow-xl hover:bg-slate-900 transition-all active:scale-95 tracking-widest">
          + Iniciar Nuevo
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 mt-6">
        {tramites.length === 0 ? (
          <div className="bg-white p-20 rounded-[2rem] border border-slate-50 text-center text-slate-300 font-black uppercase text-xs">Sin registros</div>
        ) : (
          tramites.map((t) => {
            const clieNombre = clientes.find((c) => c.id === t.cliente_id)?.razon_social || 'ESTUDIO'
            
            return (
              <div key={t.id} className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:border-blue-200 group relative overflow-hidden">
                
                {/* MARCA DE COLOR LATERAL SEGÚN ESTADO */}
                <div className={`absolute left-0 top-0 h-full w-2 ${
                  t.estado === 'pendiente' ? 'bg-orange-400' : 
                  t.estado === 'en_proceso' ? 'bg-blue-500' : 'bg-emerald-500'
                }`} />

                {/* INFO DEL TRÁMITE */}
                <div className="flex-1 ml-4 space-y-1">
                  <p className="text-blue-600 font-black text-[10px] uppercase italic tracking-tighter">{clieNombre}</p>
                  <h3 className="text-xl font-black text-slate-900 tracking-tighter leading-none italic uppercase">{t.tipo_tramite}</h3>
                  <div className="flex gap-4 items-center mt-2 italic font-bold">
                    {t.fecha_vencimiento && (
                        <span className="text-red-500 text-[9px] font-black uppercase italic bg-red-50 px-2 py-0.5 rounded underline decoration-1 tracking-tighter">
                            VENCE: {t.fecha_vencimiento}
                        </span>
                    )}
                    <span className="text-slate-400 text-[8px] font-black uppercase tracking-widest opacity-60">AUTOR: {t.creado_por || 'SISTEMA'}</span>
                  </div>
                </div>

                {/* GESTION RAPIDA (Estados, Nota y Borrar) */}
                <div className="flex flex-wrap items-center gap-4">
                  
                  {/* ESTADO */}
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border-2 shadow-sm ${
                    t.estado === 'pendiente' ? 'bg-orange-50 text-orange-500 border-orange-100' : 
                    t.estado === 'en_proceso' ? 'bg-blue-50 text-blue-500 border-blue-100' : 
                    'bg-emerald-50 text-emerald-500 border-emerald-100 italic'
                  }`}>
                    {t.estado}
                  </span>

                  {/* CAMBIO ESTADO (Botonera) */}
                  <div className="flex gap-1 bg-slate-100 p-1 border rounded-xl shadow-inner">
                    <form action={updateTramiteStatus}>
                      <input type="hidden" name="id" value={t.id} />
                      <input type="hidden" name="nuevoEstado" value="en_proceso" />
                      <button className="h-8 w-8 bg-white text-slate-300 hover:text-blue-600 rounded-lg flex items-center justify-center transition active:scale-90"><Clock size={16} /></button>
                    </form>
                    <form action={updateTramiteStatus}>
                      <input type="hidden" name="id" value={t.id} />
                      <input type="hidden" name="nuevoEstado" value="finalizado" />
                      <button className="h-8 w-8 bg-white text-slate-300 hover:text-emerald-600 rounded-lg flex items-center justify-center transition active:scale-90 italic"><CheckCircle2 size={16} /></button>
                    </form>
                  </div>

                  {/* ADM (Notas y Borrar) */}
                  <div className="flex gap-2 pl-4 border-l border-slate-100 items-center">
                    <Link href={`/tramites/actualizar-nota?id=${t.id}`} className="p-2.5 bg-slate-50 text-slate-300 hover:bg-slate-900 hover:text-white rounded-xl transition-all italic font-bold">
                        <MessageSquare size={16}/>
                    </Link>
                    <form action={deleteTramite}>
                      <input type="hidden" name="id" value={t.id} />
                      <button 
                        onClick={(e) => { if(!confirm("¿Borrar de la base de datos?")) e.preventDefault() }}
                        className="p-2.5 bg-red-50 text-red-200 hover:bg-red-600 hover:text-white rounded-xl transition border border-red-50"
                      >
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
