export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import TramitesTable from './TramitesTable'

export default async function TramitesPage() {
  const supabase = createClient()

  const { data: tramitesRaw } = await supabase
    .from('tramites')
    .select('*, clientes(razon_social)')
    .order('created_at', { ascending: false })

  const tramites = tramitesRaw || []

  return (
    <div className="space-y-6 px-4">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter italic">TRÁMITES</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1 italic border-l-2 border-blue-600 pl-2 leading-none">Estudio Contable</p>
        </div>
        <Link href="/tramites/nuevo" className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase shadow-xl hover:bg-blue-600 transition-all active:scale-95">
          + Nuevo Trámite
        </Link>
      </div>

      <TramitesTable tramites={tramites} />
    </div>
  )
}
