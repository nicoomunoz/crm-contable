'use server'

import { createClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const supabase = createClient()
    
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      console.error('Login error:', error)
      redirect('/login?error=true')
    }
    redirect('/dashboard')
  } catch (error) {
    console.error('Login exception:', error)
    throw error
  }
}

export async function createCliente(formData: FormData) {
  try {
    const supabase = createClient()
    const data = {
      razon_social: formData.get('razon_social') as string,
      cuit: formData.get('cuit') as string,
      email: formData.get('email') as string,
      telefono: formData.get('telefono') as string
    }
    
    const { error } = await supabase.from('clientes').insert(data)
    if (error) throw new Error(`Insert error: ${error.message}`)
    
    revalidatePath('/clientes')
    redirect('/clientes')
  } catch (error) {
    console.error('createCliente error:', error)
    throw error
  }
}

export async function createTramite(formData: FormData) {
  try {
    const supabase = createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError) throw new Error(`Auth error: ${userError.message}`)
    
    const data = {
      cliente_id: formData.get('cliente_id') as string,
      tipo_tramite: formData.get('tipo_tramite') as string,
      estado: 'pendiente',
      fecha_vencimiento: formData.get('fecha_vencimiento') as string || null,
      observaciones: formData.get('observaciones') as string,
      creado_por: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Administrador'
    }
    
    const { error } = await supabase.from('tramites').insert(data)
    if (error) throw new Error(`Insert error: ${error.message}`)
    
    revalidatePath('/tramites')
    redirect('/tramites')
  } catch (error) {
    console.error('createTramite error:', error)
    throw error
  }
}

export async function updateTramiteStatus(formData: FormData) {
  try {
    const supabase = createClient()
    const id = formData.get('id') as string
    const nuevoEstado = formData.get('nuevoEstado') as string
    
    if (!id || !nuevoEstado) {
      throw new Error('ID o estado faltante')
    }
    
    const { error } = await supabase
      .from('tramites')
      .update({ estado: nuevoEstado })
      .eq('id', id)
    
    if (error) throw new Error(`Update error: ${error.message}`)
    
    revalidatePath('/tramites')
    revalidatePath('/dashboard')
  } catch (error) {
    console.error('updateTramiteStatus error:', error)
    throw error
  }
}

export async function deleteTramite(formData: FormData) {
  try {
    const supabase = createClient()
    const id = formData.get('id') as string
    
    if (!id) {
      throw new Error('ID faltante')
    }
    
    const { error } = await supabase
      .from('tramites')
      .delete()
      .eq('id', id)
    
    if (error) throw new Error(`Delete error: ${error.message}`)
    
    revalidatePath('/tramites')
    revalidatePath('/dashboard')
  } catch (error) {
    console.error('deleteTramite error:', error)
    throw error
  }
}

export async function updateTramite(formData: FormData) {
  try {
    const supabase = createClient()
    const id = formData.get('id') as string
    const data = {
      cliente_id: formData.get('cliente_id') as string,
      tipo_tramite: formData.get('tipo_tramite') as string,
      fecha_vencimiento: formData.get('fecha_vencimiento') as string || null,
      observaciones: formData.get('observaciones') as string
    }
    
    const { error } = await supabase
      .from('tramites')
      .update(data)
      .eq('id', id)
    
    if (error) throw new Error(`Update error: ${error.message}`)
    
    revalidatePath('/tramites')
    redirect('/tramites')
  } catch (error) {
    console.error('updateTramite error:', error)
    throw error
  }
}

export async function updateTramiteObservacion(id: string, nota: string) {
  try {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('tramites')
      .update({ observaciones: nota })
      .eq('id', id)
    
    if (error) throw new Error(`Update error: ${error.message}`)
    
    revalidatePath('/tramites')
  } catch (error) {
    console.error('updateTramiteObservacion error:', error)
    throw error
  }
}

export async function signOut() {
  try {
    const supabase = createClient()
    await supabase.auth.signOut()
    redirect('/login')
  } catch (error) {
    console.error('signOut error:', error)
    throw error
  }
}
