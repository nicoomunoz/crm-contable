import { login } from '@/app/actions'
import { AlertCircle, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'

export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden font-sans p-4">
      
      {/* Fondo con profundidad profesional */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#1e293b_0%,#0f172a_100%)] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-[420px]">
        
        {/* Cabecera del Portal */}
        <div className="text-center mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="inline-flex h-16 w-16 bg-white rounded-2xl items-center justify-center shadow-2xl mb-6">
                <LockKeyhole className="text-slate-900" size={30} />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight uppercase leading-none mb-3">
                Estudio <span className="text-blue-500">Grimalt</span>
            </h1>
            <div className="h-1 w-12 bg-blue-600 mx-auto rounded-full mb-3"></div>
            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.4em]">Gestión Contable Centralizada</p>
        </div>

        {/* Tarjeta de Acceso */}
        <div className="bg-white p-10 md:p-12 rounded-[2.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.4)] border border-slate-200">
          
          {/* Mensaje de Error */}
          {searchParams.error === 'true' && (
            <div className="bg-red-50 text-red-600 p-5 rounded-2xl text-[12px] font-bold mb-8 border border-red-100 flex items-start gap-3 animate-in zoom-in-95 duration-300">
               <AlertCircle size={20} className="shrink-0" />
               <p className="leading-snug">Los datos son incorrectos. Verificá tu usuario y contraseña.</p>
            </div>
          )}

          <form action={login} className="space-y-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 px-1 tracking-widest border-l-2 border-blue-500 pl-3">
                <Mail size={12} /> Usuario
              </label>
              <input 
                name="email" 
                type="email" 
                required 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-slate-900 font-bold outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm" 
                placeholder="email@estudiogrimalt.com"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 px-1 tracking-widest border-l-2 border-slate-300 pl-3">
                <ShieldCheck size={12} /> Clave de Acceso
              </label>
              <input 
                name="password" 
                type="password" 
                required 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-slate-900 font-bold outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm"
                placeholder="••••••••••••"
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-slate-950 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 mt-4"
            >
              Entrar al CRM
            </button>
          </form>

          {/* Estado de Seguridad */}
          <div className="mt-10 flex items-center justify-center gap-2 text-slate-300 font-black text-[9px] uppercase tracking-[0.3em]">
             <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
             Servidor Protegido
          </div>
        </div>
      </div>
    </div>
  )
}
