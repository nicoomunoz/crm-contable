export const dynamic = 'force-dynamic' // Obliga a refrescar datos

import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { updateTramiteStatus, deleteTramite } from '@/app/actions'
import { Clock, CheckCircle2, MessageSquare, Edit3, Trash2 } from 'lucide-react'

export default async function TramitesPage() {
  const supabase = createClient()
  
  // Pedimos los datos de forma plana, sin "joins" que marean al servidor
  const { data: rawTramites } = await supabase.from('tramites').select('*').order('created_at', { ascending: false })
  const { data: rawClientes } = await supabase.from('clientes').select('id, razon_social')

  const tramites = rawTramites || []
  const clientes = rawClientes || []

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center px-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter italic uppercase">Trámites</h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1 border-l-2 border-blue-600 pl-2 leading-none italic">Estudio Contable</p>
        </div>
        <Link href="/tramites/nuevo" className="bg-slate-950 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase shadow-2xl hover:bg-blue-600 transition-all">
          + Iniciar Nuevo
        </Link>
      </div>

      <div className="grid gap-4">
        {tramites.map((t: any) => {
          const nombreCliente = clientes.find(c => c.id === t.cliente_id)?.razon_social || 'Estudio'
          
          return (
            <div key={t.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-50 shadow-xl shadow-slate-200/40 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all border-b-4 active:translate-y-1">
              
              <div className="space-y-1">
                 <p className="text-blue-600 font-black text-[10px] uppercase tracking-widest">{nombreCliente}</p>
                 <h2 className="text-2xl font-black text-slate-800 tracking-tighter leading-none">{t.tipo_tramite}</h2>
                 <div className="flex gap-4 items-center">
                    {t.fecha_vencimiento && <p className="text-red-500 font-black text-[10px] uppercase italic tracking-tighter">Vence: {t.fecha_vencimiento}</p>}
                    <p className="text-slate-300 font-black text-[10px] uppercase tracking-widest">RESP: {t.creado_por?.split('@')[0] || 'ADMIN'}</p>
                 </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                  <span className={`px-4 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                    t.estado === 'pendiente' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                    t.estado === 'en_proceso' ? 'bg-blue-50 text-blue-500 border-blue-100' : 
                    'bg-emerald-50 text-emerald-600 border-emerald-100 italic font-black uppercase tracking-[0.2em]'
                  }`}>
                    {t.estado}
                  </span>

                  <div className="flex items-center gap-2 p-1.5 bg-slate-50 border rounded-2xl shadow-inner">
                      {/* BOTÓN EN PROCESO */}
                      <form action={updateTramiteStatus}>
                        <input type="hidden" name="id" value={t.id} />
                        <input type="hidden" name="nuevoEstado" value="en_proceso" />
                        <button className="h-10 w-10 bg-white text-slate-300 hover:text-blue-600 rounded-xl flex items-center justify-center transition-all shadow-sm active:scale-90"><Clock size={16}/></button>
                      </form>

                      {/* BOTÓN FINALIZAR */}
                      <form action={updateTramiteStatus}>
                        <input type="hidden" name="id" value={t.id} />
                        <input type="hidden" name="nuevoEstado" value="finalizado" />
                        <button className="h-10 w-10 bg-white text-slate-300 hover:text-emerald-600 rounded-xl flex items-center justify-center transition-all shadow-sm active:scale-90"><CheckCircle2 size={16}/></button>
                      </form>
                  </div>

                  <div className="flex items-center gap-2 border-l pl-4 border-slate-100">
                      <Link href={`/tramites/editar?id=${t.id}`} className="p-3 bg-slate-100 text-slate-400 hover:bg-slate-900 hover:text-white rounded-xl transition">
                         <Edit3 size={16} />
                      </Link>
                      <Link href={`/tramites/actualizar-nota?id=${t.id}`} className="p-3 bg-slate-100 text-slate-400 hover:bg-blue-600 hover:text-white rounded-xl transition">
                         <MessageSquare size={16} />
                      </Link>
                      <form action={deleteTramite}>
                        <input type="hidden" name="id" value={t.id} />
                        <button onClick={(e) => !confirm('¿Borrar definitivamente?') && e.preventDefault()} className="p-3 bg-red-50 text-red-200 hover:bg-red-500 hover:text-white rounded-xl transition">
                           <Trash2 size={16} />
                        </button>
                      </form>
                  </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
