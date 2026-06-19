import { createClient } from '@/lib/supabase'
import { createTramite } from '@/app/actions'

export default async function NuevoTramitePage() {
  const supabase = createClient()
  // Traemos los clientes para el selector
  const { data: clientes } = await supabase.from('clientes').select('id, razon_social').order('razon_social')

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Iniciar Nuevo Trámite</h1>
        <p className="text-slate-500 text-sm">Asigna un trámite o vencimiento a un cliente.</p>
      </div>

      <form action={createTramite} className="bg-white p-8 rounded-2xl border shadow-sm space-y-5">
        <div>
          <label className="block text-sm font-semibold mb-2 text-slate-700">Seleccionar Cliente</label>
          <select name="cliente_id" required className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-slate-50">
            <option value="">-- Elige un cliente --</option>
            {clientes?.map(c => (
              <option key={c.id} value={c.id}>{c.razon_social}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-slate-700">Tipo de Trámite</label>
          <input name="tipo_tramite" placeholder="Ej: Liquidación IVA, Certificación, Alta AFIP" required className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">Vencimiento</label>
            <input name="fecha_vencimiento" type="date" className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">Estado Inicial</label>
            <select name="estado" className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-100 italic" disabled>
              <option value="pendiente">Pendiente (Por defecto)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-slate-700">Observaciones</label>
          <textarea name="observaciones" rows={3} className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50" placeholder="Detalles adicionales..."></textarea>
        </div>

        <div className="pt-4 flex gap-3">
          <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition">
            Crear Trámite
          </button>
          <a href="/tramites" className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold text-center hover:bg-slate-200 transition">
            Cancelar
          </a>
        </div>
      </form>
    </div>
  )
}
