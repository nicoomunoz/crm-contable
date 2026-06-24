import { ReactNode } from 'react'
import { signOut } from '@/app/actions'
import { Users, LayoutDashboard, Briefcase, LogOut, Settings } from 'lucide-react'
import Link from 'next/link'
import SessionGuard from '@/components/SessionGuard' // <-- Importar
import { History } from 'lucide-react'


export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50 text-slate-900 font-sans">
      <SessionGuard />
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed h-full border-r border-slate-800">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <Briefcase size={18} />
          </div>
          <span className="text-white font-bold tracking-tight text-lg">
            GRIMALT
          </span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-3 p-3 hover:bg-slate-800 hover:text-white rounded-xl transition duration-200"
          >
            <LayoutDashboard size={20} /> 
            <span className="font-medium">Inicio / Resúmen</span>
          </Link>
          
          <Link 
            href="/clientes" 
            className="flex items-center gap-3 p-3 hover:bg-slate-800 hover:text-white rounded-xl transition duration-200"
          >
            <Users size={20} /> 
            <span className="font-medium">Clientes</span>
          </Link>
          
          <Link 
            href="/tramites" 
            className="flex items-center gap-3 p-3 hover:bg-slate-800 hover:text-white rounded-xl transition duration-200"
          >
            <Briefcase size={20} /> 
            <span className="font-medium">Trámites</span>
          </Link>
          <Link
            href="/historial"
            className="flex items-center gap-3 p-3 hover:bg-slate-800 hover:text-white rounded-xl transition duration-200"
          >
            <History size={20} />
            <span className="font-medium">Historial</span>
          </Link>
          <Link 
            href="/perfil" 
            className="flex items-center gap-3 p-3 hover:bg-slate-800 hover:text-white rounded-xl transition duration-200"
          >
            <Settings size={20} /> 
            <span className="font-medium text-sm">Seguridad</span>
          </Link>
        </nav>

        {/* Footer Sidebar / Logout */}
        <div className="p-4 border-t border-slate-800">
           <form action={signOut}>
              <button 
                type="submit" 
                className="flex items-center gap-3 p-3 w-full hover:bg-red-950/40 rounded-xl text-red-400 hover:text-red-300 transition duration-200 group"
              >
                <LogOut size={20} className="group-hover:translate-x-1 transition-transform" /> 
                <span className="font-bold">Cerrar sesión</span>
              </button>
           </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 pl-64 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
