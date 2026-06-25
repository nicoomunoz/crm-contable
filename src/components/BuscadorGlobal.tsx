'use client'
import { useState, useEffect, useRef } from 'react'
import { Search, X, Users, Briefcase, MessageSquare, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function BuscadorGlobal() {
  const [abierto, setAbierto] = useState(false)
  const [query, setQuery] = useState('')
  const [resultados, setResultados] = useState<any>({ clientes: [], tramites: [], comentarios: [] })
  const [cargando, setCargando] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Atajo de teclado Ctrl+K
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setAbierto(true)
      }
      if (e.key === 'Escape') setAbierto(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  // Foco al abrir
  useEffect(() => {
    if (abierto) setTimeout(() => inputRef.current?.focus(), 50)
    else { setQuery(''); setResultados({ clientes: [], tramites: [], comentarios: [] }) }
  }, [abierto])

  // Buscar con debounce
  useEffect(() => {
    if (query.length < 2) {
      setResultados({ clientes: [], tramites: [], comentarios: [] })
      return
    }
    const timer = setTimeout(async () => {
      setCargando(true)
      const res = await fetch(`/api/buscar?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      setResultados(data)
      setCargando(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  const total = resultados.clientes.length + resultados.tramites.length + resultados.comentarios.length

  function irA(path: string) {
    router.push(path)
    setAbierto(false)
  }

  function estadoBadge(estado: string) {
    if (estado === 'pendiente') return 'bg-orange-50 text-orange-500'
    if (estado === 'en_proceso') return 'bg-blue-50 text-blue-500'
    return 'bg-emerald-50 text-emerald-600'
  }

  if (!abierto) return (
    <button
      onClick={() => setAbierto(true)}
      className="flex items-center gap-2 w-full px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition text-slate-400 hover:text-white text-sm"
    >
      <Search size={15} />
      <span className="flex-1 text-left text-xs">Buscar...</span>
      <span className="text-[10px] bg-slate-700 px-1.5 py-0.5 rounded hidden md:block">Ctrl+K</span>
    </button>
  )

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[99]" onClick={() => setAbierto(false)} />

      {/* Modal */}
      <div className="fixed top-4 left-4 right-4 md:top-20 md:left-1/2 md:-translate-x-1/2 md:w-[560px] z-[100] bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
          {cargando ? <Loader2 size={18} className="text-blue-500 animate-spin flex-shrink-0" /> : <Search size={18} className="text-slate-400 flex-shrink-0" />}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar clientes, trámites, comentarios..."
            className="flex-1 text-sm text-slate-700 outline-none placeholder:text-slate-300"
          />
          <button onClick={() => setAbierto(false)} className="text-slate-300 hover:text-slate-600 transition flex-shrink-0">
            <X size={16} />
          </button>
        </div>

        {/* Resultados */}
        <div className="max-h-[60vh] overflow-y-auto">
          {query.length < 2 ? (
            <div className="py-10 text-center">
              <Search size={24} className="text-slate-200 mx-auto mb-2" />
              <p className="text-slate-400 text-sm font-bold">Escribí al menos 2 caracteres</p>
            </div>
          ) : cargando ? (
            <div className="py-10 text-center">
              <p className="text-slate-400 text-sm">Buscando...</p>
            </div>
          ) : total === 0 ? (
            <div className="py-10 text-center">
              <p className="text-slate-400 text-sm font-bold">Sin resultados para "{query}"</p>
            </div>
          ) : (
            <div className="py-2">

              {/* Clientes */}
              {resultados.clientes.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 px-4 py-2">
                    <Users size={12} className="text-slate-400" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clientes</p>
                  </div>
                  {resultados.clientes.map((c: any) => (
                    <button
                      key={c.id}
                      onClick={() => irA(`/clientes?q=${encodeURIComponent(c.razon_social)}`)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition text-left"
                    >
                      <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center text-[11px] font-black flex-shrink-0">
                        {c.razon_social?.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate">{c.razon_social}</p>
                        {c.cuit && <p className="text-[11px] text-slate-400 font-mono">{c.cuit}</p>}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Trámites */}
              {resultados.tramites.length > 0 && (
                <div className={resultados.clientes.length > 0 ? 'border-t border-slate-50 mt-1 pt-1' : ''}>
                  <div className="flex items-center gap-2 px-4 py-2">
                    <Briefcase size={12} className="text-slate-400" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trámites</p>
                  </div>
                  {resultados.tramites.map((t: any) => (
                    <button
                      key={t.id}
                      onClick={() => irA(`/tramites?q=${encodeURIComponent(t.tipo_tramite)}`)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition text-left"
                    >
                      <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <Briefcase size={14} className="text-slate-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-wide truncate">{t.razon_social}</p>
                        <p className="text-sm font-bold text-slate-800 truncate">{t.tipo_tramite}</p>
                      </div>
                      <span className={`text-[10px] font-black px-2 py-1 rounded-full flex-shrink-0 ${estadoBadge(t.estado)}`}>
                        {t.estado.replace('_', ' ')}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Comentarios */}
              {resultados.comentarios.length > 0 && (
                <div className={(resultados.clientes.length > 0 || resultados.tramites.length > 0) ? 'border-t border-slate-50 mt-1 pt-1' : ''}>
                  <div className="flex items-center gap-2 px-4 py-2">
                    <MessageSquare size={12} className="text-slate-400" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Comentarios</p>
                  </div>
                  {resultados.comentarios.map((c: any) => (
                    <button
                      key={c.id}
                      onClick={() => irA(`/tramites?q=${encodeURIComponent(c.tipo_tramite || '')}`)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition text-left"
                    >
                      <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <MessageSquare size={14} className="text-slate-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-[10px] font-black text-blue-500 uppercase truncate">{c.razon_social}</p>
                          <span className="text-slate-300 text-[10px]">·</span>
                          <p className="text-[10px] text-slate-400 truncate">{c.tipo_tramite}</p>
                        </div>
                        <p className="text-sm text-slate-600 truncate">{c.contenido}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{c.autor}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

            </div>
          )}
        </div>

        {/* Footer */}
        {total > 0 && (
          <div className="px-4 py-2 border-t border-slate-100 flex items-center justify-between">
            <p className="text-[10px] text-slate-400 font-bold">{total} resultado{total !== 1 ? 's' : ''}</p>
            <p className="text-[10px] text-slate-300 hidden md:block">ESC para cerrar</p>
          </div>
        )}
      </div>
    </>
  )
}
