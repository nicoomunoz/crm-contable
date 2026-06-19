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
      <div className="flex justify-between items-center px-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight italic text-shadow-sm">Trámites</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Control operativo del estudio</p>
        </div>
        <Link href="/tramites/nuevo" className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black shadow-xl hover:bg-blue-600 transition-all text-xs uppercase tracking-widest">
          + Nuevo Trámite
        </Link>
      </div>

      <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest uppercase">
                <th className="px-8 py-6 uppercase tracking-widest">Cliente</th>
                <th className="px-8 py-6 uppercase tracking-widest text-center uppercase">Resp</th>
                <th className="px-8 py-6 uppercase tracking-widest uppercase text-center uppercase">Estado</th>
                <th className="px-8 py-6 uppercase tracking-widest uppercase">Gestión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {tramites?.map((t: any) => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition-all">
                  <td className="px-8 py-6">
                    <p className="text-blue-600 font-black text-[10px] uppercase mb-1">{t.clientes?.razon_social || 'SIN CLIENTE'}</p>
                    <p className="text-slate-800 font-bold text-base leading-none">{t.tipo_tramite}</p>
                    {t.fecha_vencimiento && (
                       <p className="text-red-500 font-black text-[9px] mt-1 uppercase italic underline">Vence: {t.fecha_vencimiento}</p>
                    )}
                  </td>

                  <td className="px-8 py-6 text-center">
                      <div className="inline-flex h-9 w-9 rounded-full bg-slate-900 text-white font-black text-[10px] items-center justify-center uppercase shadow-inner border-4 border-white ring-1 ring-slate-100">
                        {t.creado_por?.charAt(0) || 'S'}
                      </div>
                  </td>

                  <td className="px-8 py-6 text-center uppercase">
                    <span className={`inline-flex px-3 py-1 rounded-full text-[9px] font-black border-2 ${
                      t.estado === 'pendiente' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                      t.estado === 'en_proceso' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      t.estado === 'vencido' ? 'bg-red-50 text-red-600 border-red-100' :
                      'bg-emerald-50 text-emerald-600 border-emerald-100'
                    }`}>
                      {t.estado}
                    </span>
                  </td>

                  <td className="px-8 py-6">
                    <div className="flex gap-4 items-center">
                        <div className="flex gap-1 border-r pr-3 border-slate-100">
                          <form><button formAction={async () => { 'use server'; await updateTramiteStatus(t.id, 'en_proceso') }} className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-500 rounded-lg transition"><Clock size={16}/></button></form>
                          <form><button formAction={async () => { 'use server'; await updateTramiteStatus(t.id, 'finalizado') }} className="p-2 hover:bg-green-50 text-slate-400 hover:text-green-500 rounded-lg transition"><CheckCircle2 size={16}/></button></form>
                        </div>
                        <div className="flex gap-2">
                           <Link href={`/tramites/editar?id=${t.id}`} className="bg-slate-100 text-slate-600 p-2 rounded-lg hover:bg-slate-800 hover:text-white transition shadow-sm"><Edit3 size={14} /></Link>
                           <Link href={`/tramites/actualizar-nota?id=${t.id}`} className="bg-slate-100 text-slate-600 p-2 rounded-lg hover:bg-blue-800 hover:text-white transition shadow-sm"><MessageSquare size={14} /></Link>
                           <form action={async () => { 'use server'; await deleteTramite(t.id) }}>
                              <button className="bg-red-50 text-red-400 p-2 rounded-lg hover:bg-red-600 hover:text-white transition shadow-sm"><Trash2 size={14} /></button>
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
