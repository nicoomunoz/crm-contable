import { createClient } from '@/lib/supabase'
import Link from 'next/link'

export default async function TramitesPage() {
  const supabase = createClient()
  // Traemos los trámites y el nombre del cliente asociado
  const { data: tramites } = await supabase
    .from('tramites')
    .select('*, clientes(razon_social)')
    .order('fecha_vencimiento', { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestión de Trámites</h1>
        <Link href="/tramites/nuevo" className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold text-sm">
          + Iniciar Trámite
        </Link>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b text-slate-400 text-[10px] uppercase font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">Cliente</th>
              <th className="px-6 py-4">Trámite</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4">Vence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tramites?.map((t: any) => (
              <tr key={t.id} className="hover:bg-slate-50/50 transition">
                <td className="px-6 py-4 font-semibold text-slate-700">{t.clientes?.razon_social}</td>
                <td className="px-6 py-4 text-slate-600">{t.tipo_tramite}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    t.estado === 'pendiente' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {t.estado}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500 text-sm">
                  {t.fecha_vencimiento ? new Date(t.fecha_vencimiento).toLocaleDateString() : 'Sin fecha'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
