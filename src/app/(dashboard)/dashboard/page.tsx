import { createClient } from '@/lib/supabase'

export default async function Page() {
  const supabase = createClient()
  
  // 1. Obtenemos los datos del usuario logueado
  const { data: { user } } = await supabase.auth.getUser()
  
  // Extraemos el primer nombre (si puso nombre completo) o usamos su email como plan B
  const nombreParaMostrar = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Usuario'

  // 2. Traemos el conteo real de la base de datos (Ejecutamos en paralelo para más velocidad)
  const [clientesRes, tramitesRes] = await Promise.all([
    supabase.from('clientes').select('*', { count: 'exact', head: true }),
    supabase.from('tramites').select('*')
  ])

  const totalClientes = clientesRes.count || 0
  const tramites = tramitesRes.data || []

  // 3. Calculamos estados para las tarjetas
  const pendientes = tramites.filter(t => t.estado === 'pendiente').length
  const enProceso = tramites.filter(t => t.estado === 'en_proceso').length

  return (
    <div className="space-y-10">
      {/* SECCIÓN DE BIENVENIDA */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 rounded-3xl text-white shadow-xl">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">
          ¡Hola, {nombreParaMostrar}! 👋
        </h1>
        <p className="text-slate-400 mt-2 font-medium">
          Este es el resumen de actividad del estudio para hoy.
        </p>
      </div>

      {/* SECCIÓN DE MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* TARJETA CLIENTES */}
        <div className="bg-white p-7 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Total Clientes</p>
          <div className="flex items-baseline gap-2 mt-3">
            <p className="text-5xl font-black text-slate-900">{totalClientes}</p>
            <span className="text-slate-400 font-medium text-sm">activos</span>
          </div>
        </div>
        
        {/* TARJETA PENDIENTES */}
        <div className="bg-white p-7 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Trámites Pendientes</p>
          <div className="flex items-baseline gap-2 mt-3">
            <p className="text-5xl font-black text-orange-500">{pendientes}</p>
            <span className="text-slate-400 font-medium text-sm">por iniciar</span>
          </div>
        </div>

        {/* TARJETA EN PROCESO */}
        <div className="bg-white p-7 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">En Proceso</p>
          <div className="flex items-baseline gap-2 mt-3">
            <p className="text-5xl font-black text-emerald-600">{enProceso}</p>
            <span className="text-slate-400 font-medium text-sm">gestionando</span>
          </div>
        </div>
      </div>

      {/* NOTA RÁPIDA (Opcional) */}
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center gap-3">
        <div className="bg-blue-500 text-white p-1 rounded-full text-xs font-bold px-2">TIP</div>
        <p className="text-blue-800 text-sm">
          Podés marcar trámites como "Finalizados" directamente desde la sección de <strong className="cursor-pointer underline">Trámites</strong>.
        </p>
      </div>
    </div>
  )
}
