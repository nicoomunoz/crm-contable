import { updatePassword } from '@/app/actions'
import { Key, ShieldCheck, AlertCircle, ShieldAlert } from 'lucide-react'

export default function PerfilPage({ searchParams }: { searchParams: { error?: string, success?: string } }) {
  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      
      {/* Encabezado de sección */}
      <div className="mb-10 border-b border-slate-200 pb-6 text-left">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-3">
          Seguridad de la cuenta
        </h1>
        <p className="text-slate-500 text-sm mt-2">Gestione sus credenciales de acceso al portal.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* COLUMNA INFO: Consejos */}
        <div className="w-full md:w-1/3 bg-slate-50 border border-slate-200 p-8 rounded-xl space-y-6 text-slate-600">
            <div className="p-4 bg-white rounded-lg shadow-sm border border-slate-200">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest border-b pb-2">Requisitos de clave</p>
                <ul className="text-xs space-y-2 font-bold uppercase tracking-tighter">
                    <li className="flex items-center gap-2 text-emerald-600 underline">✔ Mínimo 8 caracteres</li>
                    <li className="flex items-center gap-2">◌ Incluir 1 número</li>
                    <li className="flex items-center gap-2">◌ Incluir 1 símbolo</li>
                </ul>
            </div>
            <p className="text-[10px] leading-relaxed uppercase font-black text-slate-400">
                Cualquier cambio de contraseña <br/> afectará inmediatamente <br/> su próxima sesión.
            </p>
        </div>

        {/* COLUMNA FORMULARIO */}
        <div className="w-full md:w-2/3 bg-white p-10 rounded-xl shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-200">
            
            {/* Mensajes de Alerta */}
            {searchParams.error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg text-xs font-bold mb-8 border border-red-200 flex items-center gap-3">
                    <AlertCircle size={20} /> <span>{searchParams.error}</span>
                </div>
            )}
            {searchParams.success && (
                <div className="bg-emerald-50 text-emerald-700 p-4 rounded-lg text-xs font-bold mb-8 border border-emerald-200 flex items-center gap-3">
                    <ShieldCheck size={20} /> <span>¡Contraseña actualizada con éxito!</span>
                </div>
            )}

            <form action={updatePassword} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block px-1">Nueva Clave</label>
                        <input 
                            name="password" 
                            type="password" 
                            required 
                            className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-900 font-bold outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all shadow-sm"
                            placeholder="Al menos una letra, número y símbolo"
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block px-1 text-red-400">Repetir Clave</label>
                        <input 
                            name="confirmPassword" 
                            type="password" 
                            required 
                            className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-900 font-bold outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all shadow-sm"
                        />
                    </div>
                </div>

                <button 
                    type="submit" 
                    className="w-full bg-slate-950 text-white py-4 rounded-lg font-black text-xs uppercase tracking-[0.2em] shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-3 group mt-4"
                >
                    Guardar cambios <ShieldAlert size={18} />
                </button>
            </form>
        </div>
      </div>
    </div>
  )
}
