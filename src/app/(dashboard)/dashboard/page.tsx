import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { Clock, Users, AlertTriangle, CheckCircle2, ArrowRight, CalendarDays, FileText, UserPlus } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const nombreUsuario = user?.user_metadata?.full_name?.split(' ')[0] || 'Usuario'

  const [clientesRes, tramitesRes] = await Promise.all([
    supabase.from('clientes').select('id', { count: 'exact' }),
    supabase.from('tramites').select('*, clientes(razon_social)')
  ])

  const totalClientes = clientesRes.count || 0
  const tramites = tramitesRes.data || []

  const pendientes = tramites.filter(t => t.estado === 'pendiente').length
  const enProceso = tramites.filter(t => t.estado === 'en_proceso').length
  const finalizados = tramites.filter(t => t.estado === 'finalizado').length

  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const proximaSemana = new Date()
  proximaSemana.setDate(hoy.getDate() + 7)

  const proximosVencimientos = tramites.filter(t => {
    if (!t.fecha_vencimiento || t.estado === 'finalizado') return false
    const fv = new Date(t.fecha_vencimiento)
    return fv <= proximaSemana
  }).sort((a, b) => new Date(a.fecha_vencimiento).getTime() - new Date(b.fecha_vencimiento).getTime())
  
  const urgentesCount = tramites.filter(t => {
    if (!t.fecha_vencimiento || t.estado === 'finalizado') return false
    const dias = Math.ceil((new Date(t.fecha_vencimiento).getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
    return dias >= 0 && dias <= 3
  }).length

  function diasRestantes(fecha: string) {
    const fv = new Date(fecha)
    return Math.ceil((fv.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-blue-600 mb-1">Estudio Grimalt</p>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Hola, {nombreUsuario}</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/clientes/nuevo" className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-2xl text-xs font-bold hover:bg-slate-50 transition shadow-sm">
            <UserPlus size={14} /> Nuevo Cliente
          </Link>
          <Link href="/tramites/nuevo" className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-2xl text-xs font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20">
            <FileText size={14} /> Nuevo Trámite
          </Link>
        </div>
      </div>

      {/* MÉTRICAS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Clientes" value={totalClientes} sub="registrados" accent="blue" icon={<Users size={16} />} />
        <MetricCard label="Pendientes" value={pendientes} sub="sin iniciar" accent="orange" icon={<Clock size={16} />} />
        <MetricCard label="En proceso" value={enProceso} sub="en curso" accent="blue" icon={<ArrowRight size={16} />} />
        <MetricCard label="Finalizados" value={finalizados} sub="completados" accent="emerald" icon={<CheckCircle2 size={16} />} />
      </div>

      {/* CUERPO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Vencimientos */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CalendarDays size={16} className="text-slate-400" />
              <h2 className="text-sm font-black text-slate-700 uppercase tracking-wide">Vencimientos esta semana</h2>
            </div>
            {proximosVencimientos.length > 0 && (
              <span className="text-[10px] font-black text-red-500 bg-red-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                <AlertTriangle size={9} /> {urgentesCount} urgente{urgentesCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden">
            {proximosVencimientos.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {proximosVencimientos.map((t) => {
                  const dias = diasRestantes(t.fecha_vencimiento)
                  const vencido = dias < 0
                  const hoyMismo = dias === 0
                  return (
                    <div key={t.id} className={`px-6 py-4 flex items-center justify-between hover:bg-slate-50/60 transition ${vencido ? 'bg-red-50/30' : ''}`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 ${vencido ? 'bg-red-100 text-red-600' : hoyMismo ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                          <span className="text-sm font-black leading-none">{new Date(t.fecha_vencimiento).getDate()}</span>
                          <span className="text-[8px] font-bold uppercase">{new Date(t.fecha_vencimiento).toLocaleString('es', { month: 'short' })}</span>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-blue-500 uppercase tracking-wide">{t.clientes?.razon_social}</p>
                          <p className="font-bold text-slate-800 text-sm leading-tight">{t.tipo_tramite}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                          vencido ? 'bg-red-100 text-red-600' :
                          hoyMismo ? 'bg-red-100 text-red-600' :
                          dias <= 3 ? 'bg-orange-100 text-orange-600' :
                          'bg-slate-100 text-slate-500'
                        }`}>
                          {vencido ? 'Vencido' : hoyMismo ? 'Hoy' : `${dias}d`}
                        </span>
                        <Link href="/tramites" className="text-slate-500 hover:text-slate-600 transition">
                          <ArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="py-14 text-center">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 size={20} />
                </div>
                <p className="text-slate-400 text-sm font-bold">Sin vencimientos esta semana</p>
                <p className="text-slate-300 text-xs mt-0.5">Todo al día</p>
              </div>
            )}
          </div>
        </div>

        {/* Accesos rápidos */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-sm font-black text-slate-700 uppercase tracking-wide">Accesos rápidos</h2>
          </div>
          <div className="space-y-3">
            <AccesoCard
              href="/tramites/nuevo"
              titulo="Nuevo Trámite"
              subtitulo="Iniciar gestión para un cliente"
              color="blue"
              icon={<FileText size={16} />}
            />
            <AccesoCard
              href="/clientes/nuevo"
              titulo="Nuevo Cliente"
              subtitulo="Registrar un cliente al estudio"
              color="slate"
              icon={<UserPlus size={16} />}
            />
            <AccesoCard
              href="/tramites?estado=pendiente"
              titulo="Ver Pendientes"
              subtitulo={`${pendientes} trámite${pendientes !== 1 ? 's' : ''} sin iniciar`}
              color="orange"
              icon={<Clock size={16} />}
            />
            <AccesoCard
              href="/clientes"
              titulo="Ver Clientes"
              subtitulo={`${totalClientes} cliente${totalClientes !== 1 ? 's' : ''} registrados`}
              color="emerald"
              icon={<Users size={16} />}
            />
          </div>
        </div>

      </div>
    </div>
  )
}

function MetricCard({ label, value, sub, accent, icon }: { label: string, value: number, sub: string, accent: string, icon: any }) {
  const styles: any = {
    blue: { card: 'border-blue-100', icon: 'bg-blue-50 text-blue-600', value: 'text-blue-600' },
    orange: { card: 'border-orange-100', icon: 'bg-orange-50 text-orange-500', value: 'text-orange-500' },
    emerald: { card: 'border-emerald-100', icon: 'bg-emerald-50 text-emerald-600', value: 'text-emerald-600' },
    slate: { card: 'border-slate-100', icon: 'bg-slate-100 text-slate-600', value: 'text-slate-700' },
  }
  const s = styles[accent]
  return (
    <div className={`bg-white rounded-[1.5rem] border ${s.card} p-6 shadow-sm hover:shadow-md transition`}>
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-4 ${s.icon}`}>
        {icon}
      </div>
      <p className={`text-3xl font-black ${s.value}`}>{value}</p>
      <p className="text-slate-700 text-sm font-bold mt-0.5">{label}</p>
      <p className="text-slate-400 text-xs">{sub}</p>
    </div>
  )
}

function AccesoCard({ href, titulo, subtitulo, color, icon }: any) {
  const styles: any = {
    blue: 'hover:border-blue-200 hover:bg-blue-50/30 text-blue-600',
    orange: 'hover:border-orange-200 hover:bg-orange-50/30 text-orange-500',
    emerald: 'hover:border-emerald-200 hover:bg-emerald-50/30 text-emerald-600',
    slate: 'hover:border-slate-300 hover:bg-slate-50/60 text-slate-600',
  }
  return (
    <Link href={href} className={`flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm transition group ${styles[color]}`}>
      <div className="w-8 h-8 rounded-xl bg-current/10 flex items-center justify-center flex-shrink-0 opacity-80">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-800 group-hover:text-slate-900">{titulo}</p>
        <p className="text-xs text-slate-400 truncate">{subtitulo}</p>
      </div>
      <ArrowRight size={14} className="text-slate-300 group-hover:text-current transition flex-shrink-0" />
    </Link>
  )
}
