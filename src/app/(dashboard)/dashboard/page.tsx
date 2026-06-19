import { createClient } from '@/lib/supabase'

export default async function Page() {
  const supabase = createClient()
  
  const { count: totalClientes } = await supabase.from('clientes').select('*', { count: 'exact', head: true })
  const { data: tramites } = await supabase.from('tramites').select('*')

  const pendientes = tramites?.filter(t => t.estado === 'pendiente').length || 0

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Panel General</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="text-gray-500 text-sm">Total Clientes</h3>
          <p className="text-4xl font-bold">{totalClientes || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="text-gray-500 text-sm">Trámites Pendientes</h3>
          <p className="text-4xl font-bold text-orange-500">{pendientes}</p>
        </div>
      </div>
    </div>
  )
}
