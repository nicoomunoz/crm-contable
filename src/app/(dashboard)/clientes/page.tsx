import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { UserPlus, Building2, Mail, Hash } from 'lucide-react'
import ClientesTable from './ClientesTable'

export default async function ClientesPage() {
  const supabase = createClient()
  const { data: clientes } = await supabase
    .from('clientes')
    .select('*')
    .order('razon_social')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-blue-600 mb-1">Estudio Grimalt</p>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Clientes</h1>
          <p className="text-slate-400 text-sm mt-0.5">{clientes?.length || 0} clientes registrados</p>
        </div>
        <Link
          href="/clientes/nuevo"
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-2xl text-xs font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20"
        >
          <UserPlus size={14} /> Nuevo Cliente
        </Link>
      </div>

      <ClientesTable clientes={clientes || []} />
    </div>
  )
}
