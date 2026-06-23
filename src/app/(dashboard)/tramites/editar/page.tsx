import { createClient } from '@/lib/supabase'
import { updateTramite } from '@/app/actions'
import { redirect } from 'next/navigation'

export default async function EditarTramitePage({ searchParams }: { searchParams: { id: string } }) {
  const supabase = createClient()
  const id = searchParams.id

  if (!id) redirect('/tramites')

  const { data: tramite } = await supabase
    .from('tramites')
    .select('id, cliente_id, tipo_tramite, fecha_vencimiento, observaciones')
    .eq('id', id as string)
    .single()

  const { data: clientes } = await supabase
    .from('clientes')
    .select('id, razon_social')
    .order('razon_social')

  if (!tramite) redirect('/tramites')

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Editar Trámite</h1>
        <p className="text-slate-500 text-sm">Modificá los datos del trámite.</p>
      </div>
      <form action={updateTramite} className="bg-white p-8 rounded-2xl border shadow-sm space-y-5">
        <input type="hidden" name="id" value={tramite.id} />
        <div>
          <label className="block text-sm font-semibold mb-2 text-slate-700">Seleccionar Cliente</label>
          <select name="cliente_id" required defaultValue={tramite.cliente_id} className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-slate-50">
            {clientes?.map((c: any) => (
              <option key={c.id} value={c.id}>{c.razon_social}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2 text-slate-700">Tipo de Trámite</label>
          <input name="tipo_tramite" defaultValue={tramite.tipo_tramite} required className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2 text-slate-700">Vencimiento</label>
          <input name="fecha_vencimiento" type="date" defaultValue={tramite.fecha_vencimiento || ''} className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2 text-slate-700">Observaciones</label>
          <textarea name="observaciones" rows={3} defaultValue={tramite.observaciones || ''} className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50"></textarea>
        </div>
        <div className="pt-4 flex gap-3">
          <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition">
            Guardar Cambios
          </button>
          <a href="/tramites" className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold text-center hover:bg-slate-200 transition">
            Cancelar
          </a>
        </div>
      </form>
    </div>
  )
}
