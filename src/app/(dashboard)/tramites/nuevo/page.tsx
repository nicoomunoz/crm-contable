import { createClient } from '@/lib/supabase'
import { createTramite } from '@/app/actions'

export default async function NuevoTramitePage() {
  const supabase = createClient()

  const [clientesRes, usuariosRes] = await Promise.all([
    supabase.from('clientes').select('id, razon_social').order('razon_social'),
    supabase.from('usuarios').select('nombre').order('nombre'),
  ])

  const clientes = clientesRes.data || []
  const usuarios = usuariosRes.data || []

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-blue-600 mb-1">Estudio Grimalt</p>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Nuevo Trámite</h1>
        <p className="text-slate-500 text-sm mt-0.5">Asigná un trámite o vencimiento a un cliente.</p>
      </div>

      <form action={createTramite} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-5">

        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Cliente</label>
          <select name="cliente_id" required className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-slate-50 text-sm font-semibold text-slate-700">
            <option value="">— Elegí un cliente —</option>
            {clientes.map(c => (
              <option key={c.id} value={c.id}>{c.razon_social}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Tipo de Trámite</label>
          <input
            name="tipo_tramite"
            placeholder="Ej: Liquidación IVA, Certificación, Alta AFIP"
            required
            className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 text-sm font-semibold text-slate-700"
          />
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Asignar a</label>
          <select name="asignado_a" className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-slate-50 text-sm font-semibold text-slate-700">
            <option value="">Sin asignar</option>
            {usuarios.map((u: any) => (
              <option key={u.nombre} value={u.nombre}>{u.nombre}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Vencimiento</label>
            <input
              name="fecha_vencimiento"
              type="date"
              className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 text-sm"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Estado inicial</label>
            <select name="estado" disabled className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-100 text-sm text-slate-400 font-semibold">
              <option value="pendiente">Pendiente (por defecto)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Observaciones</label>
          <textarea
            name="observaciones"
            rows={3}
            className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 text-sm text-slate-700"
            placeholder="Detalles adicionales..."
          />
        </div>

        <div className="pt-2 flex gap-3">
          <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition">
            Crear Trámite
          </button>
          <a href="/tramites" className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-black text-xs uppercase tracking-widest text-center hover:bg-slate-200 transition">
            Cancelar
          </a>
        </div>
      </form>
    </div>
  )
}
