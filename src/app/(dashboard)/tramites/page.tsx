import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { updateTramiteStatus, deleteTramite } from '@/app/actions'
import { Clock, CheckCircle2, MessageSquare, Edit3, Trash2, Calendar } from 'lucide-react'

export default async function TramitesPage() {
  const supabase = createClient()
  
  // Consulta ultra simple: pedimos los trámites y los clientes por separado para no fallar
  const [tramitesRes, clientesRes] = await Promise.all([
    supabase.from('tramites').select('*').order('created_at', { ascending: false }),
    supabase.from('clientes').select('id, razon_social')
  ])

  const tramites = tramitesRes.data || []
  const clientes = clientesRes.data || []

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter italic uppercase">Trámites</h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1 italic border-l-2 border-blue-600 pl-2 leading-none">Estudio Contable</p>
        </div>
        <Link href="/tramites/nuevo" className="bg-slate-950 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase shadow-2xl hover:bg-blue-600 transition-all">
          + Nuevo Trámite
        </Link>
      </div>

      <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-300/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <th className="px-8 py-6">Datos de gestión</th>
                <th className="px-8 py-6 text-center">Resp</th>
                <th className="px-8 py-6 text-center">Estado</th>
                <th className="px-8 py-6 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {tramites.map((t) => {
                const nombreCliente = clientes.find(c => c.id === t.cliente_id)?.razon_social || 'Cliente'

                return (
                  <tr key={t.id} className="group hover:bg-slate-50/50 transition-all">
                    <td className="px-8 py-6">
                      <p className="text-blue-600 font-black text-[11px] uppercase mb-1 tracking-tighter leading-none italic">{nombreCliente}</p>
                      <p className="text-slate-900 font-black text-xl tracking-tighter leading-none my-1">{t.tipo_tramite}</p>
                      {t.fecha_vencimiento && (
                        <span className="bg-red-50 text-red-500 font-black text-[9px] uppercase px-2 py-0.5 rounded italic">Vence: {t.fecha_vencimiento}</span>
                      )}
                    </td>
                    
                    <td className="px-8 py-6 text-center uppercase">
                       <div className="h-10 w-10 mx-auto rounded-full bg-slate-950 text-white border-4 border-white shadow-xl flex items-center justify-center font-black text-xs italic">
                         {(t.creado_por || 'S').charAt(0)}
                       </div>
                    </td>

                    <td className="px-8 py-6 text-center uppercase">
                        <span className={`inline-flex px-3 py-1 rounded-xl text-[9px] font-black uppercase border tracking-tighter ${
                            t.estado === 'pendiente' ? 'bg-orange-50 text-orange-500 border-orange-100' : 
                            t.estado === 'en_proceso' ? 'bg-blue-50 text-blue-500 border-blue-100' :
                            t.estado === 'vencido' ? 'bg-red-50 text-red-600 border-red-100' :
                            'bg-emerald-50 text-emerald-600 border-emerald-100 font-black uppercase tracking-[0.2em]'
                        }`}>
                            {t.estado}
                        </span>
                    </td>

                    <td className="px-8 py-6">
                       <div className="flex flex-col gap-4 items-center">
                          {/* CAMBIO ESTADO RAPIDO */}
                          <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl shadow-inner border border-slate-200">
                             <form action={updateTramiteStatus}>
                                <input type="hidden" name="id" value={t.id} />
                                <input type="hidden" name="nuevoEstado" value="en_proceso" />
                                <button className="h-8 w-8 bg-white text-slate-300 hover:text-blue-600 rounded-lg flex items-center justify-center transition shadow-sm"><Clock size={14}/></button>
                             </form>
                             <form action={updateTramiteStatus}>
                                <input type="hidden" name="id" value={t.id} />
                                <input type="hidden" name="nuevoEstado" value="finalizado" />
                                <button className="h-8 w-8 bg-white text-slate-300 hover:text-emerald-600 rounded-lg flex items-center justify-center transition shadow-sm"><CheckCircle2 size={14}/></button>
                             </form>
                          </div>

                          {/* BOTONES ADMINISTRACION */}
                          <div className="flex gap-2 items-center">
                             <Link href={`/tramites/editar?id=${t.id}`} className="p-2 bg-white text-slate-300 hover:text-slate-900 border rounded-lg"><Edit3 size={14}/></Link>
                             <Link href={`/tramites/actualizar-nota?id=${t.id}`} className="p-2 bg-white text-slate-300 hover:text-blue-600 border rounded-lg"><MessageSquare size={14}/></Link>
                             <form action={deleteTramite}>
                                <input type="hidden" name="id" value={t.id} />
                                <button onClick={(e) => !confirm('¿Eliminar trámite?') && e.preventDefault()} className="p-2 bg-red-50 text-red-300 hover:bg-red-600 hover:text-white rounded-lg"><Trash2 size={14}/></button>
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
