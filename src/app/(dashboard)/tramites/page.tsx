import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { updateTramiteStatus, deleteTramite } from '@/app/actions'
import { Clock, CheckCircle2, AlertCircle, MessageSquare, Edit3, Trash2 } from 'lucide-react'

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
        <Link href="/tramites/nuevo" className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black shadow-xl hover:bg-blue-600 transition-all text-xs uppercase tracking-widest">
          + Nuevo Trámite
        </Link>
      </div>

      <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <th className="px-8 py-6">Cliente / Trámite</th>
                <th className="px-8 py-6 text-center">Resp</th>
                <th className="px-8 py-6 text-center">Estado</th>
                <th className="px-8 py-6">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {tramites?.map((t: any) => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-8 py-6">
                    <p className="text-blue-600 font-black text-[10px] uppercase mb-1 tracking-tighter">
                        {t.clientes?.razon_social || 'S/C'}
                    </p>
                    <p className="text-slate-800 font-extrabold text-base leading-tight tracking-tight">
                        {t.tipo_tramite}
                    </p>
                    {t.fecha_vencimiento && (
                        <p className="text-red-500 font-black text-[9px] mt-1 uppercase italic underline tracking-tighter">
                            Vence: {t.fecha_vencimiento}
                        </p>
                    )}
                  </td>

                  <td className="px-8 py-6 text-center text-center">
                    <div className="inline-flex h-9 w-9 rounded-full bg-slate-950 text-white font-black text-[10px] items-center justify-center uppercase shadow-lg border-2 border-white ring-1 ring-slate-200 italic">
                      {t.creado_por?.charAt(0) || 'A'}
                    </div>
                  </td>

                  <td className="px-8 py-6 text-center">
                    <span className={`inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      t.estado === 'pendiente' ? 'bg-orange-50 text-orange-500 border-orange-100' : 
                      t.estado === 'en_proceso' ? 'bg-blue-50 text-blue-500 border-blue-100' :
                      t.estado === 'vencido' ? 'bg-red-50 text-red-600 border-red-100' :
                      'bg-green-50 text-green-600 border-green-100 font-black uppercase'
                    }`}>
                      {t.estado}
                    </span>
                  </td>

                  <td className="px-8 py-6">
                    <div className="flex gap-2 items-center">
                      {/* ESTADOS */}
                      <div className="flex gap-1 border-r border-slate-100 pr-2">
                        <form><button formAction={async () => { 'use server'; await updateTramiteStatus(t.id, 'en_proceso') }} className="p-2 hover:bg-blue-50 text-slate-300 hover:text-blue-500 rounded-lg transition-colors"><Clock size={15} /></button></form>
                        <form><button formAction={async () => { 'use server'; await updateTramiteStatus(t.id, 'finalizado') }} className="p-2 hover:bg-emerald-50 text-slate-300 hover:text-emerald-600 rounded-lg transition-colors"><CheckCircle2 size={15} /></button></form>
                      </div>
                      
                      {/* ADMINISTRACIÓN */}
                      <Link href={`/tramites/editar?id=${t.id}`} className="p-2 bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white rounded-lg transition-all shadow-sm">
                        <Edit3 size={14} />
                      </Link>
                      
                      <Link href={`/tramites/actualizar-nota?id=${t.id}`} className="p-2 bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white rounded-lg transition-all shadow-sm">
                        <MessageSquare size={14} />
                      </Link>
                      
                      <form action={deleteTramite}>
                        <input type="hidden" name="id" value={t.id} />
                        <button 
                            type="submit"
                            className="p-2 bg-red-50 text-red-300 hover:bg-red-600 hover:text-white rounded-lg transition-all border border-red-100/50 shadow-sm"
                            onClick={(e) => { if(!confirm("¿Borrar definitivamente?")) e.preventDefault() }}
                        >
                            <Trash2 size={14} />
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
    </div>
  )
}
