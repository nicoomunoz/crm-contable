import { createClient } from '@/lib/supabase'
import NuevoTramiteForm from './NuevoTramiteForm'

export default async function NuevoTramitePage() {
  const supabase = createClient()
  const [clientesRes, usuariosRes] = await Promise.all([
    supabase.from('clientes').select('id, razon_social').order('razon_social'),
    supabase.from('usuarios').select('nombre').order('nombre'),
  ])

  return (
    <NuevoTramiteForm
      clientes={clientesRes.data || []}
      usuarios={usuariosRes.data || []}
    />
  )
}
