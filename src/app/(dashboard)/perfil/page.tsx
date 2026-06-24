import { updatePassword } from '@/app/actions'
import { Key, ShieldCheck, AlertCircle } from 'lucide-react'

export default function PerfilPage({ searchParams }: { searchParams: { error?: string, success?: string } }) {
  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-50 relative overflow-hidden">
        {/* Encabezado */}
        <div className="mb-10 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100">
                <Key className="text-blue-600" size={32} />
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic leading-none">Mi Seguridad</h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-3">Cambiar contraseña de acceso</p>
        </div>

        {/* Mensajes de Estado */}
        {searchParams.error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-xs font-bold mb-6 border border-red-100 flex items-center gap-3">
                <AlertCircle size={18} /> {searchParams.error}
            </div>
        )}
        {searchParams.success && (
            <div className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl text-xs font-bold mb-6 border border-emerald-100 flex items-center gap-3">
                <ShieldCheck size={18} /> ¡Contraseña actualizada con éxito!
            </div>
        )}

        <form action={updatePassword} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 px-1 tracking-widest font-bold">Nueva Contraseña</label>
            <input 
              name="password" 
              type="password" 
              required 
              minLength={6}
              className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 text-slate-700 font-bold outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 px-1 tracking-widest font-bold text-red-400">Confirmar Contraseña</label>
            <input 
              name="confirmPassword" 
              type="password" 
              required 
              minLength={6}
              className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 text-slate-700 font-bold outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
              placeholder="Repetí tu contraseña"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all active:scale-95"
          >
            Actualizar mi Clave
          </button>
        </form>
        
        <p className="text-[9px] text-slate-300 font-bold text-center mt-8 uppercase tracking-widest leading-relaxed">
            Recordá que por seguridad la sesión podría <br/> cerrarse después del cambio.
        </p>
      </div>
    </div>
  )
}
