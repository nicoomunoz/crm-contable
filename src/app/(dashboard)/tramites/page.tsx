export const dynamic = 'force-dynamic' // FORZAR DATOS FRESCOS SIEMPRE

import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { updateTramiteStatus, deleteTramite } from '@/app/actions'
import { Clock, CheckCircle2, MessageSquare, Trash2 } from 'lucide-react'

export default async function TramitesPage() {
  const supabase = createClient()
  
  // CONSULTA BÁSICA POR SEPARADO (MÁS SEGURO)
  const { data: todosLosTramites } = await supabase.from('tramites').select('*')
  const { data: todosLosClientes } = await supabase.from('clientes').select('id, razon_social')

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black italic tracking-tighter">TRÁMITES</h1>
        <Link href="/tramites/nuevo" className="bg-slate-900 text-white px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-blue-600 transition-all">
          + Nuevo
        </Link>
      </div>

      <div className="grid gap-4">
        {todosLosTramites?.length === 0 && (
          <p className="text-slate-400 text-center py-20 font-bold uppercase text-xs">No hay trámites cargados aún.</p>
        )}

        {todosLosTramites?.map((t: any) => {
          const nombreCliente = todosLosClientes?.find(c => c.id === t.cliente_id)?.razon_social || 'Estudio Contable'
          
          return (
            <div key={t.id} className="bg-white border-b-4 border-slate-100 p-6 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-blue-200 transition-all group">
              
              <div className="flex-1">
                <span className="text-blue-600 font-black text-[10px] uppercase italic tracking-widest">{nombreCliente}</span>
                <h3 className="text-xl font-bold text-slate-800 tracking-tight leading-tight my-1 uppercase truncate">{t.tipo_tramite || 'Trámite Sin Nombre'}</h3>
                {t.fecha_vencimiento && <p className="text-red-500 font-black text-[9px] uppercase">Vence: {t.fecha_vencimiento}</p>}
                <p className="text-slate-400 text-[10px] mt-1 italic">Resp: {t.creado_por || 'Administrador'}</p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                 {/* ESTADOS */}
                 <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                   t.estado === 'pendiente' ? 'bg-orange-50 text-orange-500' : 
                   t.estado === 'en_proceso' ? 'bg-blue-50 text-blue-500' : 
                   'bg-emerald-50 text-emerald-500'
                 }`}>
                   {t.estado}
                 </span>

                 {/* GESTION RAPIDA */}
                 <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border">
                    <form action={updateTramiteStatus}>
                       <input type="hidden" name="id" value={t.id} />
                       <input type="hidden" name="nuevoEstado" value="en_proceso" />
                       <button className="h-9 w-9 bg-white text-slate-300 hover:text-blue-600 rounded-xl flex items-center justify-center transition shadow-sm hover:shadow-md"><Clock size={16} /></button>
                    </form>
                    <form action={updateTramiteStatus}>
                       <input type="hidden" name="id" value={t.id} />
                       <input type="hidden" name="nuevoEstado" value="finalizado" />
                       <button className="h-9 w-9 bg-white text-slate-300 hover:text-emerald-600 rounded-xl flex items-center justify-center transition shadow-sm hover:shadow-md"><CheckCircle2 size={16} /></button>
                    </form>
                 </div>

                 {/* EDICION */}
                 <div className="flex items-center gap-1 border-l pl-4 border-slate-200">
                    <Link href={`/tramites/actualizar-nota?id=${t.id}`} className="p-2 text-slate-300 hover:text-blue-600 transition">
                      <MessageSquare size={18} />
                    </Link>
                    <form action={deleteTramite}>
                       <input type="hidden" name="id" value={t.id} />
                       <button onClick={(e) => { if(!confirm("Borrar?")) e.preventDefault() }} className="p-2 text-slate-200 hover:text-red-500 transition">
                          <Trash2 size={18} />
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
