export const dynamic = 'force-dynamic'

import React from 'react'
import { createClient } from '@/lib/supabase'
import { updateTramite } from '@/app/actions'
import { redirect } from 'next/navigation'

export default async function EditarTramitePage({ searchParams }: { searchParams: { id: string } }) {
  const supabase = createClient()
  const id = searchParams.id

  if (!id) redirect('/tramites')

  const { data: tramite } = await supabase
    .from('tramites')
    .select('*, clientes(razon_social)')
    .eq('id', id)
    .single()

  if (!tramite) redirect('/tramites')

  const { data: clientes } = await supabase
    .from('clientes')
    .select('id, razon_social')
    .order('razon_social')

  return (
    // ... el JSX
  )
}
