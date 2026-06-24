import { login } from '@/app/actions'
import { AlertCircle, Lock } from 'lucide-react'

export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans p-4">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-slate-100">
        
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                <Lock className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-black italic tracking-tighter text-slate-800 uppercase">Estudio GRIMALT</h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Acceso a plataforma</p>
        </div>

        {/* CARTEL DE ERROR DE LOGIN */}
        {searchParams.error === 'true' && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold mb-6 border border-red-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
             <AlertCircle size={18} />
             <span>El mail o la contraseña son incorrectos. Intentá de nuevo.</span>
          </div>
        )}

        <form action={login} className="space-y-5">
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 px-1 tracking-widest">Tu Correo</label>
            <input 
              name="email" 
              type="email" 
              required 
              className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 text-slate-700 font-bold outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner" 
              placeholder="nombre@estudio.com"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 px-1 tracking-widest">Contraseña</label>
            <input 
              name="password" 
              type="password" 
              required 
              className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 text-slate-700 font-bold outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="w-full bg-slate-950 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl active:scale-95 mt-4">
            INGRESAR
          </button>
        </form>
      </div>
    </div>
  )
}
