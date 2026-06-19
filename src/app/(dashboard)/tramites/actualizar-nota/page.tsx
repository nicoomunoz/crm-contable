import { redirect } from 'next/navigation'
import { updateTramiteObservacion } from '@/app/actions'

export default async function Page({ searchParams }: { searchParams: { id: string, nota: string } }) {
  if (searchParams.id) {
    await updateTramiteObservacion(searchParams.id, searchParams.nota)
  }
  redirect('/tramites')
}
