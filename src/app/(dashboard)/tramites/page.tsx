export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { updateTramiteStatus, deleteTramite } from '@/app/actions' // Añadido deleteTramite
import { Clock, CheckCircle2, MessageSquare, Calendar, Edit3, Trash2 } from 'lucide-react' // Añadidos iconos

export default async function TramitesPage() {
  const supabase = createClient()
  
  // Realizamos la consulta estable
  const { data: tramitesRaw } = await supabase
    .from('tramites')
    .select('*, clientes(razon_social)')
    .order('created_at', { ascending: false })

  const tramites = tramitesRaw || []

  return (
    <div className="space-y-6 px-4">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter italic">TRÁMITES</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1 italic border-l-2 border-blue-600 pl-2 leading-none">Estudio Contable</p>
        </div>
        <Link href="/tramites/nuevo" className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase shadow-xl hover:bg-blue-600 transition-all active:scale-95">
          + Nuevo Trámite
        </Link>
      </div>

      <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest">
            <tr>
              <th className="px-8 py-6">Cliente y Trámite</th>
              <th className="px-8 py-6 text-center italic text-xs uppercase tracking-tighter">Responsable</th>
              <th className="px-8 py-6 text-center uppercase tracking-tighter text-xs">Estado</th>
              <th className="px-8 py-6 text-center uppercase text-xs">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {tramites.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-20 text-slate-400 font-bold uppercase text-xs italic tracking-widest">
                  No hay trámites registrados aún
                </td>
              </tr>
            ) : (
              tramites.map((t: any) => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-8 py-6">
                    <p className="text-blue-600 font-black text-[10px] uppercase mb-1 tracking-tighter leading-none italic font-bold">
                      {t.clientes?.razon_social || 'ESTUDIO'}
                    </p>
                    <p className="text-slate-800 font-black text-xl tracking-tighter leading-none mb-1">
                      {t.tipo_tramite || 'S/N'}
                    </p>
                    {t.fecha_vencimiento && (
                      <div className="inline-flex items-center gap-1.5 text-red-500 text-[9px] font-black uppercase tracking-tighter italic border-t border-red-50 mt-1 pt-1">
                        <Calendar size={10} /> Vence: {t.fecha_vencimiento}
                      </div>
                    )}
                  </td>

                  <td className="px-8 py-6">
                      <div className="w-10 h-10 mx-auto rounded-full bg-slate-950 flex items-center justify-center text-[11px] font-black text-white italic border-4 border-white shadow-lg">
                        {(t.creado_por || 'A').charAt(0)}
                      </div>
                  </td>

                  <td className="px-8 py-6 text-center uppercase italic font-bold">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border-2 ${
                      t.estado === 'pendiente' ? 'bg-orange-50 text-orange-500 border-orange-100/50' : 
                      t.estado === 'en_proceso' ? 'bg-blue-50 text-blue-500 border-blue-100/50' : 
                      'bg-emerald-50 text-emerald-600 border-emerald-100/50 italic uppercase font-black tracking-widest border-2'
                    }`}>
                      {t.estado}
                    </span>
                  </td>

                  <td className="px-8 py-6">
                    <div className="flex gap-2 justify-center items-center">
                      {/* BOTONES DE ESTADO RÁPIDO */}
                      <form action={updateTramiteStatus}>
                         <input type="hidden" name="id" value={t.id} />
                         <input type="hidden" name="nuevoEstado" value="en_proceso" />
                         <button className="h-8 w-8 flex items-center justify-center bg-white rounded-xl text-slate-300 hover:text-blue-600 hover:scale-110 border border-slate-100 shadow-sm transition active:scale-90">
                            <Clock size={15} />
                         </button>
                      </form>

                      <form action={updateTramiteStatus}>
                         <input type="hidden" name="id" value={t.id} />
                         <input type="hidden" name="nuevoEstado" value="finalizado" />
                         <button className="h-8 w-8 flex items-center justify-center bg-white rounded-xl text-slate-300 hover:text-emerald-500 hover:scale-110 border border-slate-100 shadow-sm transition active:scale-90 italic">
                            <CheckCircle2 size={15} />
                         </button>
                      </form>
                      
                      {/* NOTAS */}
                      <Link 
                        href={`/tramites/actualizar-nota?id=${t.id}`}
                        className="h-8 w-8 flex items-center justify-center bg-slate-50 rounded-xl text-slate-300 hover:text-slate-900 transition active:scale-90 italic"
                      >
                         <MessageSquare size={15} />
                      </Link>

                      {/* EDITAR (NUEVO) */}
                      <Link 
                        href={`/tramites/editar?id=${t.id}`}
                        className="h-8 w-8 flex items-center justify-center bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-800 hover:text-white transition active:scale-90"
                        title="Editar trámite"
                      >
                         <Edit3 size={15} />
                      </Link>

                      {/* BORRAR (NUEVO) */}
                      <form action={deleteTramite}>
                        <input type="hidden" name="id" value={t.id} />
                        <button 
                           type="submit"
                           className="h-8 w-8 flex items-center justify-center bg-red-50 rounded-xl text-red-200 hover:bg-red-500 hover:text-white transition border border-red-100 active:scale-90 shadow-sm"
                           onClick={(e) => {if(!confirm("¿Borrar definitivamente este trámite?")) e.preventDefault()}}
                           title="Borrar"
                        >
                           <Trash2 size={15} />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
