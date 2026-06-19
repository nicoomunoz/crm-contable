import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { updateTramiteStatus } from '@/app/actions'
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react'

// FUNCIÓN AUXILIAR PARA EMBELLECER LOS NOMBRES DEL EQUIPO
const limpiarNombre = (texto?: string) => {
  if (!texto) return 'Sin Asignar'
  // Si es un email, toma solo lo que está antes del @
  const nombre = texto.includes('@') ? texto.split('@')[0].replace('.', ' ') : texto
  // Convierte la primera letra en Mayúscula (ej. "valentina" -> "Valentina")
  return nombre.charAt(0).toUpperCase() + nombre.slice(1)
}

export default async function TramitesPage() {
  const supabase = createClient()
  const { data: tramites } = await supabase
    .from('tramites')
    .select('*, clientes(razon_social)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Trámites</h1>
          <p className="text-slate-500">Gestión del flujo de trabajo del estudio.</p>
        </div>
        <Link 
          href="/tramites/nuevo" 
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-2 text-sm"
        >
          + Iniciar Trámite
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl shadow-slate-100">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
              <th className="px-6 py-5">Cliente</th>
              <th className="px-6 py-5">Trámite</th>
              <th className="px-6 py-5">Responsable</th>
              <th className="px-6 py-5">Estado</th>
              <th className="px-6 py-5 text-center">Acción Rápida</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {tramites?.map((t: any) => {
              const nombreLimpio = limpiarNombre(t.creado_por)
              const inicial = nombreLimpio.charAt(0).toUpperCase()

              return (
                <tr key={t.id} className="hover:bg-slate-50/80 transition duration-150">
                  {/* COLUMNA CLIENTE */}
                  <td className="px-6 py-5">
                    <p className="font-bold text-slate-800 text-sm">{t.clientes?.razon_social || 'Cliente eliminado'}</p>
                  </td>
                  
                  {/* COLUMNA TIPO TRÁMITE */}
                  <td className="px-6 py-5">
                    <p className="text-slate-700 font-medium text-sm">{t.tipo_tramite}</p>
                    {t.fecha_vencimiento && (
                      <span className="inline-block px-2 py-0.5 bg-red-50 text-red-600 rounded text-[10px] font-bold uppercase tracking-wider mt-1 border border-red-100">
                        Vence: {new Date(t.fecha_vencimiento).toLocaleDateString()}
                      </span>
                    )}
                  </td>
                  
                  {/* COLUMNA RESPONSABLE (CLAUDIO, VALE, GIULI...) */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-900 flex items-center justify-center text-xs font-black text-white shadow-sm">
                        {inicial}
                      </div>
                      <span className="text-sm font-bold text-slate-700">
                        {nombreLimpio}
                      </span>
                    </div>
                  </td>
                  
                  {/* COLUMNA ESTADO */}
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                      t.estado === 'pendiente' ? 'bg-orange-50 text-orange-600 border-orange-200' : 
                      t.estado === 'en_proceso' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                      t.estado === 'vencido' ? 'bg-red-50 text-red-600 border-red-200' :
                      'bg-emerald-50 text-emerald-600 border-emerald-200'
                    }`}>
                      {t.estado.replace('_', ' ')}
                    </span>
                  </td>
                  
                  {/* COLUMNA BOTONES DE CAMBIO DE ESTADO */}
                  <td className="px-6 py-5">
                    <form className="flex justify-center gap-1.5">
                      <button 
                        formAction={async () => { 'use server'; await updateTramiteStatus(t.id, 'en_proceso') }} 
                        title="Marcar En Proceso" 
                        className="p-1.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-lg text-slate-400 hover:text-blue-600 transition"
                      >
                        <Clock size={16} />
                      </button>
                      <button 
                        formAction={async () => { 'use server'; await updateTramiteStatus(t.id, 'finalizado') }} 
                        title="Marcar Finalizado" 
                        className="p-1.5 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 rounded-lg text-slate-400 hover:text-emerald-600 transition"
                      >
                        <CheckCircle2 size={16} />
                      </button>
                      <button 
                        formAction={async () => { 'use server'; await updateTramiteStatus(t.id, 'vencido') }} 
                        title="Marcar Vencido" 
                        className="p-1.5 bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-lg text-slate-400 hover:text-red-600 transition"
                      >
                        <AlertCircle size={16} />
                      </button>
                    </form>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
