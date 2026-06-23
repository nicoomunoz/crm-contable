import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { updateTramiteStatus } from '@/app/actions'
import { Clock, CheckCircle2, MessageSquare, Calendar } from 'lucide-react'

export default async function TramitesPage() {
  const supabase = createClient()
  
  // Usamos el select que sabíamos que funcionaba
  const { data: tramites } = await supabase
    .from('tramites')
    .select('*, clientes(razon_social)')
    .order('created_at', { ascending: false })

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
              <th className="px-8 py-6 text-center italic">Resp.</th>
              <th className="px-8 py-6 text-center uppercase tracking-tighter">Estado</th>
              <th className="px-8 py-6 text-center uppercase">Cambiar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {tramites?.map((t: any) => (
              <tr key={t.id} className="hover:bg-slate-50/50 transition-all">
                <td className="px-8 py-6">
                  <p className="text-blue-600 font-black text-[10px] uppercase mb-1 tracking-tighter">{t.clientes?.razon_social || 'Cliente'}</p>
                  <p className="text-slate-800 font-black text-xl tracking-tighter leading-none mb-1">{t.tipo_tramite}</p>
                  {t.fecha_vencimiento && (
                    <div className="inline-flex items-center gap-1.5 text-red-500 text-[9px] font-black uppercase tracking-tighter italic border-t border-red-100 mt-1 pt-1">
                      <Calendar size={10} /> Vence: {t.fecha_vencimiento}
                    </div>
                  )}
                </td>

                <td className="px-8 py-6 text-center uppercase">
                    <div className="w-10 h-10 mx-auto rounded-full bg-slate-950 flex items-center justify-center text-[10px] font-black text-white italic border-2 border-white shadow-lg">
                      {t.creado_por?.charAt(0) || 'S'}
                    </div>
                </td>

                <td className="px-8 py-6 text-center uppercase">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    t.estado === 'pendiente' ? 'bg-orange-50 text-orange-500 border-orange-100' : 
                    t.estado === 'en_proceso' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                    'bg-emerald-50 text-emerald-600 border-emerald-100 italic uppercase font-black tracking-widest'
                  }`}>
                    {t.estado}
                  </span>
                </td>

                <td className="px-8 py-6">
                  <div className="flex gap-2 justify-center">
                    <form action={updateTramiteStatus}>
                       <input type="hidden" name="id" value={t.id} />
                       <input type="hidden" name="nuevoEstado" value="en_proceso" />
                       <button className="h-9 w-9 flex items-center justify-center bg-slate-50 rounded-xl text-slate-300 hover:text-blue-500 hover:bg-white border hover:border-blue-100 shadow-sm transition active:scale-90 italic">
                          <Clock size={16} />
                       </button>
                    </form>

                    <form action={updateTramiteStatus}>
                       <input type="hidden" name="id" value={t.id} />
                       <input type="hidden" name="nuevoEstado" value="finalizado" />
                       <button className="h-9 w-9 flex items-center justify-center bg-slate-50 rounded-xl text-slate-300 hover:text-emerald-500 hover:bg-white border hover:border-emerald-100 shadow-sm transition active:scale-90 italic font-black uppercase">
                          <CheckCircle2 size={16} />
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
  )
}
