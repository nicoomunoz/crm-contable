import { createClient } from '@/lib/supabase'

export default async function ClientesPage() {
  const supabase = createClient()
  const { data: clientes } = await supabase.from('clientes').select('*').order('razon_social')

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          + Nuevo Cliente
        </button>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-4">Razón Social</th>
              <th className="px-6 py-4">CUIT</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {clientes?.map(cliente => (
              <tr key={cliente.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{cliente.razon_social}</td>
                <td className="px-6 py-4 text-gray-500">{cliente.cuit}</td>
                <td className="px-6 py-4 text-gray-500">{cliente.email}</td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 hover:underline">Ver ficha</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
