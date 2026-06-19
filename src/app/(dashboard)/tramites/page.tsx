import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { updateTramiteStatus, updateTramiteObservacion } from '@/app/actions'
import { Clock, CheckCircle2, AlertCircle, MessageSquare, Calendar } from 'lucide-react'

export default async function TramitesPage() {
  const supabase = createClient()
  const { data: tramites } = await supabase
    .from('tramites')
    .select('*, clientes(razon_social)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight italic">Trámites</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Control operativo del estudio</p>
        </div>
        <Link href="/tramites/nuevo" className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black shadow-xl hover:bg-blue-600 transition-all active:scale-95 text-xs uppercase tracking-[0.1em]">
          + Nuevo Trámite
        </Link>
      </div>

      <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                <th className="px-8 py-6">Cliente y Trámite</th>
                <th className="px-8 py-6">Responsable</th>
                <th className="px-8 py-6">Estado</th>
                <th className="px-8 py-6">Observaciones</th>
                <th className="px-8 py-6 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {tramites?.map((t: any) => (
                <tr key={t.id} className="hover:bg-blue-50/30 transition-all group">
                  <td className="px-8 py-6">
                    <p className="font-black text-blue-600 text-[11px] uppercase tracking-tighter mb-1">{t.clientes?.razon_social}</p>
                    <p className="text-slate-800 font-bold text-lg leading-none mb-2 tracking-tight">{t.tipo_tramite}</p>
                    {t.fecha_vencimiento && (
                      <div className="inline-flex items-center gap-1.5 bg-red-50 text-red-500 px-2 py-1 rounded-md text-[9px] font-black uppercase">
                        <Calendar size={10} /> Vence: {new Date(t.fecha_vencimiento).toLocaleDateString()}
                      </div>
                    )}
                  </td>

                  <td className="px-8 py-6 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-[11px] font-black text-white uppercase border-4 border-white shadow-lg">
                        {t.creado_por?.charAt(0) || 'S'}
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{t.creado_por || 'Sistema'}</span>
                    </div>
                  </td>

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

                  <td className="px-8 py-6 min-w-[250px]">
                    <div className="relative group/note">
                      <p className="text-sm text-slate-500 italic bg-slate-50/50 p-3 rounded-xl border border-dashed border-slate-200 line-clamp-2 hover:line-clamp-none transition-all cursor-default">
                         {t.observaciones || 'Sin anotaciones adicionales...'}
                      </p>
                      <Link 
                        href={`/tramites/actualizar-nota?id=${t.id}`}
                        className="absolute -top-2 -right-2 bg-white shadow-md p-1.5 rounded-full border border-slate-100 text-slate-400 hover:text-blue-600 hidden group-hover/note:block transition"
                      >
                        <MessageSquare size={14} />
                      </Link>
                    </div>
                  </td>

                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-2">
                      <form className="grid grid-cols-3 gap-1">
                        <button formAction={async () => { 'use server'; await updateTramiteStatus(t.id, 'en_proceso') }} className="flex items-center justify-center p-2 bg-white border border-slate-100 rounded-lg text-slate-400 hover:text-blue-500 hover:border-blue-200 transition shadow-sm"><Clock size={16} /></button>
                        <button formAction={async () => { 'use server'; await updateTramiteStatus(t.id, 'finalizado') }} className="flex items-center justify-center p-2 bg-white border border-slate-100 rounded-lg text-slate-400 hover:text-green-500 hover:border-green-200 transition shadow-sm"><CheckCircle2 size={16} /></button>
                        <button formAction={async () => { 'use server'; await updateTramiteStatus(t.id, 'vencido') }} className="flex items-center justify-center p-2 bg-white border border-slate-100 rounded-lg text-slate-400 hover:text-red-500 hover:border-red-200 transition shadow-sm"><AlertCircle size={16} /></button>
                      </form>
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
