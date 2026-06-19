import { createClient } from '@/lib/supabase'

export default async function Page() {
  const supabase = createClient()
  
  // Traemos el conteo real de la base de datos
  const { count: totalClientes } = await supabase.from('clientes').select('*', { count: 'exact', head: true })
  const { data: tramites } = await supabase.from('tramites').select('*')

  const pendientes = tramites?.filter(t => t.estado === 'pendiente').length || 0
  const enProceso = tramites?.filter(t => t.estado === 'en_proceso').length || 0

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-extrabold text-slate-800">Panel General</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border shadow-sm border-slate-100">
          <p className="text-slate-500 font-medium text-sm">Total Clientes</p>
          <p className="text-4xl font-black text-blue-600 mt-2">{totalClientes || 0}</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border shadow-sm border-slate-100">
          <p className="text-slate-500 font-medium text-sm">Trámites Pendientes</p>
          <p className="text-4xl font-black text-orange-500 mt-2">{pendientes}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm border-slate-100">
          <p className="text-slate-500 font-medium text-sm">En Proceso</p>
          <p className="text-4xl font-black text-emerald-600 mt-2">{enProceso}</p>
        </div>
      </div>
    </div>
  )
}
