import { createClient } from '@/lib/supabase'
import { updateTramite } from '@/app/actions'

export default async function EditarTramitePage({ searchParams }: { searchParams: { id: string } }) {
  const supabase = createClient()
  
  // Traemos los datos actuales y la lista de clientes por si quiere cambiarlo
  const [clientesRes, tramiteRes] = await Promise.all([
    supabase.from('clientes').select('id, razon_social').order('razon_social'),
    supabase.from('tramites').select('*').eq('id', searchParams.id).single()
  ])

  const t = tramiteRes.data

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-50">
        <h1 className="text-3xl font-black text-slate-800 italic mb-2 tracking-tight text-center">Editar Trámite</h1>
        <p className="text-slate-400 text-sm text-center mb-10 font-bold uppercase tracking-widest">Estudio Contable - Gestión</p>

        <form action={updateTramite} className="space-y-6">
          <input type="hidden" name="id" value={t?.id} />

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 px-1 tracking-widest">Asignar a Cliente</label>
            <select name="cliente_id" defaultValue={t?.cliente_id} required className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 text-slate-700 font-bold outline-none focus:border-blue-500 transition-all shadow-inner">
              {clientesRes.data?.map(c => <option key={c.id} value={c.id}>{c.razon_social}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 px-1 tracking-widest">Nombre del Trámite</label>
            <input name="tipo_tramite" defaultValue={t?.tipo_tramite} required className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 text-slate-700 font-bold outline-none focus:border-blue-500 transition-all shadow-inner" />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 px-1 tracking-widest">Vencimiento</label>
            <input name="fecha_vencimiento" type="date" defaultValue={t?.fecha_vencimiento} className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 text-slate-700 font-bold outline-none focus:border-blue-500 transition-all shadow-inner" />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 px-1 tracking-widest">Observaciones</label>
            <textarea name="observaciones" defaultValue={t?.observaciones} rows={3} className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 text-slate-700 font-bold outline-none focus:border-blue-500 transition-all shadow-inner resize-none" />
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" className="flex-1 bg-slate-950 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all">Guardar Cambios</button>
            <a href="/tramites" className="flex-1 bg-slate-100 text-slate-400 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] text-center border border-slate-200">Cancelar</a>
          </div>
        </form>
      </div>
    </div>
  )
}
