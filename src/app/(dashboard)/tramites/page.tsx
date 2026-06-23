export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { updateTramiteStatus, deleteTramite } from '@/app/actions'
import { Clock, CheckCircle2, MessageSquare, Calendar, Edit3, Trash2 } from 'lucide-react'

export default async function TramitesPage() {
  const supabase = createClient()
  
  // Realizamos las dos consultas por SEPARADO (Esto es lo más seguro contra errores de servidor)
  const { data: rawTramites } = await supabase.from('tramites').select('*').order('created_at', { ascending: false })
  const { data: rawClientes } = await supabase.from('clientes').select('id, razon_social')

  const tramites = rawTramites || []
  const clientes = rawClientes || []

  return (
    <div className="space-y-6 px-4 pb-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter">TRÁMITES</h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1 border-l-2 border-blue-600 pl-2 leading-none italic">Estudio Contable</p>
        </div>
        <Link href="/tramites/nuevo" className="bg-slate-950 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase shadow-2xl hover:bg-blue-600 transition-all">
          + Iniciar Nuevo
        </Link>
      </div>

      <div className="grid gap-4">
        {tramites.map((t: any) => {
          const cliente = clientes.find(c => c.id === t.cliente_id)?.razon_social || 'ESTUDIO'

          return (
            <div key={t.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-50 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:border-blue-100">
              
              {/* IZQUIERDA: CLIENTE / TRÁMITE */}
              <div className="flex-1 space-y-1">
                <p className="text-blue-600 font-black text-[10px] uppercase tracking-tighter italic leading-none">{cliente}</p>
                <h3 className="text-2xl font-black text-slate-800 tracking-tighter leading-none my-1">{t.tipo_tramite || 'Trámite'}</h3>
                {t.fecha_vencimiento && <p className="text-red-500 font-black text-[10px] uppercase tracking-tighter italic italic underline">Vence: {t.fecha_vencimiento}</p>}
                <div className="flex gap-2 items-center text-slate-400 text-[10px] font-bold mt-2 italic uppercase">
                    <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center italic text-slate-600">{t.creado_por?.charAt(0) || 'A'}</span>
                    <span>{t.creado_por || 'Administrador'}</span>
                </div>
              </div>

              {/* DERECHA: GESTIÓN */}
              <div className="flex flex-wrap items-center gap-4">
                 
                 <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                   t.estado === 'pendiente' ? 'bg-orange-50 text-orange-500 border-orange-100' : 
                   t.estado === 'en_proceso' ? 'bg-blue-50 text-blue-500 border-blue-100' : 
                   'bg-emerald-50 text-emerald-500 border-emerald-100 font-black tracking-widest'
                 }`}>
                   {t.estado}
                 </span>

                 <div className="flex items-center gap-2 p-1.5 bg-slate-50 border rounded-2xl">
                    <form action={updateTramiteStatus}>
                       <input type="hidden" name="id" value={t.id} />
                       <input type="hidden" name="nuevoEstado" value="en_proceso" />
                       <button className="h-9 w-9 bg-white text-slate-300 hover:text-blue-600 rounded-xl flex items-center justify-center transition shadow-sm active:scale-90 italic"><Clock size={16} /></button>
                    </form>
                    <form action={updateTramiteStatus}>
                       <input type="hidden" name="id" value={t.id} />
                       <input type="hidden" name="nuevoEstado" value="finalizado" />
                       <button className="h-9 w-9 bg-white text-slate-300 hover:text-emerald-600 rounded-xl flex items-center justify-center transition shadow-sm active:scale-90 italic"><CheckCircle2 size={16} /></button>
                    </form>
                 </div>

                 <div cla
