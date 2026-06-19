import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { updateTramiteStatus, deleteTramite } from '@/app/actions'
import { Clock, CheckCircle2, AlertCircle, MessageSquare, Calendar, Edit3, Trash2 } from 'lucide-react'

export default async function TramitesPage() {
  const supabase = createClient()
  const { data: tramites } = await supabase
    .from('tramites')
    .select('*, clientes(razon_social)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center px-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight italic">Trámites</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Control operativo del estudio</p>
        </div>
        <Link href="/tramites/nuevo" className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black shadow-xl hover:bg-blue-600 transition-all active:scale-95 text-xs uppercase tracking-[0.1em]">
          + Nuevo Trámite
        </Link>
      </div>

      {/* TABLA PRINCIPAL */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                <th className="px-8 py-6">Cliente y Trámite</th>
                <th className="px-8 py-6 text-center">Responsable</th>
                <th className="px-8 py-6">Estado</th>
                <th className="px-8 py-6">Observaciones</th>
                <th className="px-8 py-6 text-center">Gestión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {tramites?.map((t: any) => (
                <tr key={t.id} className="hover:bg-blue-50/20 transition-all group">
                  
                  {/* CLIENTE Y TRÁMITE */}
                  <td className="px-8 py-6">
                    <p className="font-black text-blue-600 text-[11px] uppercase tracking-tighter mb-1">{t.clientes?.razon_social}</p>
                    <p className="text-slate-800 font-bold text-lg leading-none mb-2 tracking-tight">{t.tipo_tramite}</p>
                    {t.fecha_vencimiento && (
                      <div className="inline-flex items-center gap-1.5 bg-red-50 text-red-500 px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter">
                        <Calendar size={10} /> Vence: {new Date(t.fecha_vencimiento).toLocaleDateString()}
                      </div>
                    )}
                  </td>

                  {/* RESPONSABLE */}
                  <td className="px-8 py-6 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-10 h-10 rounded-full bg-slate-950 flex items-center justify-center text-[11px] font-black text-white uppercase border-4 border-white shadow-lg italic">
                        {t.creado_por?.charAt(0) || 'S'}
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                        {t.creado_por?.split(' ')[0] || 'Sistema'}
                      </span>
                    </div>
                  </td>

                  {/* ESTADO */}
                  <td className="px-8 py-6">
                    <span className={`inline-flex px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 ${
                      t.estado === 'pendiente' ? 'bg-orange-50 text-orange-500 border-orange-100' : 
                      t.estado === 'en_proceso' ? 'bg-blue-50 text-blue-500 border-blue-100' :
                      t.estado === 'vencido' ? 'bg-red-50 text-red-600 border-red-100' :
                      'bg-emerald-50 text-emerald-600 border-emerald-100'
                    }`}>
                      {t.estado}
                    </span>
                  </td>

                  {/* OBSERVACIONES EDITABLES */}
                  <td className="px-8 py-6 min-w-[200px]">
                    <div className="relative group/note">
                      <p className="text-xs text-slate-500 italic bg-slate-50/50 p-4 rounded-2xl border border-dashed border-slate-200 line-clamp-2 hover:line-clamp-none transition-all cursor-default leading-relaxed">
                         {t.observaciones || 'Sin anotaciones...'}
                      </p>
                      <Link 
                        href={`/tramites/actualizar-nota?id=${t.id}`}
                        className="absolute -top-2 -right-2 bg-slate-900 shadow-xl p-2 rounded-full text-white hover:bg-blue-600 scale-0 group-hover/note:scale-100 transition-all duration-200"
                      >
                        <MessageSquare size={12} />
                      </Link>
                    </div>
                  </td>

                  {/* ACCIONES (CAMBIO DE ESTADO, EDITAR Y BORRAR) */}
                  <td className="px-8 py-6 text-center">
                    <div className="flex flex-col items-center gap-3">
                      {/* BOTONES ESTADO RÁPIDO */}
                      <form className="flex gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 shadow-inner">
                        <button formAction={async () => { 'use server'; await updateTramiteStatus(t.id, 'en_proceso') }} title="En Proceso" className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-slate-400 hover:text-blue-500 transition shadow-sm active:scale-90"><Clock size={14} /></button>
                        <button formAction={async () => { 'use server'; await updateTramiteStatus(t.id, 'finalizado') }} title="Finalizar" className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-slate-400 hover:text-green-500 transition shadow-sm active:scale-90"><CheckCircle2 size={14} /></button>
                        <button formAction={async () => { 'use server'; await updateTramiteStatus(t.id, 'vencido') }} title="Vencido" className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-slate-400 hover:text-red-500 transition shadow-sm active:scale-90"><AlertCircle size={14} /></button>
                      </form>

                      {/* BOTONES ADMINISTRATIVOS */}
                      <div className="flex gap-2">
                        <Link 
                          href={`/tramites/editar?id=${t.id}`}
                          className="flex items-center gap-2 bg-slate-950 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter hover:bg-slate-700 transition"
                        >
                          <Edit3 size={12} /> Editar
                        </Link>

                        <form action={deleteTramite} className="inline">
                          <input type="hidden" name="id" value={t.id} />
                          <button 
                            type="submit" 
                            className="flex items-center gap-2 bg-red-50 text-red-500 border border-red-100 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter hover:bg-red-500 hover:text-white transition"
                            onClick={(e) => {
                                if(!confirm("¿Borrar definitivamente?")) e.preventDefault()
                            }}
                          >
                            <Trash2 size={12} /> Borrar
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
