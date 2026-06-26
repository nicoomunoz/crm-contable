import { login } from '@/app/actions'
import { AlertCircle, LockKeyhole, Mail, ShieldCheck, Database } from 'lucide-react'

export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] font-sans text-slate-900">
      
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '24px 24px' }}
      />

      <div className="relative z-10 flex w-full max-w-[900px] bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] rounded-xl border border-slate-200 overflow-hidden mx-4">
        
        {/* COLUMNA IZQUIERDA */}
        <div className="hidden md:flex flex-col justify-between w-1/2 bg-slate-900 p-12 text-white relative">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 mb-10 text-blue-400">
              <Database size={24} />
              <span className="font-bold tracking-widest text-xs uppercase">Sistema de Gestión Contable</span>
            </div>
            <h1 className="text-4xl font-black leading-[1.1] mb-6 tracking-tight uppercase">
              ESTUDIO <br/> 
              <span className="text-blue-500 underline decoration-4 underline-offset-8">GRIMALT</span>
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed max-w-[280px] font-bold uppercase tracking-wider text-[10px]">
              Acceso a trámites y clientes.
            </p>
          </div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-600/10 blur-[60px] rounded-full" />
        </div>

        {/* COLUMNA DERECHA */}
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white border-l border-slate-50">
          <div className="mb-10 md:hidden text-center">
            <h1 className="text-2xl font-black uppercase text-slate-800 tracking-tight">Estudio Grimalt</h1>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tighter leading-none">Bienvenido/a</h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest opacity-60">Ingrese sus credenciales de acceso</p>
          </div>

          {searchParams.error === 'true' && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-xs font-black mb-8 border border-red-200 flex items-start gap-3 uppercase tracking-tight">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p>Los datos son incorrectos. Reintente por favor.</p>
            </div>
          )}

          <form action={login} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2 ml-1">
                <Mail size={12} /> Mail
              </label>
              <input 
                name="email" 
                type="email"
                autoComplete="email"
                required 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-slate-900 text-sm font-bold outline-none focus:border-blue-600 focus:bg-white transition-all shadow-sm" 
                placeholder="ejemplo@grimalt.com"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2 ml-1">
                <ShieldCheck size={12} /> Clave de sistema
              </label>
              <input 
                name="password" 
                type="password"
                autoComplete="current-password"
                required 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-slate-900 text-sm font-bold outline-none focus:border-blue-600 focus:bg-white transition-all shadow-sm"
                placeholder="••••••••••••"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-slate-900 text-white py-4 rounded-lg font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-blue-700 transition-all active:scale-[0.98] flex items-center justify-center gap-3 mt-6"
            >
              INGRESAR AL PANEL <LockKeyhole size={14} />
            </button>
          </form>

          <div className="mt-14 text-center border-t pt-8 border-slate-50">
            <div className="flex items-center justify-center gap-3 text-slate-400 font-black text-[9px] uppercase tracking-[0.2em]">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Conexión segura
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
