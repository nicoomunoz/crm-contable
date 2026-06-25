import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { Clock, Users, CheckCircle2, ArrowRight, FileText, UserPlus, AlertTriangle, TrendingUp } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const nombreUsuario = user?.user_metadata?.full_name?.split(' ')[0] || 'Usuario'

  const [clientesRes, tramitesRes, notifRes] = await Promise.all([
    supabase.from('clientes').select('id', { count: 'exact' }),
    supabase.from('tramites').select('id, tipo_tramite, estado, fecha_vencimiento, creado_por, cliente_id, clientes(razon_social)'),
    supabase.from('notificaciones').select('id, mensaje, created_at').eq('para_usuario', nombreUsuario).eq('leida', false).order('created_at', { ascending: false })
  ])

  const notificacionesNoLeidas = notifRes.data || []
  const totalClientes = clientesRes.count || 0
  const tramites = tramitesRes.data || []

  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)

  function diasRestantes(fecha: string) {
    return Math.ceil((new Date(fecha).getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
  }

  const pendientes = tramites.filter(t => t.estado === 'pendiente').length
  const enProceso = tramites.filter(t => t.estado === 'en_proceso').length
  const finalizados = tramites.filter(t => t.estado === 'finalizado').length
  const total = tramites.length
  const porcentajeCompletado = total > 0 ? Math.round((finalizados / total) * 100) : 0

  const vencidos = tramites.filter(t => {
    if (!t.fecha_vencimiento || t.estado === 'finalizado') return false
    return diasRestantes(t.fecha_vencimiento) < 0
  })

  const urgentes = tramites.filter(t => {
    if (!t.fecha_vencimiento || t.estado === 'finalizado') return false
    const dias = diasRestantes(t.fecha_vencimiento)
    return dias >= 0 && dias <= 3
  })

  const proximos = tramites.filter(t => {
    if (!t.fecha_vencimiento || t.estado === 'finalizado') return false
    const dias = diasRestantes(t.fecha_vencimiento)
    return dias > 3 && dias <= 7
  })

  const porResponsable: Record<string, { pendiente: number, en_proceso: number, finalizado: number }> = {}
  tramites.forEach(t => {
    const r = t.creado_por || 'Sin asignar'
    if (!porResponsable[r]) porResponsable[r] = { pendiente: 0, en_proceso: 0, finalizado: 0 }
    if (t.estado === 'pendiente') porResponsable[r].pendiente++
    else if (t.estado === 'en_proceso') porResponsable[r].en_proceso++
    else if (t.estado === 'finalizado') porResponsable[r].finalizado++
  })

  const todosVencimientos = [...vencidos, ...urgentes, ...proximos]
    .sort((a, b) => new Date(a.fecha_vencimiento).getTime() - new Date(b.fecha_vencimiento).getTime())

  return (
    <div className="space-y-5">

      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-600 mb-0.5">Estudio Grimalt</p>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Hola, {nombreUsuario}</h1>
          <p className="text-slate-500 text-xs md:text-sm mt-0.5 font-medium capitalize">
            {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div className="hidden md:flex gap-2">
          <Link href="/clientes/nuevo" className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition">
            <UserPlus size={13} /> Nuevo Cliente
          </Link>
          <Link href="/tramites/nuevo" className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition shadow-md">
            <FileText size={13} /> Nuevo Trámite
          </Link>
        </div>
      </div>

      {/* Banner notificaciones */}
      {notificacionesNoLeidas.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-start gap-3">
          <div className="w-7 h-7 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-black">{notificacionesNoLeidas.length}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-blue-800">
              Tenés {notificacionesNoLeidas.length} notificación{notificacionesNoLeidas.length > 1 ? 'es' : ''} nueva{notificacionesNoLeidas.length > 1 ? 's' : ''}
            </p>
            <p className="text-xs text-blue-600 mt-0.5 truncate">{notificacionesNoLeidas[0].mensaje}</p>
          </div>
        </div>
      )}

      {/* MÉTRICAS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Link href="/clientes" className="bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition group">
          <div className="flex items-center justify-between mb-2">
            <Users size={15} className="text-blue-500" />
            <ArrowRight size={12} className="text-slate-300 group-hover:text-blue-400 transition" />
          </div>
          <p className="text-2xl font-black text-slate-900">{totalClientes}</p>
          <p className="text-xs font-bold text-slate-500 mt-0.5">Clientes</p>
        </Link>

        <Link href="/tramites" className="bg-white border border-slate-200 rounded-xl p-4 hover:border-orange-300 hover:shadow-md transition group">
          <div className="flex items-center justify-between mb-2">
            <Clock size={15} className="text-orange-500" />
            <ArrowRight size={12} className="text-slate-300 group-hover:text-orange-400 transition" />
          </div>
          <p className="text-2xl font-black text-orange-500">{pendientes}</p>
          <p className="text-xs font-bold text-slate-500 mt-0.5">Pendientes</p>
        </Link>

        <Link href="/tramites" className="bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition group">
          <div className="flex items-center justify-between mb-2">
            <ArrowRight size={15} className="text-blue-500" />
            <ArrowRight size={12} className="text-slate-300 group-hover:text-blue-400 transition" />
          </div>
          <p className="text-2xl font-black text-blue-500">{enProceso}</p>
          <p className="text-xs font-bold text-slate-500 mt-0.5">En proceso</p>
        </Link>

        <Link href="/tramites" className="bg-white border border-slate-200 rounded-xl p-4 hover:border-emerald-300 hover:shadow-md transition group">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle2 size={15} className="text-emerald-500" />
            <ArrowRight size={12} className="text-slate-300 group-hover:text-emerald-400 transition" />
          </div>
          <p className="text-2xl font-black text-emerald-600">{finalizados}</p>
          <p className="text-xs font-bold text-slate-500 mt-0.5">Finalizados</p>
        </Link>

        <div className="col-span-2 md:col-span-1 bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp size={15} className="text-slate-500" />
            <span className="text-[10px] font-black text-slate-400">{porcentajeCompletado}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
            <div className="bg-emerald-500 h-2 rounded-full transition-all" style={{ width: `${porcentajeCompletado}%` }} />
          </div>
          <p className="text-xs font-bold text-slate-500">Completado</p>
        </div>
      </div>

      {/* CUERPO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* VENCIMIENTOS */}
        <div className="md:col-span-2 space-y-4">
          {vencidos.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-red-200 bg-red-100">
                <AlertTriangle size={13} className="text-red-600" />
                <p className="text-xs font-black text-red-700 uppercase tracking-wider">{vencidos.length} Vencido{vencidos.length > 1 ? 's' : ''} — Atención inmediata</p>
              </div>
              <div className="divide-y divide-red-100">
                {vencidos.map(t => <FilaVencimiento key={t.id} t={t} tipo="vencido" />)}
              </div>
            </div>
          )}

          {urgentes.length > 0 && (
            <div className="bg-white border border-orange-200 rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-orange-100 bg-orange-50">
                <Clock size={13} className="text-orange-600" />
                <p className="text-xs font-black text-orange-700 uppercase tracking-wider">{urgentes.length} Urgente{urgentes.length > 1 ? 's' : ''} — Vencen en 1-3 días</p>
              </div>
              <div className="divide-y divide-slate-50">
                {urgentes.sort((a, b) => diasRestantes(a.fecha_vencimiento) - diasRestantes(b.fecha_vencimiento)).map(t => (
                  <FilaVencimiento key={t.id} t={t} tipo="urgente" diasRestantes={diasRestantes(t.fecha_vencimiento)} />
                ))}
              </div>
            </div>
          )}

          {proximos.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100">
                <FileText size={13} className="text-slate-400" />
                <p className="text-xs font-black text-slate-500 uppercase tracking-wider">Próximos 7 días</p>
              </div>
              <div className="divide-y divide-slate-50">
                {proximos.map(t => <FilaVencimiento key={t.id} t={t} tipo="proximo" diasRestantes={diasRestantes(t.fecha_vencimiento)} />)}
              </div>
            </div>
          )}

          {todosVencimientos.length === 0 && (
            <div className="bg-white border border-slate-200 rounded-xl py-10 text-center">
              <CheckCircle2 size={24} className="text-emerald-400 mx-auto mb-2" />
              <p className="text-slate-500 text-sm font-bold">Sin vencimientos próximos</p>
              <p className="text-slate-400 text-xs mt-0.5">Todo al día</p>
            </div>
          )}
        </div>

        {/* COLUMNA DERECHA */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-xs font-black text-slate-600 uppercase tracking-wider">Accesos rápidos</p>
            </div>
            <div className="divide-y divide-slate-50">
              {[
                { href: '/tramites/nuevo', label: 'Nuevo Trámite', icon: <FileText size={13} />, color: 'text-blue-600' },
                { href: '/clientes/nuevo', label: 'Nuevo Cliente', icon: <UserPlus size={13} />, color: 'text-slate-600' },
                { href: '/tramites', label: 'Ver Pendientes', icon: <Clock size={13} />, color: 'text-orange-500' },
                { href: '/clientes', label: 'Ver Clientes', icon: <Users size={13} />, color: 'text-emerald-600' },
                { href: '/historial', label: 'Ver Historial', icon: <ArrowRight size={13} />, color: 'text-purple-600' },
              ].map(a => (
                <Link key={a.href} href={a.href} className={`flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition group ${a.color}`}>
                  <span>{a.icon}</span>
                  <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900">{a.label}</span>
                  <ArrowRight size={11} className="ml-auto text-slate-300 group-hover:text-current transition" />
                </Link>
              ))}
            </div>
          </div>

          {/* Resumen por responsable - oculto en mobile */}
          <div className="hidden md:block bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-xs font-black text-slate-600 uppercase tracking-wider">Por responsable</p>
            </div>
            <div className="divide-y divide-slate-50">
              {Object.entries(porResponsable)
                .sort((a, b) => (b[1].pendiente + b[1].en_proceso) - (a[1].pendiente + a[1].en_proceso))
                .map(([nombre, stats]) => (
                  <div key={nombre} className="px-4 py-3">
                    <p className="text-xs font-black text-slate-700 uppercase tracking-wide mb-2">{nombre}</p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-md">{stats.pendiente} pend.</span>
                      <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md">{stats.en_proceso} proc.</span>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">{stats.finalizado} fin.</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FilaVencimiento({ t, tipo, diasRestantes: dias }: { t: any, tipo: string, diasRestantes?: number }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 hover:bg-slate-50/60 transition">
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-8 h-8 rounded-lg flex flex-col items-center justify-center flex-shrink-0 ${
          tipo === 'vencido' ? 'bg-red-100 text-red-700' :
          tipo === 'urgente' ? 'bg-orange-100 text-orange-700' :
          'bg-slate-100 text-slate-600'
        }`}>
          <span className="text-xs font-black leading-none">{new Date(t.fecha_vencimiento).getDate()}</span>
          <span className="text-[7px] font-bold uppercase">{new Date(t.fecha_vencimiento).toLocaleString('es', { month: 'short' })}</span>
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-black text-blue-500 uppercase tracking-wide leading-none mb-0.5 truncate">{t.clientes?.razon_social}</p>
          <p className="text-sm font-bold text-slate-800 leading-tight truncate">{t.tipo_tramite}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
        <span className={`text-[10px] font-black px-2 py-1 rounded-lg whitespace-nowrap ${
          tipo === 'vencido' ? 'bg-red-100 text-red-700' :
          tipo === 'urgente' ? 'bg-orange-100 text-orange-700' :
          'bg-slate-100 text-slate-500'
        }`}>
          {tipo === 'vencido' ? 'Vencido' : dias === 0 ? 'Hoy' : `${dias}d`}
        </span>
        <Link href="/tramites" className="text-slate-300 hover:text-slate-600 transition">
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  )
}
