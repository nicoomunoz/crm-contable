'use server'
import { createClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

/**
 * --- SISTEMA DE AUTENTICACIÓN ---
 */

// Iniciar Sesión
export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = createClient()
  
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  
  if (error) redirect('/login?error=true')
  
  redirect('/dashboard')
}

// Cerrar Sesión
export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect('/login')
}


/**
 * --- GESTIÓN DE CLIENTES ---
 */

// Crear Cliente
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


/**
 * --- GESTIÓN DE TRÁMITES ---
 */

// Crear Trámite (Con trazabilidad de nombre de usuario)
export async function createTramite(formData: FormData) {
  const supabase = createClient()
  
  // Obtener al usuario logueado para registrar quién crea el trámite
  const { data: { user } } = await supabase.auth.getUser()
  const nombreResponsable = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Administrador'
  
  const data = {
    cliente_id: formData.get('cliente_id') as string,
    tipo_tramite: formData.get('tipo_tramite') as string,
    estado: 'pendiente',
    fecha_vencimiento: formData.get('fecha_vencimiento') as string || null,
    observaciones: formData.get('observaciones') as string,
    creado_por: nombreResponsable
  }

  const { error } = await supabase.from('tramites').insert(data)
  
  if (error) throw new Error(error.message)
  
  revalidatePath('/tramites')
  revalidatePath('/dashboard')
  redirect('/tramites')
}

// Actualizar Estado (Usado en los botones de la tabla)
export async function updateTramiteStatus(formData: FormData) {
  const supabase = createClient()
  const id = formData.get('id') as string
  const nuevoEstado = formData.get('nuevoEstado') as string

  const { error } = await supabase
    .from('tramites')
    .update({ estado: nuevoEstado })
    .eq('id', id)

  if (error) throw new Error(error.message)
  
  revalidatePath('/tramites')
  revalidatePath('/dashboard')
}

// Actualizar Observación / Nota (Usado en la pantalla de la nubecita)
export async function updateTramiteObservacion(id: string, nota: string) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('tramites')
    .update({ observaciones: nota })
    .eq('id', id)

  if (error) throw new Error(error.message)
  
  revalidatePath('/tramites')
}

// Editar Trámite Completo (Formulario de edición)
export async function updateTramite(formData: FormData) {
  const supabase = createClient()
  const id = formData.get('id') as string
  
  const data = {
    cliente_id: formData.get('cliente_id') as string,
    tipo_tramite: formData.get('tipo_tramite') as string,
    fecha_vencimiento: formData.get('fecha_vencimiento') as string || null,
    observaciones: formData.get('observaciones') as string,
  }

  const { error } = await supabase.from('tramites').update(data).eq('id', id)
  
  if (error) throw new Error(error.message)
  
  revalidatePath('/tramites')
  revalidatePath('/dashboard')
  redirect('/tramites')
}

// Borrar Trámite
export async function deleteTramite(formData: FormData) {
  const supabase = createClient()
  const id = formData.get('id') as string

  const { error } = await supabase
    .from('tramites')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
  
  revalidatePath('/tramites')
  revalidatePath('/dashboard')
}
export async function createComentario(formData: FormData) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  const autor = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Anónimo'
  
  const data = {
    tramite_id: formData.get('tramite_id') as string,
    contenido: formData.get('contenido') as string,
    autor,
  }

  const { error } = await supabase.from('comentarios').insert(data)
  if (error) throw new Error(error.message)
  
  revalidatePath('/tramites')
}
// ACTUALIZAR CONTRASEÑA CON REQUISITOS DE COMPLEJIDAD
export async function updatePassword(formData: FormData) {
  const supabase = createClient()
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  // Requisitos: Mínimo 8 caracteres, al menos una letra, un número y un símbolo
  const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&._\-\/])[A-Za-z\d@$!%*?&._\-\/]{8,}$/

  if (password !== confirmPassword) {
    redirect('/perfil?error=Las contraseñas no coinciden')
  }

  if (!regex.test(password)) {
    redirect('/perfil?error=La clave debe tener al menos 8 caracteres, una letra, un número y un símbolo')
  }

  const { error } = await supabase.auth.updateUser({
    password: password
  })

  if (error) {
    redirect(`/perfil?error=${error.message}`)
  }

  redirect('/perfil?success=true')
}

