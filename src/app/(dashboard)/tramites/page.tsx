export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { updateTramiteStatus, deleteTramite } from '@/app/actions'
import { Clock, CheckCircle2, MessageSquare, Edit3, Trash2 } from 'lucide-react'

export default async function TramitesPage() {
  const supabase = createClient()
  
  // Consulta directa sin Joins complejos (La versión segura)
  const { data: tramitesRes } = await supabase.from('tramites').select('*').order('created_at', { ascending: false })
  const { data: clientesRes } = await supabase.from('clientes').select('id, razon_social')

  const tramites = tramitesRes || []
  const clientes = clientesRes || []

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter italic uppercase leading-none">Trámites</h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2 italic border-l-4 border-blue-600 pl-3">Estudio Contable</p>
        </div>
        <Link href="/tramites/nuevo" className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-[11px] uppercase shadow-xl hover:bg-blue-600 transition-all">
          + Iniciar Trámite
        </Link>
      </div>

      <div className="bg-white border border-slate-100 rounded-[2rem] shadow-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <th className="px-10 py-6">Cliente y Trámite</th>
              <th className="px-10 py-6 text-center italic">Resp.</th>
              <th className="px-10 py-6 text-center tracking-tighter">Estado</th>
              <th className="px-10 py-6 text-center uppercase">Gestión</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {tramites.map((t) => {
              // Buscar nombre de cliente de forma manual y segura
              const clie = clientes.find(c => c.id === t.cliente_id)?.razon_social || 'ESTUDIO'

              return (
                <tr key={t.id} className="hover:bg-slate-50/50 transition-all">
                  
                  {/* CLIENTE / TRAMITE */}
                  <td className="px-10 py-6">
                    <p className="text-blue-600 font-black text-[10px] uppercase mb-1 tracking-tighter leading-none italic italic font-bold uppercase tracking-widest">{clie}</p>
                    <p className="text-slate-800 font-black text-xl tracking-tighter leading-none">{t.tipo_tramite}</p>
                    {t.fecha_vencimiento && <p className="text-red-500 font-black text-[9px] uppercase mt-1 italic tracking-widest bg-red-50 inline-block px-1 rounded underline">Vence: {t.fecha_vencimiento}</p>}
                  </td>

                  {/* RESPONSABLE */}
                  <td className="px-10 py-6">
                    <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-[11px] border-4 border-white shadow-md">
                          {(t.creado_por || 'S').charAt(0).toUpperCase()}
                        </div>
                        <span className="text-[10px] text-slate-400 font-black uppercase mt-1 tracking-tighter italic font-bold uppercase">{t.creado_por || 'Admin'}</span>
                    </div>
                  </td>

                  {/* ESTADO */}
                  <td className="px-10 py-6 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        t.estado === 'pendiente' ? 'bg-orange-50 text-orange-500 border-orange-100' : 
                        t.estado === 'en_proceso' ? 'bg-blue-50 text-blue-500 border-blue-100' : 
                        'bg-green-50 text-green-600 border-green-100 italic uppercase font-black tracking-widest border-2'
                      }`}>
                      {t.estado}
                    </span>
                  </td>

                  {/* ACCIONES - SEPARADAS POR TAREAS */}
                  <td className="px-10 py-6">
                    <div className="flex flex-col items-center gap-2">
                       {/* CAMBIO DE ESTADO */}
                       <div className="flex gap-1 bg-slate-50 border p-1 rounded-xl shadow-inner">
                          <form action={updateTramiteStatus}>
                             <input type="hidden" name="id" value={t.id} />
                             <input type="hidden" name="nuevoEstado" value="en_proceso" />
                             <button title="A Proceso" className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-slate-300 hover:text-blue-600 shadow-sm active:scale-90"><Clock size={14}/></button>
                          </form>
                          <form action={updateTramiteStatus}>
                             <input type="hidden" name="id" value={t.id} />
                             <input type="hidden" name="nuevoEstado" value="finalizado" />
                             <button title="Terminar" className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-slate-300 hover:text-green-600 shadow-sm active:scale-90"><CheckCircle2 size={14}/></button>
                          </form>
                       </div>

                       {/* EDITAR / BORRAR / NOTAS */}
                       <div className="flex gap-1 mt-1 border-t pt-2 w-full justify-center border-slate-100">
                          <Link href={`/tramites/editar?id=${t.id}`} className="p-2 text-slate-400 hover:text-slate-900 transition"><Edit3 size={15}/></Link>
                          <Link href={`/tramites/actualizar-nota?id=${t.id}`} className="p-2 text-slate-400 hover:text-blue-600 transition"><MessageSquare size={15}/></Link>
                          <form action={deleteTramite}>
                             <input type="hidden" name="id" value={t.id} />
                             <button onClick={(e) => {if(!confirm("Borrar trámite?")) e.preventDefault()}} className="p-2 text-slate-400 hover:text-red-500 transition"><Trash2 size={15}/></button>
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
