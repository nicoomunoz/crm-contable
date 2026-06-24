export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase'
import { Clock, FilePlus, Pencil, Trash2, MessageSquare, RefreshCw } from 'lucide-react'

const ACCIONES: Record<string, { label: string, color: string, bg: string, icon: any }> = {
  CREACION:   { label: 'Creación',    color: 'text-blue-600',    bg: 'bg-blue-50',    icon: FilePlus },
  EDICION:    { label: 'Edición',     color: 'text-slate-600',   bg: 'bg-slate-100',  icon: Pencil },
  ESTADO:     { label: 'Estado',      color: 'text-orange-500',  bg: 'bg-orange-50',  icon: RefreshCw },
  ELIMINACION:{ label: 'Eliminación', color: 'text-red-500',     bg: 'bg-red-50',     icon: Trash2 },
  COMENTARIO: { label: 'Comentario',  color: 'text-emerald-600', bg: 'bg-emerald-50', icon: MessageSquare },
  NOTA:       { label: 'Nota',        color: 'text-purple-600',  bg: 'bg-purple-50',  icon: Pencil },
}

export default async function HistorialPage() {
  const supabase = createClient()

  const { data: logs } = await supabase
    .from('auditoria')
    .select('id, usuario, accion, detalle, created_at')
    .order('created_at', { ascending: false })
    .limit(100)

  const registros = logs || []

  // Agrupar por fecha
  const agrupados: Record<string, typeof registros> = {}
  for (const log of registros) {
    const fecha = new Date(log.created_at).toLocaleDateString('es-AR', {
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      timeZone: 'America/Argentina/Buenos_Aires' // <-- AGREGÁ ESTO
    })
    if (!agrupados[fecha]) agrupados[fecha] = []
    agrupados[fecha].push(log)
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-blue-600 mb-1">Estudio Grimalt</p>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Historial</h1>
          <p className="text-slate-500 text-sm mt-0.5 font-medium">Últimos {registros.length} movimientos del sistema</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm">
          <Clock size={14} className="text-slate-400" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Tiempo real</span>
        </div>
      </div>

      {/* Leyenda */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(ACCIONES).map(([key, val]) => (
          <span key={key} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${val.bg} ${val.color}`}>
            <val.icon size={10} />
            {val.label}
          </span>
        ))}
      </div>

      {/* Logs agrupados */}
      {registros.length === 0 ? (
        <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm py-20 text-center">
          <Clock size={28} className="text-slate-200 mx-auto mb-3" />
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Sin movimientos registrados</p>
        </div>
      ) : (
        Object.entries(agrupados).map(([fecha, items]) => (
          <div key={fecha} className="space-y-3">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 capitalize">{fecha}</p>
            <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="divide-y divide-slate-50">
                {items.map((log: any) => {
                  const config = ACCIONES[log.accion] || ACCIONES['EDICION']
                  const Icon = config.icon
                  const hora = new Date(log.created_at).toLocaleTimeString('es-AR', {
                    hour: '2-digit', 
                    minute: '2-digit',
                    timeZone: 'America/Argentina/Buenos_Aires' // <-- AGREGÁ ESTO
                  })
                  return (
                    <div key={log.id} className="flex items-center gap-5 px-7 py-4 hover:bg-slate-50/60 transition">

                      {/* Ícono acción */}
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${config.bg}`}>
                        <Icon size={15} className={config.color} />
                      </div>

                      {/* Detalle */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 leading-tight">{log.detalle}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-[10px] font-black uppercase tracking-wide ${config.color}`}>
                            {config.label}
                          </span>
                          <span className="text-slate-300 text-[10px]">·</span>
                          <span className="text-[11px] font-bold text-slate-500">{log.usuario}</span>
                        </div>
                      </div>

                      {/* Hora */}
                      <div className="flex-shrink-0 text-right">
                        <span className="text-xs font-bold text-slate-400 tabular-nums">{hora}</span>
                      </div>

                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
