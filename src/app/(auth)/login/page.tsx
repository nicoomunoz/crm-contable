import { login } from '@/app/actions'
import { AlertCircle, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'

export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f1d] relative overflow-hidden font-sans p-4">
      
      {/* DECORACIÓN DE FONDO PRO: Círculos sutiles de color */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-slate-800/30 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-[440px]">
        {/* LOGO O NOMBRE SUPERIOR */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="inline-flex h-16 w-16 bg-white rounded-[1.2rem] items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.3)] mb-6 ring-1 ring-white/20">
                <LockKeyhole className="text-slate-900" size={32} />
            </div>
            <h1 className="text-4xl font-black text-white italic tracking-tighter leading-none mb-2">
                ESTUDIO <span className="text-blue-500">GRIMALT</span>
            </h1>
            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-[0.4em] ml-1">Portal Operativo v1.0</p>
        </div>

        {/* TARJETA DE LOGIN */}
        <div className="bg-white p-10 md:p-12 rounded-[2.8rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-white/10 relative">
          
          {/* CARTEL DE ERROR REDISEÑADO */}
          {searchParams.error === 'true' && (
            <div className="bg-red-50 text-red-600 p-5 rounded-2xl text-[12px] font-bold mb-8 border border-red-100 flex items-start gap-3 animate-in zoom-in-95 duration-300">
               <AlertCircle size={20} className="shrink-0" />
               <p className="leading-snug text-left italic">Los datos ingresados no coinciden con nuestros registros. Revisalos y volvé a intentar.</p>
            </div>
          )}

          <form action={login} className="space-y-6">
            <div className="group">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 mb-2.5 px-1 tracking-widest italic group-focus-within:text-blue-600 transition-colors">
                <Mail size={12} /> Email del Usuario
              </label>
              <input 
                name="email" 
                type="email" 
                required 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-slate-900 font-bold outline-none focus:border-blue-600 focus:bg-white transition-all hover:border-slate-200 placeholder:text-slate-300 shadow-sm" 
                placeholder="nombre@estudiogrimalt.com"
              />
            </div>

            <div className="group border-b pb-8 border-slate-100">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 mb-2.5 px-1 tracking-widest italic group-focus-within:text-blue-600 transition-colors">
                <ShieldCheck size={12} /> Contraseña
              </label>
              <input 
                name="password" 
                type="password" 
                required 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-slate-900 font-bold outline-none focus:border-blue-600 focus:bg-white transition-all hover:border-slate-200 placeholder:text-slate-300 shadow-sm"
                placeholder="••••••••••••"
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-slate-950 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl hover:shadow-blue-500/30 active:scale-95 flex items-center justify-center gap-4 group"
            >
              INGRESAR AHORA
            </button>
          </form>

          {/* FOOTER INTERNO */}
          <div className="mt-8 text-center">
            <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.2em] italic flex items-center justify-center gap-2">
               <span className="w-8 h-[1px] bg-slate-100"></span> 
               Sesión Protegida
               <span className="w-8 h-[1px] bg-slate-100"></span> 
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
