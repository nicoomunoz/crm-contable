'use client'
import { useState, useEffect } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase-browser'

export default function UsuariosOnline({ nombreUsuario }: { nombreUsuario: string }) {
  const [online, setOnline] = useState<string[]>([])

  useEffect(() => {
    const supabase = createBrowserSupabaseClient()

    const channel = supabase.channel('usuarios-online', {
      config: { presence: { key: nombreUsuario } }
    })

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        const usuarios = Object.keys(state).filter(
          nombre => nombre !== 'Administrador' && nombre !== nombreUsuario
        )
        setOnline(usuarios)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ nombre: nombreUsuario, online_at: new Date().toISOString() })
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [nombreUsuario])

  if (online.length === 0) return null

  return (
    <div className="px-4 py-3 border-t border-slate-800">
      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">En línea</p>
      <div className="space-y-1.5">
        {online.map(nombre => (
          <div key={nombre} className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse flex-shrink-0" />
            <span className="text-xs font-semibold text-slate-300 truncate">{nombre}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
