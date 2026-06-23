export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { updateTramiteStatus, deleteTramite } from '@/app/actions'
import { Clock, CheckCircle2, MessageSquare, Edit3, Trash2, Calendar, User } from 'lucide-react'

export default async function TramitesPage() {
  const supabase = createClient()
  
  // Pedimos los datos (método seguro por separado)
  const { data: tramitesRaw } = await supabase.from('tramites').select('*').order('created_at', { ascending: false })
  const { data: clientesRaw } = await supabase.from('clientes').select('id, razon_social')

  const tramites = tramitesRaw || []
  const clientes = clientesRaw || []

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter italic uppercase leading-none">Trámites</h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-2 italic border-l-4 border-blue-600 pl-3">Estudio Contable</p>
        </div>
        <Link href="/tramites/nuevo" className="bg-slate-950 text-white px-8 py-3 rounded-2xl font-black text-[11px] uppercase shadow-2xl hover:bg-blue-600 transition-all hover:-translate-y-1">
          + Iniciar Nuevo
        </Link>
      </div>

      <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <th className="px-10 py-6">Cliente / Trámite</th>
                <th className="px-10 py-6 text-center">Responsable</th>
                <th className="px-10 py-6 text-center uppercase tracking-tighter">Estado</th>
                <th className="px-10 py-6 text-right">Gestión Administrativa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {tramites.map((t) => {
                const nombreCliente = clientes.find(c => c.id === t.cliente_id)?.razon_social || 'ESTUDIO'
                
                return (
                  <tr key={t.id} className="hover:bg-blue-50/20 transition-all">
                    
                    {/* INFO PRINCIPAL */}
                    <td className="px-10 py-8">
                      <p className="text-blue-600 font-black text-[10px] uppercase mb-1 tracking-tighter leading-none italic">{nombreCliente}</p>
                      <h3 className="text-xl font-black text-slate-900 tracking-tighter leading-none my-1">{t.tipo_tramite}</h3>
                      {t.fecha_vencimiento && (
                        <div className="inline-flex items-center gap-1.5 mt-2 bg-red-50 px-2 py-1 rounded text-red-500 font-black text-[9px] uppercase tracking-tighter">
                            <Calendar size={10} /> VENCE: {new Date(t.fecha_vencimiento).toLocaleDateString()}
                        </div>
                      )}
                    </td>

                    {/* RESPONSABLE CON NOMBRE */}
                    <td className="px-10 py-8">
                       <div className="flex flex-col items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-slate-950 text-white flex items-center justify-center font-black text-xs italic border-4 border-white shadow-lg ring-1 ring-slate-100">
                             {(t.creado_por || 'S').charAt(0)}
                          </div>
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                            {t.creado_por?.split(' ')[0] || 'ADMIN'}
                          </span>
                       </div>
                    </td>

                    {/* ESTADO COLORIDO */}
                    <td className="px-10 py-8 text-center uppercase">
                      <span className={`px-4 py-2 rounded-xl text-[9px] font-black tracking-widest border-2 ${
                        t.estado === 'pendiente' ? 'bg-orange-50 text-orange-500 border-orange-100' : 
                        t.estado === 'en_proceso' ? 'bg-blue-50 text-blue-500 border-blue-100' : 
                        t.estado === 'vencido' ? 'bg-red-50 text-red-500 border-red-100' :
                        'bg-emerald-50 text-emerald-500 border-emerald-100 italic uppercase font-black tracking-[0.2em]'
                      }`}>
                        {t.estado}
                      </span>
                    </td>

                    {/* BOTONERA COMPLETA */}
                    <td className="px-10 py-8 text-right">
                       <div className="flex items-center justify-end gap-3">
                          
                          {/* CAMBIO ESTADO (Formularios seguros) */}
                          <div className="flex gap-1.5 p-1 bg-slate-50 border rounded-2xl shadow-inner mr-2">
                             <form action={updateTramiteStatus}>
                                <input type="hidden" name="id" value={t.id} />
                                <input type="hidden" name="nuevoEstado" value="en_proceso" />
                                <button title="A Proceso" className="h-9 w-9 bg-white text-slate-300 hover:text-blue-500 rounded-xl flex items-center justify-center shadow-sm transition active:scale-90"><Clock size={16} /></button>
                             </form>
                             <form action={updateTramiteStatus}>
                                <input type="hidden" name="id" value={t.id} />
                                <input type="hidden" name="nuevoEstado" value="finalizado" />
                                <button title="Finalizar" className="h-9 w-9 bg-white text-slate-300 hover:text-emerald-500 rounded-xl flex items-center justify-center shadow-sm transition active:scale-90 italic"><CheckCircle2 size={16} /></button>
                             </form>
                          </div>

                          {/* ACCIONES ADMIN */}
                          <div className="flex gap-2 border-l pl-4 border-slate-100">
                             <Link title="Editar trámite" href={`/tramites/editar?id=${t.id}`} className="p-2.5 bg-slate-100 text-slate-400 hover:bg-slate-900 hover:text-white rounded-xl transition shadow-sm border border-slate-200/50">
                                <Edit3 size={16}/>
                             </Link>
                             <Link title="Agregar Nota" href={`/tramites/actualizar-nota?id=${t.id}`} className="p-2.5 bg-slate-100 text-slate-400 hover:bg-blue-600 hover:text-white rounded-xl transition shadow-sm border border-slate-200/50">
                                <MessageSquare size={16}/>
                             </Link>
                             <form action={deleteTramite}>
                                <input type="hidden" name="id" value={t.id} />
                                <button onClick={(e) => { if(!confirm("¿Borrar trámite definitivo?")) e.preventDefault() }} className="p-2.5 bg-red-50 text-red-200 hover:bg-red-500 hover:text-white rounded-xl transition border border-red-100/50 shadow-sm">
                                   <Trash2 size={16} />
                                </button>
                             </form>
                          </div>
                       </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
