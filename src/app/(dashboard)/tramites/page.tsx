import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { updateTramiteStatus } from '@/app/actions'
import { User, Clock, CheckCircle2, AlertCircle } from 'lucide-react'

export default async function TramitesPage() {
  const supabase = createClient()
  const { data: tramites } = await supabase
    .from('tramites')
    .select('*, clientes(razon_social)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Trámites</h1>
          <p className="text-slate-500">Gestión de flujo de trabajo del estudio.</p>
        </div>
        <Link href="/tramites/nuevo" className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-2 text-sm">
          + Iniciar Trámite
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl shadow-slate-100">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
              <th className="px-6 py-5">Cliente</th>
              <th className="px-6 py-5">Trámite</th>
              <th className="px-6 py-5">Responsable</th>
              <th className="px-6 py-5">Estado</th>
              <th className="px-6 py-5 text-center">Cambiar Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {tramites?.map((t: any) => (
              <tr key={t.id} className="hover:bg-slate-50/50 transition">
                <td className="px-6 py-5">
                  <p className="font-bold text-slate-800">{t.clientes?.razon_social}</p>
                </td>
                <td className="px-6 py-5">
                  <p className="text-slate-600 font-medium">{t.tipo_tramite}</p>
                  {t.fecha_vencimiento && <p className="text-[10px] text-red-500 font-bold uppercase mt-1">Vence: {new Date(t.fecha_vencimiento).toLocaleDateString()}</p>}
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 uppercase">
                      {t.creado_por?.charAt(0)}
                    </div>
                    <span className="text-sm text-slate-500">{t.creado_por?.split('@')[0]}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                    t.estado === 'pendiente' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                    t.estado === 'en_proceso' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                    t.estado === 'vencido' ? 'bg-red-50 text-red-600 border-red-100' :
                    'bg-green-50 text-green-600 border-green-100'
                  }`}>
                    {t.estado}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <form className="flex justify-center gap-1">
                    <button formAction={async () => { 'use server'; await updateTramiteStatus(t.id, 'en_proceso') }} title="En Proceso" className="p-1.5 hover:bg-blue-100 rounded-md text-blue-400 hover:text-blue-600 transition"><Clock size={16} /></button>
                    <button formAction={async () => { 'use server'; await updateTramiteStatus(t.id, 'finalizado') }} title="Finalizar" className="p-1.5 hover:bg-green-100 rounded-md text-green-400 hover:text-green-600 transition"><CheckCircle2 size={16} /></button>
                    <button formAction={async () => { 'use server'; await updateTramiteStatus(t.id, 'vencido') }} title="Vencido" className="p-1.5 hover:bg-red-100 rounded-md text-red-400 hover:text-red-600 transition"><AlertCircle size={16} /></button>
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
