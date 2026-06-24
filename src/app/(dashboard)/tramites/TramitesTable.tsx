'use client'
import { useState, useEffect, useRef, useMemo } from 'react'
import Link from 'next/link'
import { updateTramiteStatus, deleteTramite, createComentario } from '@/app/actions'
import { Clock, CheckCircle2, Circle, MoreHorizontal, Pencil, Trash2, MessageSquare, X, Send, AlertTriangle, ChevronDown } from 'lucide-react'

const ESTADOS = ['todos', 'pendiente', 'en_proceso', 'finalizado']

function diasRestantes(fecha: string) {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const vence = new Date(fecha)
  return Math.ceil((vence.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
}

function BadgeVencimiento({ fecha }: { fecha: string }) {
  const dias = diasRestantes(fecha)
  const fechaFormateada = new Date(fecha).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })

  return (
    <div className="flex flex-col items-center gap-1">
      {dias < 0 && <span className="inline-flex items-center gap-1 text-[10px] font-black text-red-500 bg-red-50 px-2 py-0.5 rounded-full"><AlertTriangle size={9} /> Vencido</span>}
      {dias === 0 && <span className="inline-flex items-center gap-1 text-[10px] font-black text-red-500 bg-red-50 px-2 py-0.5 rounded-full"><AlertTriangle size={9} /> Hoy</span>}
      {dias === 1 && <span className="inline-flex items-center gap-1 text-[10px] font-black text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full"><AlertTriangle size={9} /> 1 día</span>}
      {dias > 1 && dias <= 3 && <span className="inline-flex items-center gap-1 text-[10px] font-black text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full"><AlertTriangle size={9} /> {dias} días</span>}
      {dias > 3 && <span className="inline-flex items-center gap-1 text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">{dias} días</span>}
      <span className="text-[10px] text-slate-400 font-medium">{fechaFormateada}</span>
    </div>
  )
}

export default function TramitesTable({ tramites, clientes, comentariosRaw }: { tramites: any[], clientes: any[], comentariosRaw: any[] }) {
  const [menuAbierto, setMenuAbierto] = useState<string | null>(null)
  const [drawerTramite, setDrawerTramite] = useState<any | null>(null)
  const [comentarios, setComentarios] = useState<any[]>([])
  const [nuevoComentario, setNuevoComentario] = useState('')
  const [cargando, setCargando] = useState(false)
  const menuRef = useRef<HTMLTableCellElement>(null)
  const [orden, setOrden] = useState<'vencimiento' | 'creacion'>('vencimiento')

  // Filtros
  const responsables = useMemo(() => ['todos', ...Array.from(new Set(tramites.map(t => t.creado_por).filter(Boolean)))], [tramites])
  const [filtroResponsable, setFiltroResponsable] = useState('todos')
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [busqueda, setBusqueda] = useState('')

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

  // Filtrar y ordenar
  const tramitesFiltrados = useMemo(() => {
    return tramites
      .filter(t => {
        // 1. Filtro de Responsable
        if (filtroResponsable !== 'todos' && t.creado_por !== filtroResponsable) return false
        
        // 2. Filtro de Estado
        if (filtroEstado !== 'todos' && t.estado !== filtroEstado) return false
        
        // 3. BUSCADOR INTELIGENTE (Trámite + Cliente)
        if (busqueda) {
          const query = busqueda.toLowerCase()
          const matchTramite = t.tipo_tramite?.toLowerCase().includes(query)
          
          // Buscamos el nombre del cliente en la lista externa para ver si coincide
          const clie = clientes.find(c => c.id === t.cliente_id)
          const matchCliente = clie?.razon_social?.toLowerCase().includes(query)
          
          // Si no coincide el trámite NI el cliente, lo ocultamos
          if (!matchTramite && !matchCliente) return false
        }
  
        return true
      })
      .sort((a, b) => {
        if (orden === 'creacion') {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        }
        // Por vencimiento: sin fecha van al final
        if (!a.fecha_vencimiento && !b.fecha_vencimiento) return 0
        if (!a.fecha_vencimiento) return 1
        if (!b.fecha_vencimiento) return -1
        return diasRestantes(a.fecha_vencimiento) - diasRestantes(b.fecha_vencimiento)
      })
  }, [tramites, clientes, filtroResponsable, filtroEstado, busqueda, orden])

  const urgentes = tramites.filter(t => t.fecha_vencimiento && diasRestantes(t.fecha_vencimiento) <= 3 && t.estado !== 'finalizado').length

  return (
    <>
      {/* BARRA DE FILTROS */}
      <div className="flex flex-wrap gap-3 items-center">

        {/* Búsqueda */}
        <input
          type="text"
          placeholder="Buscar trámite o cliente..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-slate-700 placeholder:text-slate-300"
        />

        {/* Filtro responsable */}
        <div className="relative">
          <select
            value={filtroResponsable}
            onChange={e => setFiltroResponsable(e.target.value)}
            className="appearance-none pl-4 pr-8 py-2.5 text-sm bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-slate-600 font-semibold cursor-pointer"
          >
            {responsables.map(r => (
              <option key={r} value={r}>{r === 'todos' ? 'Todos los responsables' : r}</option>
            ))}
          </select>
          <ChevronDown size={13} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
        </div>

        {/* Filtro estado */}
        <div className="flex gap-1.5 bg-white border border-slate-200 rounded-2xl p-1">
          {ESTADOS.map(e => (
            <button
              key={e}
              onClick={() => setFiltroEstado(e)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wide transition ${
                filtroEstado === e
                  ? e === 'pendiente' ? 'bg-orange-500 text-white'
                  : e === 'en_proceso' ? 'bg-blue-500 text-white'
                  : e === 'finalizado' ? 'bg-emerald-500 text-white'
                  : 'bg-slate-900 text-white'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {e === 'todos' ? 'Todos' : e.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Badge urgentes */}
        {urgentes > 0 && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 px-4 py-2 rounded-2xl">
            <AlertTriangle size={13} className="text-red-500" />
            <span className="text-red-500 text-[11px] font-black uppercase tracking-wide">{urgentes} urgente{urgentes > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>
      <div className="flex gap-1 bg-white border border-slate-200 rounded-2xl p-1">
        <button
          onClick={() => setOrden('vencimiento')}
          className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wide transition ${orden === 'vencimiento' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Por vencimiento
        </button>
        <button
          onClick={() => setOrden('creacion')}
          className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wide transition ${orden === 'creacion' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Más recientes
        </button>
      </div>

      {/* TABLA */}
      <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead className="border-b-2 border-slate-200">
            <tr className="text-slate-600 text-[10px] font-black uppercase tracking-widest">
              <th className="px-8 py-5">Trámite</th>
              <th className="px-6 py-5 text-center">Responsable</th>
              <th className="px-6 py-5 text-center">Vencimiento</th>
              <th className="px-6 py-5 text-center">Estado</th>
              <th className="px-6 py-5 text-center">Cambiar</th>
              <th className="px-6 py-5 text-center">Notas</th>
              <th className="px-4 py-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {tramitesFiltrados.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-16 text-slate-600 font-bold uppercase text-xs tracking-widest">
                  No hay trámites que coincidan
                </td>
              </tr>
            ) : (
              tramitesFiltrados.map((t: any) => {
                // REEMPLAZÁ LO QUE HAYA AQUÍ ADENTRO POR ESTO:
                const dias = t.fecha_vencimiento ? diasRestantes(t.fecha_vencimiento) : null
                const esUrgente = dias !== null && dias <= 3 && t.estado !== 'finalizado'
                const totalNotas = comentariosRaw.filter((c: any) => c.tramite_id === t.id).length
                
                // ESTA ES LA CLAVE: Buscamos el nombre en la lista de clientes
                const miCliente = clientes.find((c: any) => c.id === t.cliente_id)
                const nombreClienteMostrable = miCliente ? miCliente.razon_social : "CLIENTE"

                return (
                  <tr key={t.id} className={`transition-all group ${esUrgente ? 'bg-red-50/30 hover:bg-red-50/50' : 'hover:bg-slate-50/60'}`}>

                    {/* Trámite */}
                  
                    <td className="px-8 py-5">
                      <p className="text-blue-500 font-black text-[10px] uppercase tracking-wider mb-0.5">
                        {nombreClienteMostrable} {/* <-- CAMBIAMOS t.clientes... por esta variable */}
                      </p>
                      <p className="text-slate-800 font-black text-base tracking-tight leading-snug">
                        {t.tipo_tramite}
                      </p>
                    </td>

                    {/* Responsable */}
                    <td className="px-6 py-5 text-center">
                      <span className="inline-block bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-wide px-3 py-1 rounded-full">
                        {t.creado_por || 'Admin'}
                      </span>
                    </td>

                    {/* Vencimiento */}
                    <td className="px-6 py-5 text-center">
                      {t.fecha_vencimiento ? <BadgeVencimiento fecha={t.fecha_vencimiento} /> : <span className="text-slate-200 text-xs">—</span>}
                    </td>

                    {/* Estado */}
                    <td className="px-6 py-5 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wide ${
                        t.estado === 'pendiente' ? 'bg-orange-50 text-orange-500' :
                        t.estado === 'en_proceso' ? 'bg-blue-50 text-blue-500' :
                        'bg-emerald-50 text-emerald-600'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          t.estado === 'pendiente' ? 'bg-orange-400' :
                          t.estado === 'en_proceso' ? 'bg-blue-400' :
                          'bg-emerald-400'
                        }`} />
                        {t.estado.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Cambiar estado */}
                    <td className="px-6 py-5">
                      <div className="flex gap-1 justify-center">
                        <form action={updateTramiteStatus}>
                          <input type="hidden" name="id" value={t.id} />
                          <input type="hidden" name="nuevoEstado" value="pendiente" />
                          <button title="Marcar pendiente" className="h-8 w-8 flex items-center justify-center rounded-xl text-slate-500 hover:text-orange-400 hover:bg-orange-50 transition">
                            <Circle size={14} />
                          </button>
                        </form>
                        <form action={updateTramiteStatus}>
                          <input type="hidden" name="id" value={t.id} />
                          <input type="hidden" name="nuevoEstado" value="en_proceso" />
                          <button title="Marcar en proceso" className="h-8 w-8 flex items-center justify-center rounded-xl text-slate-500 hover:text-blue-500 hover:bg-blue-50 transition">
                            <Clock size={14} />
                          </button>
                        </form>
                        <form action={updateTramiteStatus}>
                          <input type="hidden" name="id" value={t.id} />
                          <input type="hidden" name="nuevoEstado" value="finalizado" />
                          <button title="Marcar finalizado" className="h-8 w-8 flex items-center justify-center rounded-xl text-slate-500 hover:text-emerald-500 hover:bg-emerald-50 transition">
                            <CheckCircle2 size={14} />
                          </button>
                        </form>
                      </div>
                    </td>

                    {/* Notas */}
                    <td className="px-6 py-5 text-center">
                      <button
                        onClick={() => abrirDrawer(t)}
                        className="group relative flex items-center justify-center h-10 w-16 mx-auto bg-slate-50 border-2 border-slate-100 rounded-xl hover:bg-white hover:border-blue-600 transition-all shadow-sm active:scale-95"
                        title="Ver notas"
                      >
                        <MessageSquare 
                          size={18} 
                          className={totalNotas > 0 ? "text-blue-500" : "text-slate-300"} 
                        />
                        
                        {/* EL GLOBITO AZUL NITIDO */}
                        {totalNotas > 0 && (
                          <span className="absolute -top-2 -right-1 bg-blue-600 text-white text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-lg antialiased tabular-nums leading-none ring-1 ring-blue-600/10">
                            {totalNotas}
                          </span>
                        )}
                      </button>
                    </td>

                    {/* Menú ⋯ */}
                    <td className="px-4 py-5 relative" ref={menuAbierto === t.id ? menuRef : null}>
                      <button
                        onClick={() => setMenuAbierto(menuAbierto === t.id ? null : t.id)}
                        className="h-8 w-8 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-600 hover:bg-slate-100 transition"
                      >
                        <MoreHorizontal size={15} />
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
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-black text-red-400 hover:bg-red-50 transition uppercase"
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
                )
              })
            )}
          </tbody>
        </table>

        {/* Footer con conteo */}
        <div className="px-8 py-4 border-t border-slate-50 flex items-center justify-between">
          <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">
            {tramitesFiltrados.length} trámite{tramitesFiltrados.length !== 1 ? 's' : ''}
            {tramitesFiltrados.length !== tramites.length && ` de ${tramites.length}`}
          </p>
          {(filtroResponsable !== 'todos' || filtroEstado !== 'todos' || busqueda) && (
            <button
              onClick={() => { setFiltroResponsable('todos'); setFiltroEstado('todos'); setBusqueda('') }}
              className="text-[10px] text-blue-400 font-black uppercase tracking-wide hover:text-blue-600 transition"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* OVERLAY */}
      {drawerTramite && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={cerrarDrawer} />
      )}

      {/* DRAWER */}
      <div className={`fixed top-0 right-0 h-full w-[420px] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${drawerTramite ? 'translate-x-0' : 'translate-x-full'}`}>
        {drawerTramite && (
          <>
            <div className="px-8 py-6 border-b border-slate-100 flex items-start justify-between">
              <div>
                <p className="text-blue-500 font-black text-[10px] uppercase tracking-wider mb-0.5">
                  {drawerTramite.clientes?.razon_social || 'ESTUDIO'}
                </p>
                <h2 className="text-slate-800 font-black text-xl tracking-tight">
                  {drawerTramite.tipo_tramite}
                </h2>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                    drawerTramite.estado === 'pendiente' ? 'bg-orange-50 text-orange-500' :
                    drawerTramite.estado === 'en_proceso' ? 'bg-blue-50 text-blue-500' :
                    'bg-emerald-50 text-emerald-600'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      drawerTramite.estado === 'pendiente' ? 'bg-orange-400' :
                      drawerTramite.estado === 'en_proceso' ? 'bg-blue-400' : 'bg-emerald-400'
                    }`} />
                    {drawerTramite.estado.replace('_', ' ')}
                  </span>
                  <p className="text-slate-400 text-[10px] font-bold uppercase">por {drawerTramite.creado_por}</p>
                </div>
              </div>
              <button onClick={cerrarDrawer} className="h-8 w-8 flex items-center justify-center rounded-xl text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition">
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-3">
              {cargando ? (
                <p className="text-slate-300 text-xs italic text-center pt-8">Cargando...</p>
              ) : comentarios.length === 0 ? (
                <div className="text-center py-16">
                  <MessageSquare size={28} className="text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-300 text-xs font-bold uppercase tracking-widest">Sin notas aún</p>
                  <p className="text-slate-300 text-[10px] mt-1">Escribí el primer comentario abajo</p>
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

            <div className="px-8 py-6 border-t border-slate-100">
              <form action={createComentario} onSubmit={() => setNuevoComentario('')}>
                <input type="hidden" name="tramite_id" value={drawerTramite.id} />
                <div className="flex gap-3 items-end">
                  <textarea
                    name="contenido"
                    rows={3}
                    value={nuevoComentario}
                    onChange={e => setNuevoComentario(e.target.value)}
                    placeholder="Escribir nota o novedad..."
                    className="flex-1 text-sm border border-slate-200 rounded-2xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 text-slate-700 placeholder:text-slate-300"
                  />
                  <button
                    type="submit"
                    className="h-12 w-12 flex items-center justify-center bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition active:scale-95 shadow-lg flex-shrink-0"
                  >
                    <Send size={15} />
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
