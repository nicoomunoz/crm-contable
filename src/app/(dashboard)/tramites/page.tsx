import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { updateTramiteStatus } from '@/app/actions'

export default async function TramitesPage() {
  const supabase = createClient()
  const { data: tramites } = await supabase
    .from('tramites')
    .select('*, clientes(razon_social)')
    .order('fecha_vencimiento', { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-extrabold text-slate-800">Control de Trámites</h1>
        <Link href="/tramites/nuevo" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow-sm hover:bg-blue-700 transition">
          + Iniciar Trámite
        </Link>
      </div>

      <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase border-b">
            <tr>
              <th className="px-6 py-4">Cliente</th>
              <th className="px-6 py-4">Trámite</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4">Acción Rápida</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tramites?.map((t: any) => (
              <tr key={t.id} className="hover:bg-slate-50 transition text-sm">
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-700">{t.clientes?.razon_social}</p>
                </td>
                <td className="px-6 py-4 text-slate-600">{t.tipo_tramite}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    t.estado === 'pendiente' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                    t.estado === 'en_proceso' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                    'bg-green-50 text-green-600 border-green-100'
                  }`}>
                    {t.estado.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <form className="flex gap-2">
                    {t.estado === 'pendiente' && (
                      <button formAction={async () => { 'use server'; await updateTramiteStatus(t.id, 'en_proceso') }}
                        className="text-[10px] bg-slate-900 text-white px-2 py-1 rounded hover:bg-blue-600 transition uppercase font-bold">
                        Empezar
                      </button>
                    )}
                    {t.estado === 'en_proceso' && (
                      <button formAction={async () => { 'use server'; await updateTramiteStatus(t.id, 'finalizado') }}
                        className="text-[10px] bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition uppercase font-bold">
                        Terminar
                      </button>
                    )}
                    {t.estado === 'finalizado' && <span className="text-slate-300 text-xs">Sin acciones</span>}
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
