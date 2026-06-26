'use client'
import { useState } from 'react'
import { createTramiteMultiple } from '@/app/actions'

function NuevoTramiteForm({ clientes, usuarios }: { clientes: any[], usuarios: any[] }) {
  const [busqueda, setBusqueda] = useState('')
  const [seleccionados, setSeleccionados] = useState<string[]>([])
  const [asignaciones, setAsignaciones] = useState<Record<string, string>>({})

  const clientesFiltrados = clientes.filter(c =>
    c.razon_social?.toLowerCase().includes(busqueda.toLowerCase())
  )

  function toggleCliente(id: string) {
    setSeleccionados(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  function toggleTodos() {
    if (seleccionados.length === clientesFiltrados.length) {
      setSeleccionados([])
    } else {
      setSeleccionados(clientesFiltrados.map(c => c.id))
    }
  }

  function setAsignacion(clienteId: string, usuario: string) {
    setAsignaciones(prev => ({ ...prev, [clienteId]: usuario }))
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-blue-600 mb-1">Estudio Grimalt</p>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Nuevo Trámite</h1>
        <p className="text-slate-500 text-sm mt-0.5">Podés asignarlo a uno o varios clientes a la vez.</p>
      </div>

      <form action={createTramiteMultiple} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">

        {/* Tipo de trámite */}
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Tipo de Trámite</label>
          <input
            name="tipo_tramite"
            placeholder="Ej: Liquidación IVA, Certificación, Alta AFIP"
            required
            className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 text-sm font-semibold text-slate-700"
          />
        </div>

        {/* Selector de clientes */}
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
            Clientes {seleccionados.length > 0 && <span className="text-blue-500">({seleccionados.length} seleccionados)</span>}
          </label>
          <input
            type="text"
            placeholder="Buscar cliente..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="w-full p-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="border border-slate-200 rounded-xl overflow-hidden max-h-52 overflow-y-auto">
            <div
              className="flex items-center gap-3 px-4 py-2.5 bg-slate-50 border-b border-slate-100 cursor-pointer hover:bg-slate-100 transition"
              onClick={toggleTodos}
            >
              <input
                type="checkbox"
                readOnly
                checked={seleccionados.length === clientesFiltrados.length && clientesFiltrados.length > 0}
                className="w-4 h-4 rounded accent-blue-600"
              />
              <span className="text-xs font-black text-slate-600 uppercase tracking-wide">
                {seleccionados.length === clientesFiltrados.length && clientesFiltrados.length > 0 ? 'Deseleccionar todos' : 'Seleccionar todos'}
              </span>
            </div>
            {clientesFiltrados.map(c => (
              <div
                key={c.id}
                className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-blue-50/40 transition border-b border-slate-50 last:border-0 ${seleccionados.includes(c.id) ? 'bg-blue-50/30' : ''}`}
                onClick={() => toggleCliente(c.id)}
              >
                <input
                  type="checkbox"
                  readOnly
                  checked={seleccionados.includes(c.id)}
                  className="w-4 h-4 rounded accent-blue-600"
                />
                <span className="text-sm font-semibold text-slate-700 flex-1">{c.razon_social}</span>
              </div>
            ))}
            {clientesFiltrados.length === 0 && (
              <div className="px-4 py-6 text-center text-slate-400 text-xs">No hay clientes que coincidan</div>
            )}
          </div>
        </div>

        {/* Asignaciones por cliente */}
        {seleccionados.length > 0 && (
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
              Asignar responsable por cliente
            </label>
            <div className="space-y-2">
              {seleccionados.map(id => {
                const cliente = clientes.find(c => c.id === id)
                return (
                  <div key={id} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 space-y-2">
                    <p className="text-xs font-black text-blue-500 uppercase tracking-wide">{cliente?.razon_social}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {usuarios.map((u: any) => {
                        const asignadosActuales = asignaciones[id] ? asignaciones[id].split(',').map((n: string) => n.trim()) : []
                        const seleccionado = asignadosActuales.includes(u.nombre)
                        return (
                          <button
                            key={u.nombre}
                            type="button"
                            onClick={() => {
                              const actuales = asignaciones[id] ? asignaciones[id].split(',').map((n: string) => n.trim()).filter(Boolean) : []
                              const nuevo = seleccionado
                                ? actuales.filter((n: string) => n !== u.nombre)
                                : [...actuales, u.nombre]
                              setAsignacion(id, nuevo.join(', '))
                            }}
                            className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wide transition border ${
                              seleccionado
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-slate-500 border-slate-200 hover:border-blue-300'
                            }`}
                          >
                            {u.nombre}
                          </button>
                        )
                      })}
                    </div>
                    <input type="hidden" name="cliente_ids" value={id} />
                    <input type="hidden" name={`asignado_${id}`} value={asignaciones[id] || ''} />
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Vencimiento */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Vencimiento</label>
            <input
              name="fecha_vencimiento"
              type="date"
              className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 text-sm"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Estado inicial</label>
            <select disabled className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-100 text-sm text-slate-400 font-semibold">
              <option>Pendiente (por defecto)</option>
            </select>
          </div>
        </div>

        {/* Observaciones */}
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Observaciones</label>
          <textarea
            name="observaciones"
            rows={3}
            className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 text-sm text-slate-700"
            placeholder="Detalles adicionales..."
          />
        </div>

        {seleccionados.length > 1 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
            <p className="text-xs font-black text-blue-700">
              Se crearán {seleccionados.length} trámites — uno por cada cliente seleccionado.
            </p>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={seleccionados.length === 0}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {seleccionados.length === 0 ? 'Elegí al menos un cliente' : `Crear ${seleccionados.length > 1 ? seleccionados.length + ' trámites' : 'trámite'}`}
          </button>
          <a href="/tramites" className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-black text-xs uppercase tracking-widest text-center hover:bg-slate-200 transition">
            Cancelar
          </a>
        </div>
      </form>
    </div>
  )
}

export default NuevoTramiteForm
