export const dynamic = 'force-dynamic' // IMPORTANTE PARA EVITAR ERROR DIGEST EN VERCEL

import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { updateTramiteStatus, deleteTramite } from '@/app/actions'
import { Clock, CheckCircle2, MessageSquare, Trash2, Edit3 } from 'lucide-react'

export default async function TramitesPage() {
  const supabase = createClient()
  
  // CONSULTAS SIMPLES POR SEPARADO
  const { data: rawTramites } = await supabase.from('tramites').select('*').order('created_at', { ascending: false })
  const { data: rawClientes } = await supabase.from('clientes').select('id, razon_social')

  // Normalizamos por si acaso algo viene NULL
  const tramites = rawTramites || []
  const clientes = rawClientes || []

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center mb-8 px-4">
        <h1 className="text-3xl font-black italic">TRÁMITES</h1>
        <Link href="/tramites/nuevo" className="bg-slate-950 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase shadow-xl hover:bg-blue-600 transition-all">+ Nuevo</Link>
      </div>

      <div className="bg-white rounded-[2rem] border shadow-2xl overflow-hidden">
        <table className="w-full text-left">
           <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase">
             <tr>
               <th className="px-8 py-5">Cliente / Trámite</th>
               <th className="px-8 py-5 text-center italic">Resp.</th>
               <th className="px-8 py-5">Estado</th>
               <th className="px-8 py-5 text-center">Acciones</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-slate-50">
             {tramites.map((t: any) => {
               const cliente = clientes.find(c => c.id === t.cliente_id)?.razon_social || 'Cliente Externo'
               return (
                 <tr key={t.id} className="hover:bg-slate-50/50">
                    <td className="px-8 py-6">
                       <p className="text-blue-600 font-black text-[10px] uppercase mb-1">{cliente}</p>
                       <p className="text-slate-800 font-black text-lg leading-tight uppercase truncate">{t.tipo_tramite}</p>
                       {t.fecha_vencimiento && <p className="text-red-500 font-bold text-[9px] uppercase mt-1 italic tracking-widest underline decoration-2">Vence: {t.fecha_vencimiento}</p>}
                    </td>

                    <td className="px-8 py-6 text-center italic">
                       <div className="w-10 h-10 mx-auto rounded-full bg-slate-900 flex items-center justify-center font-black text-white text-[10px] shadow-lg italic">
                          {(t.creado_por || 'S').charAt(0)}
                       </div>
                    </td>

                    <td className="px-8 py-6 text-center italic">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                            t.estado === 'pendiente' ? 'bg-orange-50 text-orange-500 border-2 border-orange-100' : 
                            t.estado === 'en_proceso' ? 'bg-blue-50 text-blue-500 border-2 border-blue-100' :
                            'bg-emerald-50 text-emerald-500 border-2 border-emerald-100 italic'
                        }`}>
                            {t.estado}
                        </span>
                    </td>

                    <td className="px-8 py-6">
                        <div className="flex flex-col gap-4 items-center">
                            {/* ESTADOS */}
                            <div className="flex gap-1.5 p-1 bg-slate-50 border rounded-xl shadow-inner">
                                <form action={updateTramiteStatus}>
                                   <input type="hidden" name="id" value={t.id} />
                                   <input type="hidden" name="nuevoEstado" value="en_proceso" />
                                   <button className="h-8 w-8 bg-white text-slate-300 hover:text-blue-500 rounded-lg flex items-center justify-center transition-all shadow-sm active:scale-90 italic font-black uppercase"><Clock size={15} /></button>
                                </form>
                                <form action={updateTramiteStatus}>
                                   <input type="hidden" name="id" value={t.id} />
                                   <input type="hidden" name="nuevoEstado" value="finalizado" />
                                   <button className="h-8 w-8 bg-white text-slate-300 hover:text-emerald-500 rounded-lg flex items-center justify-center transition-all shadow-sm active:scale-90 italic font-black uppercase"><CheckCircle2 size={15} /></button>
                                </form>
                            </div>

                            {/* ADMINISTRACIÓN */}
                            <div className="flex gap-2">
                                <Link href={`/tramites/editar?id=${t.id}`} className="bg-slate-100 p-2 text-slate-400 rounded-lg hover:bg-slate-800 hover:text-white transition italic font-black uppercase tracking-widest">
                                    <Edit3 size={14}/>
                                </Link>
                                <Link href={`/tramites/actualizar-nota?id=${t.id}`} className="bg-slate-100 p-2 text-slate-400 rounded-lg hover:bg-blue-600 hover:text-white transition italic font-black uppercase tracking-widest text-[9px]">
                                    <MessageSquare size={14}/>
                                </Link>
                                <form action={deleteTramite}>
                                    <input type="hidden" name="id" value={t.id} />
                                    <button onClick={(e) => {if(!confirm('Borrar?')) e.preventDefault()}} className="bg-red-50 p-2 text-red-200 hover:bg-red-500 hover:text-white rounded-lg transition-all italic font-black uppercase tracking-widest">
                                        <Trash2 size={14}/>
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
  )
}
