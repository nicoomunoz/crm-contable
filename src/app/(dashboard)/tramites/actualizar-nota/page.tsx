import { createClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { updateTramiteObservacion } from '@/app/actions'

export default async function EditarNotaPage({ searchParams }: { searchParams: { id: string } }) {
  const supabase = createClient()
  
  // 1. Buscamos el trámite actual para mostrar la nota vieja
  const { data: tramite } = await supabase
    .from('tramites')
    .select('*, clientes(razon_social)')
    .eq('id', searchParams.id)
    .single()

  // 2. Acción para guardar desde el formulario
  async function guardarCambio(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    const nota = formData.get('nota') as string
    await updateTramiteObservacion(id, nota)
    redirect('/tramites')
  }

  return (
    <div className="max-w-xl mx-auto py-10">
      <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-2xl">
        <div className="mb-6">
          <p className="text-blue-600 font-black text-[10px] uppercase tracking-widest mb-1">{tramite?.clientes?.razon_social}</p>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none italic">{tramite?.tipo_tramite}</h1>
          <p className="text-slate-400 text-sm mt-4 font-medium italic">Edita la observación o agrega una actualización:</p>
        </div>

        <form action={guardarCambio} className="space-y-6">
          <input type="hidden" name="id" value={searchParams.id} />
          
          <textarea 
            name="nota" 
            defaultValue={tramite?.observaciones || ""}
            rows={6}
            placeholder="Escribe aquí las novedades del trámite..."
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl p-5 text-slate-700 font-medium focus:border-blue-500 focus:bg-white outline-none transition-all resize-none shadow-inner"
            required
          />

          <div className="flex gap-3 pt-2">
            <button 
              type="submit"
              className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl active:scale-95"
            >
              Guardar Nota
            </button>
            <a 
              href="/tramites" 
              className="px-8 bg-slate-100 text-slate-400 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all text-center"
            >
              Cancelar
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
