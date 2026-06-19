import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { updateTramiteStatus, deleteTramite } from '@/app/actions'
import { Clock, CheckCircle2, AlertCircle, MessageSquare, Edit3, Trash2 } from 'lucide-react'

export default async function TramitesPage() {
  const supabase = createClient()
  
  // Consulta simplificada para evitar errores de relación
  const { data: tramites, error } = await supabase
    .from('tramites')
    .select('*, clientes(razon_social)')
    .order('created_at', { ascending: false })

  if (error) return <div className="p-10 text-red-500 font-bold">Error cargando datos: {error.message}</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight italic">Trámites</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Control operativo del estudio</p>
        </div>
        <Link href="/tramites/nuevo" className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black shadow-xl hover:bg-blue-600 transition-all text-xs uppercase tracking-widest">
          + Nuevo Trámite
        </Link>
      </div>

      <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <th className="px-8 py-6">Cliente / Trámite</th>
                <th className="px-8 py-6 text-center">Responsable</th>
                <th className="px-8 py-6 text-center">Estado</th>
                <th className="px-8 py-6 text-center tracking-[0.2em]">Gestión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {tramites?.map((t: any) => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition-all">
                  <td className="px-8 py-6">
                    <p className="text-blue-600 font-black text-[10px] uppercase mb-1">
                        {t.clientes?.razon_social || 'Estudio Contable'}
                    </p>
                    <p className="text-slate-800 font-bold text-base leading-tight">
                        {t.tipo_tramite || 'Trámite sin nombre'}
                    </p>
                    {t.fecha_vencimiento && (
                        <p className="text-red-500 font-black text-[9px] mt-1 uppercase italic underline">
                            Vence: {t.fecha_vencimiento}
                        </p>
                    )}
                  </td>

                  <td className="px-8 py-6 text-center">
                    <div className="inline-flex h-10 w-10 rounded-full bg-slate-900 text-white font-black text-[10px] items-center justify-center uppercase shadow-lg border-2 border-white ring-1 ring-slate-100">
                      {(t.creado_por || 'S').charAt(0)}
                    </div>
                  </td>

                  <td className="px-8 py-6 text-center">
                    <span className={`inline-flex px-3 py-1 rounded-full text-[9px] font-black border ${
                      t.estado === 'pendiente' ? 'bg-orange-50 text-orange-500 border-orange-100' : 
                      t.estado === 'en_proceso' ? 'bg-blue-50 text-blue-500 border-blue-100' :
                      t.estado === 'vencido' ? 'bg-red-50 text-red-600 border-red-100' :
                      'bg-green-50 text-green-600 border-green-100'
                    }`}>
                      {t.estado || 'pendiente'}
                    </span>
                  </td>

                  <td className="px-8 py-6">
                    <div className="flex gap-4 items-center justify-center">
                      
                      {/* BOTONES DE ESTADO (MÉTODO ROBUSTO) */}
                      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                        <form action={updateTramiteStatus}>
                            <input type="hidden" name="id" value={t.id} />
                            <input type="hidden" name="nuevoEstado" value="en_proceso" />
                            <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-white rounded-lg transition-all shadow-sm"><Clock size={14} /></button>
                        </form>
                        <form action={updateTramiteStatus}>
                            <input type="hidden" name="id" value={t.id} />
                            <input type="hidden" name="nuevoEstado" value="finalizado" />
                            <button className="p-2 text-slate-400 hover:text-green-500 hover:bg-white rounded-lg transition-all shadow-sm"><CheckCircle2 size={14} /></button>
                        </form>
                      </div>
                      
                      {/* ACCIONES DE EDICIÓN */}
                      <div className="flex gap-1.5 border-l border-slate-100 pl-4">
                        <Link href={`/tramites/editar?id=${t.id}`} className="p-2 text-slate-300 hover:text-slate-900 transition"><Edit3 size={15} /></Link>
                        <Link href={`/tramites/actualizar-nota?id=${t.id}`} className="p-2 text-slate-300 hover:text-blue-600 transition"><MessageSquare size={15} /></Link>
                        
                        <form action={deleteTramite} className="flex">
                           <input type="hidden" name="id" value={t.id} />
                           <button 
                             onClick={(e) => { if(!confirm("¿Borrar definitivamente?")) e.preventDefault() }}
                             className="p-2 text-red-100 hover:text-red-500 transition"
                           >
                             <Trash2 size={15} />
                           </button>
                        </form>
                      </div>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
