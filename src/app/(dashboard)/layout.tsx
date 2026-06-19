import { ReactNode } from 'react'
import { Users, LayoutDashboard, Briefcase, LogOut } from 'lucide-react'
import Link from 'next/link'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 text-xl font-bold border-b border-slate-800">
          Contador CRM
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link href="/clientes" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg">
            <Users size={20} /> Clientes
          </Link>
          <Link href="/tramites" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg">
            <Briefcase size={20} /> Trámites
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-800">
           <button className="flex items-center gap-3 p-3 w-full hover:bg-red-900 rounded-lg text-red-400">
            <LogOut size={20} /> Salir
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 text-slate-800">
        {children}
      </main>
    </div>
  )
}
