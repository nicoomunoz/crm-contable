import { updatePassword } from '@/app/actions'
import { Key, ShieldCheck, AlertCircle, ShieldAlert } from 'lucide-react'

export default function PerfilPage({ searchParams }: { searchParams: { error?: string, success?: string } }) {
  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-50 relative overflow-hidden">
        
        {/* Decoración lateral para indicar que es zona de seguridad */}
        <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>

        {/* Encabezado */}
        <div className="mb-10">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 border border-blue-100 shadow-sm">
                <Key className="text-blue-600" size={32} />
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic leading-none text-left">Mi Seguridad</h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-3 border-b pb-4">Gestión de clave personal</p>
        </div>

        {/* Mensajes de Alerta de Servidor */}
        {searchParams.error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold mb-6 border border-red-100 flex items-center gap-3 animate-in fade-in zoom-in-95">
                <AlertCircle size={20} /> 
                <span className="leading-tight">{searchParams.error}</span>
            </div>
        )}
        {searchParams.success && (
            <div className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl text-xs font-bold mb-6 border border-emerald-100 flex items-center gap-3 animate-in fade-in zoom-in-95">
                <ShieldCheck size={20} /> 
                <span>¡Contraseña actualizada con éxito!</span>
            </div>
        )}

        <form action={updatePassword} className="space-y-6">
          {/* CAMPO: NUEVA CONTRASEÑA */}
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 px-1 tracking-widest italic border-l-2 border-blue-600 pl-2 ml-1">
              Nueva Contraseña
            </label>
            <input 
              name="password" 
              type="password" 
              required 
              className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 text-slate-700 font-bold outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
              placeholder="Más de 8 caracteres, 1 número y 1 símbolo"
            />
            <p className="text-[9px] text-slate-300 font-bold mt-2 ml-2 uppercase italic tracking-tighter">
                Requerido: Al menos un número y un símbolo (@, $, !, etc)
            </p>
          </div>

          {/* CAMPO: CONFIRMAR */}
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 px-1 tracking-widest italic border-l-2 border-red-400 pl-2 ml-1">
              Confirmar Contraseña
            </label>
            <input 
              name="confirmPassword" 
              type="password" 
              required 
              className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 text-slate-700 font-bold outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
              placeholder="Repetí la clave de arriba"
            />
          </div>

          {/* BOTÓN ACCIÓN */}
          <button 
            type="submit" 
            className="w-full bg-slate-950 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all active:scale-95 flex items-center justify-center gap-3 group"
          >
            Actualizar Clave <ShieldAlert size={18} className="group-hover:rotate-12 transition-transform" />
          </button>
        </form>
        
        <p className="text-[10px] text-slate-300 font-black text-center mt-8 uppercase tracking-[0.3em] leading-relaxed italic border-t pt-6 border-slate-50">
            PROTECCIÓN DE DATOS ACTIVA
        </p>
      </div>
    </div>
  )
}
