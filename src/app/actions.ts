'use server'
import { createClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// --- HELPERS ---

async function getNombreUsuario(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser()
  return user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Administrador'
}

async function registrarAuditoria(supabase: any, {
  usuario, accion, detalle, tramite_id
}: { usuario: string, accion: string, detalle: string, tramite_id?: string }) {
  await supabase.from('auditoria').insert({
    usuario,
    accion,
    detalle,
    tramite_id: tramite_id || null,
  })
}

/**
 * --- AUTENTICACIÓN ---
 */
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

/**
 * --- CLIENTES ---
 */
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

export async function updateCliente(formData: FormData) {
  const supabase = createClient()
  const id = formData.get('id') as string
  const data = {
    razon_social: formData.get('razon_social') as string,
    cuit: formData.get('cuit') as string,
    email: formData.get('email') as string,
    telefono: formData.get('telefono') as string,
    direccion: formData.get('direccion') as string,
  }
  const { error } = await supabase.from('clientes').update(data).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/clientes')
  redirect('/clientes')
}

export async function deleteCliente(formData: FormData) {
  const supabase = createClient()
  const id = formData.get('id') as string
  const { error } = await supabase.from('clientes').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/clientes')
  redirect('/clientes')
}

/**
 * --- TRÁMITES ---
 */
export async function createTramite(formData: FormData) {
  const supabase = createClient()
  const usuario = await getNombreUsuario(supabase)

  const data = {
    cliente_id: formData.get('cliente_id') as string,
    tipo_tramite: formData.get('tipo_tramite') as string,
    estado: 'pendiente',
    fecha_vencimiento: formData.get('fecha_vencimiento') as string || null,
    observaciones: formData.get('observaciones') as string,
    creado_por: usuario,
  }

  const { data: nuevo, error } = await supabase.from('tramites').insert(data).select().single()
  if (error) throw new Error(error.message)

  await registrarAuditoria(supabase, {
    usuario,
    accion: 'CREACION',
    detalle: `Creó el trámite "${data.tipo_tramite}"`,
    tramite_id: nuevo?.id,
  })

  revalidatePath('/tramites')
  revalidatePath('/dashboard')
  revalidatePath('/historial')
  redirect('/tramites')
}

export async function updateTramiteStatus(formData: FormData) {
  const supabase = createClient()
  const id = formData.get('id') as string
  const nuevoEstado = formData.get('nuevoEstado') as string
  const usuario = await getNombreUsuario(supabase)

  const { data: tramiteActual } = await supabase
    .from('tramites')
    .select('estado, tipo_tramite')
    .eq('id', id)
    .single()

  const { error } = await supabase
    .from('tramites')
    .update({ estado: nuevoEstado })
    .eq('id', id)

  if (error) throw new Error(error.message)

  await registrarAuditoria(supabase, {
    usuario,
    accion: 'ESTADO',
    detalle: `Cambió "${tramiteActual?.tipo_tramite}" de ${tramiteActual?.estado?.replace('_', ' ')} a ${nuevoEstado.replace('_', ' ')}`,
    tramite_id: id,
  })

  revalidatePath('/tramites')
  revalidatePath('/dashboard')
  revalidatePath('/historial')
}

export async function updateTramiteObservacion(id: string, nota: string) {
  const supabase = createClient()
  const usuario = await getNombreUsuario(supabase)

  const { error } = await supabase
    .from('tramites')
    .update({ observaciones: nota })
    .eq('id', id)

  if (error) throw new Error(error.message)

  await registrarAuditoria(supabase, {
    usuario,
    accion: 'NOTA',
    detalle: `Editó la observación del trámite`,
    tramite_id: id,
  })

  revalidatePath('/tramites')
  revalidatePath('/historial')
}

export async function updateTramite(formData: FormData) {
  const supabase = createClient()
  const id = formData.get('id') as string
  const usuario = await getNombreUsuario(supabase)

  const data = {
    cliente_id: formData.get('cliente_id') as string,
    tipo_tramite: formData.get('tipo_tramite') as string,
    fecha_vencimiento: formData.get('fecha_vencimiento') as string || null,
    observaciones: formData.get('observaciones') as string,
  }

  const { error } = await supabase.from('tramites').update(data).eq('id', id)
  if (error) throw new Error(error.message)

  await registrarAuditoria(supabase, {
    usuario,
    accion: 'EDICION',
    detalle: `Editó el trámite "${data.tipo_tramite}"`,
    tramite_id: id,
  })

  revalidatePath('/tramites')
  revalidatePath('/dashboard')
  revalidatePath('/historial')
  redirect('/tramites')
}

export async function deleteTramite(formData: FormData) {
  const supabase = createClient()
  const id = formData.get('id') as string
  const usuario = await getNombreUsuario(supabase)

  const { data: tramite } = await supabase
    .from('tramites')
    .select('tipo_tramite')
    .eq('id', id)
    .single()

  const { error } = await supabase.from('tramites').delete().eq('id', id)
  if (error) throw new Error(error.message)

  await registrarAuditoria(supabase, {
    usuario,
    accion: 'ELIMINACION',
    detalle: `Eliminó el trámite "${tramite?.tipo_tramite}"`,
  })

  revalidatePath('/tramites')
  revalidatePath('/dashboard')
  revalidatePath('/historial')
}

export async function createComentario(formData: FormData) {
  const supabase = createClient()
  const usuario = await getNombreUsuario(supabase)
  const tramite_id = formData.get('tramite_id') as string
  const contenido = formData.get('contenido') as string

  const { error } = await supabase.from('comentarios').insert({
    tramite_id,
    contenido,
    autor: usuario,
  })
  if (error) throw new Error(error.message)

  await registrarAuditoria(supabase, {
    usuario,
    accion: 'COMENTARIO',
    detalle: `Agregó un comentario al trámite`,
    tramite_id,
  })

  revalidatePath('/tramites')
  revalidatePath('/historial')
}

export async function updatePassword(formData: FormData) {
  const supabase = createClient()
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&._\-\/])[A-Za-z\d@$!%*?&._\-\/]{8,}$/

  if (password !== confirmPassword) {
    redirect('/perfil?error=Las contraseñas no coinciden')
  }

  if (!regex.test(password)) {
    redirect('/perfil?error=La clave debe tener al menos 8 caracteres, una letra, un número y un símbolo')
  }

  const { error } = await supabase.auth.updateUser({ password })
  if (error) redirect(`/perfil?error=${error.message}`)
  redirect('/perfil?success=true')
}
