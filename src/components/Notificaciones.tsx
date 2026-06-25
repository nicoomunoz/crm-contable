'use client'
import { useState, useEffect } from 'react'
import { Bell, X, CheckCheck } from 'lucide-react'
import { marcarNotificacionLeida } from '@/app/actions'
import { createBrowserSupabaseClient } from '@/lib/supabase-browser'

export default function Notificaciones({ notificaciones: iniciales, nombreUsuario }: { 
  notificaciones: any[],
  nombreUsuario: string 
}) {
  const [abierto, setAbierto] = useState(false)
  const [notificaciones, setNotificaciones] = useState<any[]>([])
  const [montado, setMontado] = useState(false)

  useEffect(() => {
    setNotificaciones(iniciales)
    setMontado(true)
  
    const supabase = createBrowserSupabaseClient()
  
    // Realtime
    const channel = supabase
      .channel(`notif-${nombreUsuario}-${Math.random().toString(36).slice(2)}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notificaciones',
        },
        (payload: any) => {
          if (payload.new.para_usuario === nombreUsuario) {
            setNotificaciones(prev => [payload.new, ...prev])
          }
        }
      )
      .subscribe()
  
    // Polling cada 15 segundos como fallback
    const interval = setInterval(async () => {
      const { data } = await supabase
        .from('notificaciones')
        .select('*')
        .eq('para_usuario', nombreUsuario)
        .order('created_at', { ascending: false })
        .limit(20)
      if (data) setNotificaciones(data)
    }, 15000)
  
    return () => {
      supabase.removeChannel(channel)
      clearInterval(interval)
    }
  }, [])

  const noLeidas = notificaciones.filter(n => !n.leida).length

  if (!montado) return (
    <div className="w-9 h-9 flex items-center justify-center">
      <Bell size={18} className="text-slate-400" />
    </div>
  )

  return (
    <div className="relative">
      <button
        onClick={() => setAbierto(!abierto)}
        className="relative flex items-center justify-center w-9 h-9 rounded-xl hover:bg-slate-800 transition"
      >
        <Bell size={18} className="text-slate-400" />
        {noLeidas > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
            {noLeidas}
          </span>
        )}
      </button>

      {abierto && (
        <>
          <div className="fixed inset-0 z-[9998]" onClick={() => setAbierto(false)} />
          <div className="fixed bottom-16 left-64 z-[9999] w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <p className="text-xs font-black text-slate-700 uppercase tracking-wide">Notificaciones</p>
              <button onClick={() => setAbierto(false)} className="text-slate-400 hover:text-slate-600">
                <X size={14} />
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
              {notificaciones.length === 0 ? (
                <div className="py-8 text-center">
                  <CheckCheck size={20} className="text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-400 font-bold">Sin notificaciones</p>
                </div>
              ) : (
                notificaciones.map((n: any) => (
                  <div key={n.id} className={`px-4 py-3 ${!n.leida ? 'bg-blue-50/40' : ''}`}>
                    <p className="text-xs text-slate-700 font-semibold leading-snug">{n.mensaje}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <p className="text-[10px] text-slate-400">
                        {new Date(n.created_at).toLocaleString('es-AR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {!n.leida && (
                        <button
                          onClick={async () => {
                            const formData = new FormData()
                            formData.append('id', n.id)
                            await marcarNotificacionLeida(formData)
                            setNotificaciones(prev =>
                              prev.map(notif => notif.id === n.id ? { ...notif, leida: true } : notif)
                            )
                          }}
                          className="text-[10px] font-black text-blue-500 hover:text-blue-700 uppercase tracking-wide"
                        >
                          Marcar leída
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
