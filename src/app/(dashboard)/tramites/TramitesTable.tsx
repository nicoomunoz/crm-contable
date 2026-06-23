'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { updateTramiteStatus, deleteTramite, createComentario } from '@/app/actions'
import { Clock, CheckCircle2, Circle, MoreHorizontal, Pencil, Trash2, MessageSquare, X, Send } from 'lucide-react'

export default function TramitesTable({ tramites }: { tramites: any[] }) {
  const [menuAbierto, setMenuAbierto] = useState<string | null>(null)
  const [drawerTramite, setDrawerTramite] = useState<any | null>(null)
  const [comentarios, setComentarios] = useState<any[]>([])
  const [nuevoComentario, setNuevoComentario] = useState('')
  const [cargando, setCargando] = useState(false)
  const menuRef = useRef<HTMLTableCellElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuAbierto(null)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function abrirDrawer(t: any) {
    setDrawerTramite(t)
    setCargando(true)
    const res = await fetch(`/api/comentarios?tramite_id=${t.id}`)
    const data = await res.json()
    setComentarios(data)
    setCargando(false)
  }

  function cerrarDrawer() {
    setDrawerTramite(null)
    setComentarios([])
    setNuevoComentario('')
  }

  return (
    <>
      {/* TABLA */}
      <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead className="border-b border-slate-100">
            <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <th className="px-8 py-5">Trámite</th>
              <th className="px-6 py-5 text-center">Responsable</th>
              <th className="px-6 py-5 text-center">Estado</th>
              <th className="px-6 py-5 text-center">Cambiar Estado</th>
              <th className="px-6 py-5 text-center">Notas</th>
              <th className="px-4 py-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {tramites.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-20 text-slate-300 font-bold uppercase text-xs tracking-widest">
                  No hay trámites registrados aún
                </td>
              </tr>
            ) : (
              tramites.map((t: any) => (
                <tr key={t.id} className="hover:bg-slate-50/40 transition-all">

                  {/* Trámite */}
                  <td className="px-8 py-5">
                    <p className="text-blue-500 font-black text-[10px] uppercase tracking-wider mb-0.5">
                      {t.clientes?.razon_social || 'ESTUDIO'}
                    </p>
                    <p className="text-slate-800 font-black text-lg tracking-tight leading-none">
                      {t.tipo_tramite || 'S/N'}
                    </p>
                    {t.fecha_vencimiento && (
                      <p className="text-red-400 text-[10px] font-bold mt-1">
                        Vence: {t.fecha_vencimiento}
                      </p>
                    )}
                  </td>

                  {/* Responsable */}
                  <td className="px-6 py-5">
                    <p className="text-center text-xs font-black text-slate-600 uppercase tracking-tight">
                      {t.creado_por || 'Admin'}
                    </p>
                  </td>

                  {/* Estado */}
                  <td className="px-6 py-5 text-center">
                    <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      t.estado === 'pendiente' ? 'bg-orange-50 text-orange-500' :
                      t.estado === 'en_proceso' ? 'bg-blue-50 text-blue-500' :
                      'bg-emerald-50 text-emerald-600'
                    }`}>
                      {t.estado}
                    </span>
                  </td>

                  {/* Cambiar estado */}
                  <td className="px-6 py-5">
                    <div className="flex gap-1.5 justify-center">
                      <form action={updateTramiteStatus}>
                        <input type="hidden" name="id" value={t.id} />
                        <input type="hidden" name="nuevoEstado" value="pendiente" />
                        <button title="Pendiente" className="h-8 w-8 flex items-center justify-center rounded-xl text-slate-300 hover:text-orange-400 hover:bg-orange-50 transition">
                          <Circle size={15} />
                        </button>
                      </form>
                      <form action={updateTramiteStatus}>
                        <input type="hidden" name="id" value={t.id} />
                        <input type="hidden" name="nuevoEstado" value="en_proceso" />
                        <button title="En proceso" className="h-8 w-8 flex items-center justify-center rounded-xl text-slate-300 hover:text-blue-500 hover:bg-blue-50 transition">
                          <Clock size={15} />
                        </button>
                      </form>
                      <form action={updateTramiteStatus}>
                        <input type="hidden" name="id" value={t.id} />
                        <input type="hidden" name="nuevoEstado" value="finalizado" />
                        <button title="Finalizado" className="h-8 w-8 flex items-center justify-center rounded-xl text-slate-300 hover:text-emerald-500 hover:bg-emerald-50 transition">
                          <CheckCircle2 size={15} />
                        </button>
                      </form>
                    </div>
                  </td>

                  {/* Notas */}
                  <td className="px-6 py-5 text-center">
                    <button
                      onClick={() => abrirDrawer(t)}
                      className="h-8 w-8 mx-auto flex items-center justify-center rounded-xl text-slate-300 hover:text-blue-500 hover:bg-blue-50 transition"
                      title="Ver comentarios"
                    >
                      <MessageSquare size={15} />
                    </button>
                  </td>

                  {/* Menú ⋯ */}
                  <td className="px-4 py-5 relative" ref={menuAbierto === t.id ? menuRef : null}>
                    <button
                      onClick={() => setMenuAbierto(menuAbierto === t.id ? null : t.id)}
                      className="h-8 w-8 flex items-center justify-center rounded-xl text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                    {menuAbierto === t.id && (
                      <div className="absolute right-4 top-12 z-50 bg-white border border-slate-100 rounded-2xl shadow-2xl py-2 w-36 overflow-hidden">
                        <Link
                          href={`/tramites/editar?id=${t.id}`}
                          className="flex items-center gap-3 px-4 py-2.5 text-xs font-black text-slate-600 hover:bg-slate-50 transition uppercase"
                          onClick={() => setMenuAbierto(null)}
                        >
                          <Pencil size={12} className="text-blue-400" /> Editar
                        </Link>
                        <button
                          type="button"
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-black text-red-500 hover:bg-red-50 transition uppercase"
                          onClick={async () => {
                            setMenuAbierto(null)
                            const formData = new FormData()
                            formData.append('id', t.id)
                            await deleteTramite(formData)
                          }}
                        >
                          <Trash2 size={12} /> Borrar
                        </button>
                      </div>
                    )}
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* OVERLAY */}
      {drawerTramite && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={cerrarDrawer}
        />
      )}

      {/* DRAWER */}
      <div className={`fixed top-0 right-0 h-full w-[420px] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${drawerTramite ? 'translate-x-0' : 'translate-x-full'}`}>
        {drawerTramite && (
          <>
            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-100 flex items-start justify-between">
              <div>
                <p className="text-blue-500 font-black text-[10px] uppercase tracking-wider mb-0.5">
                  {drawerTramite.clientes?.razon_social || 'ESTUDIO'}
                </p>
                <h2 className="text-slate-800 font-black text-xl tracking-tight">
                  {drawerTramite.tipo_tramite}
                </h2>
                <p className="text-slate-400 text-[10px] uppercase font-bold mt-1">
                  Creado por {drawerTramite.creado_por}
                </p>
              </div>
              <button onClick={cerrarDrawer} className="h-8 w-8 flex items-center justify-center rounded-xl text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition">
                <X size={16} />
              </button>
            </div>

            {/* Comentarios */}
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
              {cargando ? (
                <p className="text-slate-300 text-xs italic">Cargando...</p>
              ) : comentarios.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare size={32} className="text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-300 text-xs font-bold uppercase tracking-widest">Sin comentarios aún</p>
                </div>
              ) : (
                comentarios.map((c: any) => (
                  <div key={c.id} className="bg-slate-50 rounded-2xl px-5 py-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] font-black text-blue-500 uppercase tracking-wide">{c.autor}</p>
                      <p className="text-[9px] text-slate-300">{new Date(c.created_at).toLocaleString('es-AR')}</p>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{c.contenido}</p>
                  </div>
                ))
              )}
            </div>

            {/* Input nuevo comentario */}
            <div className="px-8 py-6 border-t border-slate-100">
              <form
                action={createComentario}
                onSubmit={() => setNuevoComentario('')}
              >
                <input type="hidden" name="tramite_id" value={drawerTramite.id} />
                <div className="flex gap-3 items-end">
                  <textarea
                    name="contenido"
                    rows={3}
                    value={nuevoComentario}
                    onChange={e => setNuevoComentario(e.target.value)}
                    placeholder="Escribir comentario..."
                    className="flex-1 text-sm border border-slate-200 rounded-2xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 text-slate-700"
                  />
                  <button
                    type="submit"
                    className="h-12 w-12 flex items-center justify-center bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition active:scale-95 shadow-lg"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </>
  )
}
