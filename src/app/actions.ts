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
  const asignado_a = formData.get('asignado_a') as string || null

  const data = {
    cliente_id: formData.get('cliente_id') as string,
    tipo_tramite: formData.get('tipo_tramite') as string,
    estado: 'pendiente',
    fecha_vencimiento: formData.get('fecha_vencimiento') as string || null,
    observaciones: formData.get('observaciones') as string,
    creado_por: usuario,
    asignado_a,
  }

  const { data: nuevo, error } = await supabase.from('tramites').insert(data).select().single()
  if (error) throw new Error(error.message)

  const { data: cliente } = await supabase
    .from('clientes')
    .select('razon_social')
    .eq('id', data.cliente_id)
    .single()

  // Notificar al asignado si es distinto al creador
  if (asignado_a && asignado_a !== usuario) {
    await supabase.from('notificaciones').insert({
      para_usuario: asignado_a,
      mensaje: `${usuario} te asignó el trámite "${data.tipo_tramite}" de ${cliente?.razon_social || 'cliente'}`,
      tramite_id: nuevo?.id,
    })
  }

  await registrarAuditoria(supabase, {
    usuario,
    accion: 'CREACION',
    detalle: `Creó "${data.tipo_tramite}" para ${cliente?.razon_social || 'cliente desconocido'}${asignado_a ? ` — asignado a ${asignado_a}` : ''}`,
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
    .select('estado, tipo_tramite, cliente_id')
    .eq('id', id)
    .single()

  const { data: cliente } = await supabase
    .from('clientes')
    .select('razon_social')
    .eq('id', tramiteActual?.cliente_id)
    .single()

  const { error } = await supabase
    .from('tramites')
    .update({ estado: nuevoEstado })
    .eq('id', id)

  if (error) throw new Error(error.message)

  await registrarAuditoria(supabase, {
    usuario,
    accion: 'ESTADO',
    detalle: `Cambió estado de "${tramiteActual?.tipo_tramite}" (${cliente?.razon_social || 'cliente desconocido'}) de ${tramiteActual?.estado?.replace('_', ' ')} a ${nuevoEstado.replace('_', ' ')}`,
    tramite_id: id,
  })

  revalidatePath('/tramites')
  revalidatePath('/dashboard')
  revalidatePath('/historial')
}

export async function updateTramiteObservacion(id: string, nota: string) {
  const supabase = createClient()
  const usuario = await getNombreUsuario(supabase)

  const { data: tramiteData } = await supabase
    .from('tramites')
    .select('tipo_tramite, cliente_id')
    .eq('id', id)
    .single()

  const { data: clienteData } = await supabase
    .from('clientes')
    .select('razon_social')
    .eq('id', tramiteData?.cliente_id)
    .single()

  const { error } = await supabase
    .from('tramites')
    .update({ observaciones: nota })
    .eq('id', id)

  if (error) throw new Error(error.message)

  await registrarAuditoria(supabase, {
    usuario,
    accion: 'NOTA',
    detalle: `Editó nota de "${tramiteData?.tipo_tramite}" de ${clienteData?.razon_social || 'cliente desconocido'}`,
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

  const { data: clienteData } = await supabase
    .from('clientes')
    .select('razon_social')
    .eq('id', data.cliente_id)
    .single()

  const { error } = await supabase.from('tramites').update(data).eq('id', id)
  if (error) throw new Error(error.message)

  await registrarAuditoria(supabase, {
    usuario,
    accion: 'EDICION',
    detalle: `Editó "${data.tipo_tramite}" de ${clienteData?.razon_social || 'cliente desconocido'}`,
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
    .select('tipo_tramite, cliente_id')
    .eq('id', id)
    .single()

  const { data: cliente } = await supabase
    .from('clientes')
    .select('razon_social')
    .eq('id', tramite?.cliente_id)
    .single()

  const { error } = await supabase.from('tramites').delete().eq('id', id)
  if (error) throw new Error(error.message)

  await registrarAuditoria(supabase, {
    usuario,
    accion: 'ELIMINACION',
    detalle: `Eliminó "${tramite?.tipo_tramite}" de ${cliente?.razon_social || 'cliente desconocido'}`,
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

  const { data: tramiteData } = await supabase
    .from('tramites')
    .select('tipo_tramite, cliente_id')
    .eq('id', tramite_id)
    .single()

  const { data: clienteData } = await supabase
    .from('clientes')
    .select('razon_social')
    .eq('id', tramiteData?.cliente_id)
    .single()

  const { error } = await supabase.from('comentarios').insert({
    tramite_id,
    contenido,
    autor: usuario,
  })
  if (error) throw new Error(error.message)

  await registrarAuditoria(supabase, {
    usuario,
    accion: 'COMENTARIO',
    detalle: `Comentó en "${tramiteData?.tipo_tramite}" de ${clienteData?.razon_social || 'cliente desconocido'}`,
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
// Asignar trámite a un responsable
export async function asignarTramite(formData: FormData) {
  const supabase = createClient()
  const id = formData.get('id') as string
  const asignado_a = formData.get('asignado_a') as string
  const usuario = await getNombreUsuario(supabase)

  const { data: tramite } = await supabase
    .from('tramites')
    .select('tipo_tramite, cliente_id')
    .eq('id', id)
    .single()

  const { data: clienteData } = await supabase
    .from('clientes')
    .select('razon_social')
    .eq('id', tramite?.cliente_id)
    .single()

  const { error } = await supabase
    .from('tramites')
    .update({ asignado_a })
    .eq('id', id)

  if (error) throw new Error(error.message)

  await supabase.from('notificaciones').insert({
    para_usuario: asignado_a,
    mensaje: `${usuario} te asignó el trámite "${tramite?.tipo_tramite}" de ${clienteData?.razon_social || 'cliente'}`,
    tramite_id: id,
  })

  await registrarAuditoria(supabase, {
    usuario,
    accion: 'ASIGNACION',
    detalle: `Asignó "${tramite?.tipo_tramite}" (${clienteData?.razon_social}) a ${asignado_a}`,
    tramite_id: id,
  })

  revalidatePath('/tramites')
  revalidatePath('/historial')
}

// Marcar notificación como leída
export async function marcarNotificacionLeida(formData: FormData) {
  const supabase = createClient()
  const id = formData.get('id') as string
  await supabase.from('notificaciones').update({ leida: true }).eq('id', id)
  revalidatePath('/tramites')
  revalidatePath('/dashboard')
}
