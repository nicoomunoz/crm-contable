import { ReactNode } from 'react'
import { signOut } from '@/app/actions'
import { Users, LayoutDashboard, Briefcase, LogOut, Settings, History } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import Notificaciones from '@/components/Notificaciones'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const nombreUsuario = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuario'

  const { data: notificaciones } = await supabase
    .from('notificaciones')
    .select('*')
    .eq('para_usuario', nombreUsuario)
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <div className="flex min-h-screen bg-gray-50 text-slate-900 font-sans">

      {/* SIDEBAR DESKTOP */}
      <aside className="hidden md:flex w-64 bg-slate-900 text-slate-300 flex-col fixed h-full border-r border-slate-800 z-30">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <Briefcase size={18} />
          </div>
          <span className="text-white font-bold tracking-tight text-lg">GRIMALT</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { href: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Inicio / Resúmen' },
            { href: '/clientes', icon: <Users size={20} />, label: 'Clientes' },
            { href: '/tramites', icon: <Briefcase size={20} />, label: 'Trámites' },
            { href: '/historial', icon: <History size={20} />, label: 'Historial' },
            { href: '/perfil', icon: <Settings size={20} />, label: 'Seguridad' },
          ].map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 p-3 hover:bg-slate-800 hover:text-white rounded-xl transition duration-200 font-medium"
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <div className="flex items-center gap-2 px-3 py-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-[11px] font-black flex-shrink-0">
              {nombreUsuario.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs font-bold text-slate-300 truncate flex-1">{nombreUsuario}</span>
            <Notificaciones notificaciones={notificaciones || []} nombreUsuario={nombreUsuario} />
          </div>
          <form action={signOut}>
            <button type="submit" className="flex items-center gap-3 p-3 w-full hover:bg-red-950/40 rounded-xl text-red-400 hover:text-red-300 transition duration-200 group">
              <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
              <span className="font-bold">Cerrar sesión</span>
            </button>
          </form>
        </div>
      </aside>

      {/* NAVBAR MOBILE */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <Briefcase size={15} />
          </div>
          <span className="text-white font-bold text-sm">GRIMALT</span>
        </div>
        <div className="flex items-center gap-2">
          <Notificaciones notificaciones={notificaciones || []} nombreUsuario={nombreUsuario} />
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white text-[11px] font-black">
            {nombreUsuario.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      {/* BOTTOM NAV MOBILE */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-slate-900 border-t border-slate-800 flex items-center justify-around px-2 py-2">
        <Link href="/dashboard" className="flex flex-col items-center gap-0.5 p-2 text-slate-400 hover:text-white transition">
          <LayoutDashboard size={20} />
          <span className="text-[9px] font-bold uppercase tracking-wide">Inicio</span>
        </Link>
        <Link href="/clientes" className="flex flex-col items-center gap-0.5 p-2 text-slate-400 hover:text-white transition">
          <Users size={20} />
          <span className="text-[9px] font-bold uppercase tracking-wide">Clientes</span>
        </Link>
        <Link href="/tramites/nuevo" className="flex flex-col items-center gap-0.5 p-2">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg -mt-6 border-4 border-slate-900">
            <Briefcase size={22} className="text-white" />
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wide text-blue-400 mt-0.5">Nuevo</span>
        </Link>
        <Link href="/tramites" className="flex flex-col items-center gap-0.5 p-2 text-slate-400 hover:text-white transition">
          <History size={20} />
          <span className="text-[9px] font-bold uppercase tracking-wide">Trámites</span>
        </Link>
        <form action={signOut}>
          <button type="submit" className="flex flex-col items-center gap-0.5 p-2 text-red-400 hover:text-red-300 transition">
            <LogOut size={20} />
            <span className="text-[9px] font-bold uppercase tracking-wide">Salir</span>
          </button>
        </form>
      </nav>

      {/* MAIN */}
      <main className="flex-1 md:pl-64 overflow-y-auto">
        <div className="p-4 md:p-8 max-w-7xl mx-auto pt-16 md:pt-8 pb-24 md:pb-8">
          {children}
        </div>
      </main>
    </div>
  )
}
