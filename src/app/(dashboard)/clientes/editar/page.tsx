import { createClient } from '@/lib/supabase'
import { updateCliente } from '@/app/actions'
import { redirect } from 'next/navigation'

export default async function EditarClientePage({ searchParams }: { searchParams: { id: string } }) {
  const supabase = createClient()
  const id = searchParams.id
  if (!id) redirect('/clientes')

  const { data: cliente } = await supabase
    .from('clientes')
    .select('*')
    .eq('id', id)
    .single()

  if (!cliente) redirect('/clientes')

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-blue-600 mb-1">Estudio Grimalt</p>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Editar Cliente</h1>
        <p className="text-slate-400 text-sm mt-0.5">{cliente.razon_social}</p>
      </div>

      <div className="bg-white border border-slate-100 rounded-[1.5rem] shadow-sm p-8 space-y-5">
        <form action={updateCliente} className="space-y-5">
          <input type="hidden" name="id" value={cliente.id} />

          {[
            { name: 'razon_social', label: 'Razón Social', value: cliente.razon_social, type: 'text' },
            { name: 'cuit', label: 'CUIT', value: cliente.cuit, type: 'text' },
            { name: 'email', label: 'Email', value: cliente.email, type: 'email' },
            { name: 'telefono', label: 'Teléfono', value: cliente.telefono, type: 'text' },
            { name: 'direccion', label: 'Dirección', value: cliente.direccion, type: 'text' },
          ].map(f => (
            <div key={f.name} className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{f.label}</label>
              <input
                name={f.name}
                type={f.type}
                defaultValue={f.value || ''}
                className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-slate-50"
              />
            </div>
          ))}

          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition">
              Guardar Cambios
            </button>
            <a href="/clientes" className="flex-1 text-center bg-slate-100 text-slate-500 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition">
              Cancelar
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
