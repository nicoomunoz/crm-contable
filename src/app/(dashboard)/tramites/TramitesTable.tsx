'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { updateTramiteStatus, updateTramiteObservacion, deleteTramite } from '@/app/actions'
import { Clock, CheckCircle2, Calendar, MoreHorizontal, Pencil, Trash2, Check, X, Circle } from 'lucide-react'

export default function TramitesTable({ tramites }: { tramites: any[] }) {
  const [menuAbierto, setMenuAbierto] = useState<string | null>(null)
  const [editandoNota, setEditandoNota] = useState<string | null>(null)
  const [notaTemp, setNotaTemp] = useState('')
  const menuRef = useRef<HTMLTableCellElement>(null)

  // Cerrar menú al hacer click afuera
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuAbierto(null)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function iniciarEditNota(t: any) {
    setEditandoNota(t.id)
    setNotaTemp(t.observaciones || '')
  }

  async function guardarNota(id: string) {
    await updateTramiteObservacion(id, notaTemp)
    setEditandoNota(null)
  }

  return (
    <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-2xl">
      <table className="w-full text-left">
        <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest">
          <tr>
            <th className="px-8 py-6">Cliente y Trámite</th>
            <th className="px-8 py-6 text-center italic text-xs uppercase tracking-tighter">Responsable</th>
            <th className="px-8 py-6 uppercase tracking-tighter text-xs">Observaciones</th>
            <th className="px-8 py-6 text-center uppercase tracking-tighter text-xs">Estado</th>
            <th className="px-8 py-6 text-center uppercase text-xs">Cambiar</th>
            <th className="px-8 py-6"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {tramites.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-20 text-slate-400 font-bold uppercase text-xs italic tracking-widest">
                No hay trámites registrados aún
              </td>
            </tr>
          ) : (
            tramites.map((t: any) => (
              <tr key={t.id} className="hover:bg-slate-50/50 transition-all group">

                {/* Cliente y Trámite */}
                <td className="px-8 py-6">
                  <p className="text-blue-600 font-black text-[10px] uppercase mb-1 tracking-tighter leading-none italic">
                    {t.clientes?.razon_social || 'ESTUDIO'}
                  </p>
                  <p className="text-slate-800 font-black text-xl tracking-tighter leading-none mb-1">
                    {t.tipo_tramite || 'S/N'}
                  </p>
                  {t.fecha_vencimiento && (
                    <div className="inline-flex items-center gap-1.5 text-red-500 text-[9px] font-black uppercase tracking-tighter italic border-t border-red-50 mt-1 pt-1">
                      <Calendar size={10} /> Vence: {t.fecha_vencimiento}
                    </div>
                  )}
                </td>

                {/* Responsable */}
                <td className="px-8 py-6">
                  <p className="text-center text-xs font-black text-slate-700 uppercase tracking-tight">
                    {t.creado_por || 'Administrador'}
                  </p>
                </td>

                {/* Observaciones — editable inline */}
                <td className="px-8 py-6 max-w-[220px]">
                  {editandoNota === t.id ? (
                    <div className="flex flex-col gap-2">
                      <textarea
                        className="text-xs text-slate-700 border border-blue-200 rounded-xl p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                        rows={3}
                        value={notaTemp}
                        onChange={e => setNotaTemp(e.target.value)}
                        autoFocus
                      />
                      <div className="flex gap-1">
                        <button
                          onClick={() => guardarNota(t.id)}
                          className="flex items-center gap-1 px-2 py-1 bg-emerald-500 text-white rounded-lg text-[10px] font-black hover:bg-emerald-600 transition"
                        >
                          <Check size={10} /> Guardar
                        </button>
                        <button
                          onClick={() => setEditandoNota(null)}
                          className="flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black hover:bg-slate-200 transition"
                        >
                          <X size={10} /> Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p
                      onClick={() => iniciarEditNota(t)}
                      className="text-xs text-slate-500 cursor-pointer hover:text-slate-800 transition min-h-[32px] italic"
                      title="Click para editar"
                    >
                      {t.observaciones || <span className="text-slate-300">Sin observaciones...</span>}
                    </p>
                  )}
                </td>

                {/* Estado */}
                <td className="px-8 py-6 text-center">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border-2 ${
                    t.estado === 'pendiente' ? 'bg-orange-50 text-orange-500 border-orange-100/50' :
                    t.estado === 'en_proceso' ? 'bg-blue-50 text-blue-500 border-blue-100/50' :
                    'bg-emerald-50 text-emerald-600 border-emerald-100/50'
                  }`}>
                    {t.estado}
                  </span>
                </td>

                {/* Cambiar estado */}
                <td className="px-8 py-6">
                  <div className="flex gap-2 justify-center">
                    <form action={updateTramiteStatus}>
                      <input type="hidden" name="id" value={t.id} />
                      <input type="hidden" name="nuevoEstado" value="en_proceso" />
                      <button className="h-9 w-9 flex items-center justify-center bg-white rounded-xl text-slate-300 hover:text-blue-600 hover:scale-110 border border-slate-100 shadow-sm transition active:scale-90">
                        <Clock size={16} />
                      </button>
                    </form>
                    <form action={updateTramiteStatus}>
                      <input type="hidden" name="id" value={t.id} />
                      <input type="hidden" name="nuevoEstado" value="pendiente" />
                      <button className="h-9 w-9 flex items-center justify-center bg-white rounded-xl text-slate-300 hover:text-orange-400 hover:scale-110 border border-slate-100 shadow-sm transition active:scale-90">
                        <Circle size={16} />
                      </button>
                    </form>
                    <form action={updateTramiteStatus}>
                      <input type="hidden" name="id" value={t.id} />
                      <input type="hidden" name="nuevoEstado" value="finalizado" />
                      <button className="h-9 w-9 flex items-center justify-center bg-white rounded-xl text-slate-300 hover:text-emerald-500 hover:scale-110 border border-slate-100 shadow-sm transition active:scale-90">
                        <CheckCircle2 size={16} />
                      </button>
                    </form>
                  </div>
                </td>

                {/* Menú ⋯ */}
                <td className="px-4 py-6 relative" ref={menuAbierto === t.id ? menuRef : null}>
                  <button
                    onClick={() => setMenuAbierto(menuAbierto === t.id ? null : t.id)}
                    className="h-9 w-9 flex items-center justify-center rounded-xl text-slate-300 hover:text-slate-700 hover:bg-slate-100 transition"
                  >
                    <MoreHorizontal size={18} />
                  </button>

                  {menuAbierto === t.id && (
                    <div className="absolute right-4 top-14 z-50 bg-white border border-slate-100 rounded-2xl shadow-2xl py-2 w-40 overflow-hidden">
                      <Link
                        href={`/tramites/editar?id=${t.id}`}
                        className="flex items-center gap-3 px-4 py-2.5 text-xs font-black text-slate-600 hover:bg-slate-50 transition uppercase tracking-wide"
                        onClick={() => setMenuAbierto(null)}
                      >
                        <Pencil size={13} className="text-blue-400" /> Editar
                      </Link>
                      <form action={deleteTramite}>
                        <input type="hidden" name="id" value={t.id} />
                        <button
                          type="button"
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-black text-red-500 hover:bg-red-50 transition uppercase tracking-wide"
                          onClick={async () => {
                            setMenuAbierto(null)
                            const formData = new FormData()
                            formData.append('id', t.id)
                            await deleteTramite(formData)
                          }}
                        >
                          <Trash2 size={13} /> Borrar
                        </button>
                      </form>
                    </div>
                  )}
                </td>

              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
