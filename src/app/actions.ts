'use server'
import { createClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) redirect('/login?error=true')
  redirect('/dashboard')
}

export async function createCliente(formData: FormData) {
  const supabase = createClient()
  // Obtenemos el usuario actual para la trazabilidad
  const { data: { user } } = await supabase.auth.getUser()
  
  const data = {
    razon_social: formData.get('razon_social') as string,
    cuit: formData.get('cuit') as string,
    email: formData.get('email') as string,
    telefono: formData.get('telefono') as string,
  }

  const { error } = await supabase.from('clientes').insert(data)
  if (error) throw new Error(error.message)
  revalidatePath('/clientes')
  redirect('/clientes')
}

export async function createTramite(formData: FormData) {
  const supabase = createClient()
  
  const data = {
    cliente_id: formData.get('cliente_id') as string,
    tipo_tramite: formData.get('tipo_tramite') as string,
    estado: 'pendiente',
    fecha_vencimiento: formData.get('fecha_vencimiento') as string || null,
    observaciones: formData.get('observaciones') as string,
  }

  const { error } = await supabase.from('tramites').insert(data)
  if (error) throw new Error(error.message)
  
  revalidatePath('/tramites')
  redirect('/tramites')
}

// NUEVA FUNCIÓN: ACTUALIZAR ESTADO DEL TRÁMITE
export async function updateTramiteStatus(id: string, nuevoEstado: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('tramites')
    .update({ estado: nuevoEstado })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/tramites')
  revalidatePath('/dashboard')
}

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
