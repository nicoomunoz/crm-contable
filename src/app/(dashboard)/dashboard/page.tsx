import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { Clock, Users, AlertCircle, CheckCircle, ArrowRight, CalendarDays } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = createClient()
  
  // 1. Obtener usuario actual
  const { data: { user } } = await supabase.auth.getUser()
  const nombreUsuario = user?.user_metadata?.full_name?.split(' ')[0] || 'Usuario'

  // 2. Traer todos los datos necesarios
  const [clientesRes, tramitesRes] = await Promise.all([
    supabase.from('clientes').select('id', { count: 'exact' }),
    supabase.from('tramites').select('*, clientes(razon_social)')
  ])

  const totalClientes = clientesRes.count || 0
  const tramites = tramitesRes.data || []

  // 3. Lógica de estados y vencimientos
  const pendientes = tramites.filter(t => t.estado === 'pendiente').length
  const enProceso = tramites.filter(t => t.estado === 'en_proceso').length
  
  // Trámites urgentes (vencen en los próximos 7 días y no están finalizados)
  const hoy = new Date()
  const proximaSemana = new Date()
  proximaSemana.setDate(hoy.getDate() + 7)

  const urgentes = tramites.filter(t => {
    if (!t.fecha_vencimiento || t.estado === 'finalizado') return false
    const fv = new Date(t.fecha_vencimiento)
    return fv <= proximaSemana
  }).sort((a, b) => new Date(a.fecha_vencimiento).getTime() - new Date(b.fecha_vencimiento).getTime())

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER: Bienvenida y Accesos Rápidos */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">¡Hola, {nombreUsuario}! 👋</h1>
          <p className="text-slate-400 font-medium mt-1 uppercase text-xs tracking-widest">Estudio Contable - Panel de Control</p>
        </div>
        <div className="flex gap-2">
          <Link href="/clientes/nuevo" className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 border border-white/10">
            + CLIENTE
          </Link>
          <Link href="/tramites/nuevo" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-blue-500/30">
            + TRAMITE
          </Link>
        </div>
      </div>

      {/* MÉTRICAS PRINCIPALES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Clientes" value={totalClientes} icon={<Users />} color="blue" />
        <StatCard title="Pendientes" value={pendientes} icon={<Clock />} color="orange" />
        <StatCard title="En Proceso" value={enProceso} icon={<ArrowRight />} color="emerald" />
        <StatCard title="Urgentes" value={urgentes.length} icon={<AlertCircle />} color="red" />
      </div>

      {/* SECCIÓN INFERIOR: Dos columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMNA 1 y 2: Vencimientos Próximos */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black text-slate-800 italic flex items-center gap-2">
              <CalendarDays className="text-red-500" /> Próximos Vencimientos
            </h2>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
            {urgentes.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {urgentes.map((t) => (
                  <div key={t.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition">
                    <div className="flex gap-4 items-center text-sm leading-tight">
                        <div className="h-10 w-10 rounded-full bg-red-50 text-red-500 flex flex-col items-center justify-center font-black">
                            <span className="text-[10px]">{new Date(t.fecha_vencimiento).getDate()}</span>
                            <span className="text-[8px] uppercase">{new Date(t.fecha_vencimiento).toLocaleString('es', { month: 'short' })}</span>
                        </div>
                        <div>
                            <p className="text-blue-600 font-black text-[10px] uppercase tracking-tighter">{t.clientes?.razon_social}</p>
                            <p className="font-bold text-slate-800 text-base">{t.tipo_tramite}</p>
                        </div>
                    </div>
                    <Link href="/tramites" className="text-slate-300 hover:text-slate-900 transition p-2">
                        <ArrowRight size={18} />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center space-y-3">
                <div className="bg-emerald-50 text-emerald-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle size={24} />
                </div>
                <p className="text-slate-400 font-bold text-sm uppercase">¡No hay vencimientos esta semana!</p>
              </div>
            )}
          </div>
        </div>

        {/* COLUMNA 3: Tips Contables o Equipo */}
        <div className="space-y-6">
           <h2 className="text-xl font-black text-slate-800 italic px-2">Atajos de Trabajo</h2>
           <div className="grid grid-cols-1 gap-3">
             <AtajoLink title="Ver Facturación" subtitle="IVA y Ganancias" href="/tramites" color="bg-blue-50 text-blue-700" />
             <AtajoLink title="Alta Empleados" subtitle="Trámites Laborales" href="/tramites" color="bg-orange-50 text-orange-700" />
             <AtajoLink title="Certificaciones" subtitle="Contables / Bancarias" href="/tramites" color="bg-emerald-50 text-emerald-700" />
           </div>
        </div>

      </div>
    </div>
  )
}

// COMPONENTES AUXILIARES
function StatCard({ title, value, icon, color }: { title: string, value: number, icon: any, color: string }) {
  const colors: any = {
    blue: 'text-blue-600 bg-blue-50 border-blue-100',
    orange: 'text-orange-500 bg-orange-50 border-orange-100',
    emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    red: 'text-red-500 bg-red-50 border-red-100',
  }

  return (
    <div className="bg-white p-7 rounded-[2rem] border border-slate-50 shadow-xl shadow-slate-100 flex flex-col items-center text-center transition hover:scale-[1.02]">
      <div className={`p-4 rounded-2xl mb-4 ${colors[color]} border shadow-sm`}>
        {icon}
      </div>
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{title}</p>
      <p className="text-4xl font-black text-slate-900 mt-1">{value}</p>
    </div>
  )
}

function AtajoLink({ title, subtitle, href, color }: any) {
  return (
    <Link href={href} className={`p-5 rounded-[1.5rem] flex flex-col hover:shadow-lg transition-all ${color} group border border-transparent hover:border-current/10`}>
        <p className="font-black text-sm uppercase tracking-tighter flex items-center justify-between">
            {title}
            <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </p>
        <p className="text-xs opacity-60 font-medium">{subtitle}</p>
    </Link>
  )
}
