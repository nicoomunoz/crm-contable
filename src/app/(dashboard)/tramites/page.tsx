export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { updateTramiteStatus, deleteTramite } from '@/app/actions'
import { Clock, CheckCircle2, MessageSquare, Calendar, Trash2 } from 'lucide-react'

export default async function TramitesPage() {
  const supabase = createClient()
  
  const { data: tramitesRaw } = await supabase
    .from('tramites')
    .select('*, clientes(razon_social)')
    .order('created_at', { ascending: false })

  const tramites = tramitesRaw || []

  return (
    <div className="space-y-6 px-4">
      {/* HEADER */}
      <div className="flex justify-between items-end mb-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter italic">TRÁMITES</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1 italic border-l-2 border-blue-600 pl-2">Estudio Contable</p>
        </div>
        <Link href="/tramites/nuevo" className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase shadow-xl hover:bg-blue-600 transition-all active:scale-95">
          + Nuevo Trámite
        </Link>
      </div>

      <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200/50">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest uppercase">
            <tr>
              <th className="px-8 py-6 uppercase tracking-[0.2em]">Trámite y Cliente</th>
              <th className="px-8 py-6 text-center italic uppercase tracking-tighter uppercase tracking-[0.2em]">Resp.</th>
              <th className="px-8 py-6 text-center uppercase tracking-tighter uppercase tracking-[0.2em]">Estado</th>
              <th className="px-8 py-6 text-center uppercase tracking-[0.2em]">Observaciones</th>
              <th className="px-8 py-6 text-right uppercase tracking-[0.2em]">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {tramites.map((t: any) => (
              <tr key={t.id} className="hover:bg-blue-50/30 transition-all group border-b border-slate-50">
                <td className="px-8 py-6">
                  <p className="text-blue-600 font-black text-[10px] uppercase mb-1 tracking-tighter font-bold uppercase italic">{t.clientes?.razon_social || 'ESTUDIO'}</p>
                  <p className="text-slate-800 font-black text-lg tracking-tighter leading-none">{t.tipo_tramite}</p>
                  {t.fecha_vencimiento && (
                    <div className="inline-flex items-center gap-1.5 text-red-500 text-[9px] font-black uppercase tracking-tighter italic border-t border-red-50 mt-1 pt-1 italic font-bold">
                      <Calendar size={10} /> Vence: {t.fecha_vencimiento}
                    </div>
                  )}
                </td>

                <td className="px-8 py-6">
                  <div className="w-10 h-10 mx-auto rounded-full bg-slate-950 flex items-center justify-center text-[11px] font-black text-white italic border-4 border-white shadow-lg italic">
                    {(t.creado_por || 'A').charAt(0)}
                  </div>
                </td>

                <td className="px-8 py-6 text-center italic">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border-2 ${
                    t.estado === 'pendiente' ? 'bg-orange-50 text-orange-500 border-orange-100/50' : 
                    t.estado === 'en_proceso' ? 'bg-blue-50 text-blue-500 border-blue-100/50' : 
                    'bg-emerald-50 text-emerald-600 border-emerald-100/50 italic font-black uppercase border-2'
                  }`}>
                    {t.estado}
                  </span>
                </td>

                {/* --- NUEVA COLUMNA: OBSERVACIONES --- */}
                <td className="px-8 py-6">
                    <p className="text-slate-400 text-xs italic line-clamp-2 max-w-[200px] group-hover:text-slate-600 transition-colors leading-relaxed">
                        {t.observaciones || "Sin novedades..."}
                    </p>
                </td>

                <td className="px-8 py-6 text-right">
                  <div className="flex gap-2 justify-end items-center">
                    
                    {/* Botones de Cambio Rápido */}
                    <div className="flex gap-1 bg-slate-50 border rounded-xl p-1 shadow-inner">
                        <form action={updateTramiteStatus}>
                            <input type="hidden" name="id" value={t.id} />
                            <input type="hidden" name="nuevoEstado" value="en_proceso" />
                            <button className="h-8 w-8 bg-white text-slate-300 hover:text-blue-600 rounded-lg flex items-center justify-center shadow-sm"><Clock size={14}/></button>
                        </form>
                        <form action={updateTramiteStatus}>
                            <input type="hidden" name="id" value={t.id} />
                            <input type="hidden" name="nuevoEstado" value="finalizado" />
                            <button className="h-8 w-8 bg-white text-slate-300 hover:text-emerald-600 rounded-lg flex items-center justify-center shadow-sm italic"><CheckCircle2 size={14}/></button>
                        </form>
                    </div>
                    
                    {/* Editar Nota y Borrar */}
                    <Link href={`/tramites/actualizar-nota?id=${t.id}`} className="h-9 w-9 bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white border rounded-xl flex items-center justify-center transition-all italic font-black">
                        <MessageSquare size={16} />
                    </Link>

                    <form action={deleteTramite}>
                        <input type="hidden" name="id" value={t.id} />
                        <button 
                            type="submit" 
                            onClick={(e) => !confirm("¿Borrar?") && e.preventDefault()} 
                            className="h-9 w-9 bg-red-50 text-red-200 hover:bg-red-600 hover:text-white border border-red-50 rounded-xl flex items-center justify-center transition"
                        >
                            <Trash2 size={16}/>
                        </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
