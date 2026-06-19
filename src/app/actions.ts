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
  
  const data = {
    razon_social: formData.get('razon_social') as string,
    cuit: formData.get('cuit') as string,
    email: formData.get('email') as string,
    telefono: formData.get('telefono') as string,
    direccion: formData.get('direccion') as string,
  }

  const { error } = await supabase.from('clientes').insert(data)

  if (error) throw new Error(error.message)
  
  revalidatePath('/clientes')
  redirect('/clientes')
}
