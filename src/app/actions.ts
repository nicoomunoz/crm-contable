'use server'
import { createClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// AUTH
export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) redirect('/login?error=true')
  redirect('/dashboard')
}

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

// CLIENTES
export async function createCliente(formData: FormData) {
  const supabase = createClient()
  const data = {
    razon_social: formData.get('razon_social') as string,
    cuit: formData.get('cuit') as string,
    email: formData.get('email') as string,
    telefono: formData.get('telefono') as string
  }
  await supabase.from('clientes').insert(data)
  revalidatePath('/clientes')
  redirect('/clientes')
}

// TRÁMITES
export async function createTramite(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const nombre = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Admin'
  const data = {
    cliente_id: formData.get('cliente_id') as string,
    tipo_tramite: formData.get('tipo_tramite') as string,
    estado: 'pendiente',
    fecha_vencimiento: formData.get('fecha_vencimiento') as string || null,
    observaciones: formData.get('observaciones') as string,
    creado_por: nombre
  }
  await supabase.from('tramites').insert(data)
  revalidatePath('/tramites')
  redirect('/tramites')
}

export async function updateTramiteStatus(formData: FormData) {
  const supabase = createClient()
  const id = formData.get('id') as string
  const nuevoEstado = formData.get('nuevoEstado') as string
  await supabase.from('tramites').update({ estado: nuevoEstado }).eq('id', id)
  revalidatePath('/tramites')
  revalidatePath('/dashboard')
}

export async function deleteTramite(formData: FormData) {
  const supabase = createClient()
  const id = formData.get('id') as string
  await supabase.from('tramites').delete().eq('id', id)
  revalidatePath('/tramites')
  revalidatePath('/dashboard')
}

export async function updateTramiteObservacion(id: string, nota: string) {
  const supabase = createClient()
  await supabase.from('tramites').update({ observaciones: nota }).eq('id', id)
  revalidatePath('/tramites')
}
