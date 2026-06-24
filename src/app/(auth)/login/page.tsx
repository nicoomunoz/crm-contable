import { login } from '@/app/actions'
import { AlertCircle, LockKeyhole, Mail, ShieldCheck, Database } from 'lucide-react'

export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] font-sans">
      
      {/* Fondo de oficina moderna (Grid sutil de puntos) */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

      <div className="relative z-10 flex w-full max-w-[950px] min-h-[600px] bg-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] rounded-xl border border-slate-200 overflow-hidden mx-4">
        
        {/* COLUMNA IZQUIERDA: Marca/Identidad */}
        <div className="hidden md:flex flex-col justify-between w-1/2 bg-[#0f172a] p-12 text-white relative">
          <div className="relative z-10">
            
            {/* LOGO PNG INTEGRADO AQUÍ */}
            <div className="bg-white p-5 rounded-lg mb-10 shadow-lg inline-block border-b-4 border-blue-500">
               <img 
                 src="/logo.png" 
                 alt="Logo Estudio Grimalt" 
                 className="h-16 w-auto object-contain" 
               />
            </div>

            <div className="inline-flex items-center gap-2 mb-8 text-blue-400 opacity-90 uppercase font-black text-[10px] tracking-[0.3em]">
               <Database size={16} />
               <span>Sistema de Gestión Contable</span>
            </div>

            <h1 className="text-4xl font-black leading-[1.1] mb-6 tracking-tight uppercase border-l-4 border-blue-600 pl-5">
              ESTUDIO <br/> 
              <span className="text-blue-500 underline decoration-4 underline-offset-[10px]">GRIMALT</span>
            </h1>

            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-10 leading-relaxed max-w-[220px] opacity-70">
              Acceso a trámites y clientes.
            </p>
          </div>

          <div className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] relative z-10">
            estudiogrimalt@gmail.com
          </div>

          {/* Decoración geométrica sutil al fondo */}
          <div className="absolute bottom-[-40px] right-[-40px] w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full pointer-events-none"></div>
        </div>

        {/* COLUMNA DERECHA: Formulario */}
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white">
          <div className="mb-12 md:hidden">
              <img src="/logo.png" alt="Logo" className="h-12 mb-4 bg-slate-50 p-2 rounded-lg" />
              <h1 className="text-2xl font-black uppercase text-slate-800 tracking-tight leading-none">Estudio Grimalt</h1>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Bienvenido/a</h2>
            <p className="text-slate-500 text-sm font-medium">Ingrese sus credenciales de acceso</p>
          </div>

          {searchParams.error === 'true' && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-[11px] font-black mb-8 border border-red-200 flex items-center gap-3 animate-in fade-in slide-in-from-top-1 duration-300">
               <AlertCircle size={18} className="shrink-0" />
               <p className="uppercase tracking-tight">Los datos son incorrectos. Verifique mail y clave.</p>
            </div>
          )}

          <form action={login} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2 ml-1">
                <Mail size={12} className="text-slate-300" /> Correo electrónico
              </label>
              <input 
                name="email" 
                type="email" 
                required 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-slate-900 text-sm font-bold outline-none focus:border-blue-600 focus:bg-white transition-all shadow-sm" 
                placeholder="nombre@grimalt.com"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2 ml-1">
                <ShieldCheck size={12} className="text-slate-300" /> Clave de sistema
              </label>
              <input 
                name="password" 
                type="password" 
                required 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-slate-900 text-sm font-bold outline-none focus:border-blue-600 focus:bg-white transition-all shadow-sm"
                placeholder="••••••••••••"
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-slate-950 text-white py-4.5 rounded-lg font-black text-[11px] uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-3 mt-6 shadow-slate-900/10 py-4"
            >
              INGRESAR AL PANEL <LockKeyhole size={14} />
            </button>
          </form>

          <div className="mt-14 text-center border-t pt-8 border-slate-50 flex flex-col items-center">
             <div className="flex items-center gap-3 text-slate-300 font-black text-[9px] uppercase tracking-[0.3em]">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                Conexión segura 
             </div>
          </div>
        </div>

      </div>
    </div>
  )
}
