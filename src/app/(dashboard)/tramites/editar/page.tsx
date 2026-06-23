import { createClient } from '@/lib/supabase'
import { updateTramite } from '@/app/actions'
import { redirect } from 'next/navigation'

export default async function EditarTramitePage({ searchParams }: { searchParams: { id: string } }) {
  const supabase = createClient()
  
  if (!searchParams.id) redirect('/tramites')

  const [clientesRes, tramiteRes] = await Promise.all([
    supabase.from('clientes').select('id, razon_social').order('razon_social'),
    supabase.from('tramites').select('*').eq('id', searchParams.id).single()
  ])

  const t = tramiteRes.data
  
  // PROTECCIÓN CRÍTICA:
  if (!t) redirect('/tramites')

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-slate-900"></div>
        
        <h1 className="text-3xl font-black text-slate-800 italic mb-2 tracking-tighter text-center uppercase">Editar Trámite</h1>
        <p className="text-slate-400 text-[10px] font-black uppercase text-center mb-10 tracking-[0.3em] border-b pb-4 inline-block w-full">Gestión de datos de cliente</p>

        <form action={updateTramite} className="space-y-6">
          <input type="hidden" name="id" value={t.id} />

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 px-1 tracking-widest italic font-bold">Cliente</label>
            <select name="cliente_id" defaultValue={t.cliente_id} required className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 text-slate-700 font-bold outline-none focus:border-blue-600 transition-all shadow-inner">
              {clientesRes.data?.map(c => <option key={c.id} value={c.id}>{c.razon_social}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 px-1 tracking-widest italic font-bold">Trámite</label>
            <input name="tipo_tramite" defaultValue={t.tipo_tramite} required className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 text-slate-700 font-bold outline-none focus:border-blue-600 transition-all shadow-inner uppercase tracking-tighter" />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 px-1 tracking-widest italic font-bold">Fecha Vencimiento</label>
            <input name="fecha_vencimiento" type="date" defaultValue={t.fecha_vencimiento} className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 text-slate-700 font-bold outline-none focus:border-blue-600 transition-all shadow-inner" />
          </div>

          <div className="flex gap-4 pt-6">
            <button type="submit" className="flex-1 bg-slate-950 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all active:scale-95">Guardar Cambios</button>
            <a href="/tramites" className="flex-1 bg-slate-50 text-slate-300 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest text-center border border-slate-100">Cancelar</a>
          </div>
        </form>
      </div>
    </div>
  )
}
