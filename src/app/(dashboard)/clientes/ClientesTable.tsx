'use client'
import { useState, useRef, useEffect } from 'react'
import { MoreHorizontal, Pencil, Trash2, Building2, Mail, Phone, MapPin, X } from 'lucide-react'
import Link from 'next/link'
import { deleteCliente } from '@/app/actions'

export default function ClientesTable({ clientes }: { clientes: any[] }) {
  const [menuAbierto, setMenuAbierto] = useState<string | null>(null)
  const [busqueda, setBusqueda] = useState('')
  const [fichaCliente, setFichaCliente] = useState<any | null>(null)
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

  const clientesFiltrados = clientes.filter(c =>
    c.razon_social?.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.cuit?.includes(busqueda) ||
    c.email?.toLowerCase().includes(busqueda.toLowerCase())
  )

  function iniciales(nombre: string) {
    return nombre?.split(' ').slice(0, 2).map((n: string) => n[0]).join('').toUpperCase() || '?'
  }

  return (
    <>
      {/* Buscador */}
      <input
        type="text"
        placeholder="Buscar por nombre, CUIT o email..."
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
        className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-slate-700 placeholder:text-slate-300 shadow-sm"
      />

      {/* Tabla */}
      <div className="bg-white border border-slate-100 rounded-[1.5rem] overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="border-b border-slate-100">
            <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <th className="px-8 py-5">Cliente</th>
              <th className="px-6 py-5">CUIT</th>
              <th className="px-6 py-5">Email</th>
              <th className="px-6 py-5">Teléfono</th>
              <th className="px-4 py-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {clientesFiltrados.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-16 text-slate-300 text-xs font-bold uppercase tracking-widest">
                  No hay clientes que coincidan
                </td>
              </tr>
            ) : (
              clientesFiltrados.map((c: any) => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition group">

                  {/* Nombre */}
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center text-[11px] font-black flex-shrink-0">
                        {iniciales(c.razon_social)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm leading-tight">{c.razon_social}</p>
                        {c.direccion && <p className="text-[10px] text-slate-400 mt-0.5">{c.direccion}</p>}
                      </div>
                    </div>
                  </td>

                  {/* CUIT */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-500 font-mono">{c.cuit || '—'}</span>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-500">{c.email || '—'}</span>
                  </td>

                  {/* Teléfono */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-500">{c.telefono || '—'}</span>
                  </td>

                  {/* Menú ⋯ */}
                  <td className="px-4 py-4 relative" ref={menuAbierto === c.id ? menuRef : null}>
                    <button
                      onClick={() => setMenuAbierto(menuAbierto === c.id ? null : c.id)}
                      className="h-8 w-8 flex items-center justify-center rounded-xl text-slate-200 hover:text-slate-600 hover:bg-slate-100 transition"
                    >
                      <MoreHorizontal size={15} />
                    </button>
                    {menuAbierto === c.id && (
                      <div className="absolute right-4 top-12 z-50 bg-white border border-slate-100 rounded-2xl shadow-2xl py-2 w-40 overflow-hidden">
                        <button
                          onClick={() => { setFichaCliente(c); setMenuAbierto(null) }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-black text-slate-600 hover:bg-slate-50 transition uppercase"
                        >
                          <Building2 size={12} className="text-blue-400" /> Ver ficha
                        </button>
                        <Link
                          href={`/clientes/editar?id=${c.id}`}
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
                            if (!confirm(`¿Borrar a ${c.razon_social}?`)) return
                            const formData = new FormData()
                            formData.append('id', c.id)
                            await deleteCliente(formData)
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

        {/* Footer */}
        <div className="px-8 py-4 border-t border-slate-50">
          <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">
            {clientesFiltrados.length} cliente{clientesFiltrados.length !== 1 ? 's' : ''}
            {clientesFiltrados.length !== clientes.length && ` de ${clientes.length}`}
          </p>
        </div>
      </div>

      {/* OVERLAY ficha */}
      {fichaCliente && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={() => setFichaCliente(null)} />
      )}

      {/* DRAWER ficha cliente */}
      <div className={`fixed top-0 right-0 h-full w-[380px] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${fichaCliente ? 'translate-x-0' : 'translate-x-full'}`}>
        {fichaCliente && (
          <>
            <div className="px-8 py-6 border-b border-slate-100 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-sm font-black">
                  {iniciales(fichaCliente.razon_social)}
                </div>
                <div>
                  <h2 className="text-slate-800 font-black text-lg tracking-tight leading-tight">{fichaCliente.razon_social}</h2>
                  <p className="text-slate-400 text-xs font-mono mt-0.5">{fichaCliente.cuit}</p>
                </div>
              </div>
              <button onClick={() => setFichaCliente(null)} className="h-8 w-8 flex items-center justify-center rounded-xl text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition">
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
              <Campo icon={<Mail size={14} />} label="Email" valor={fichaCliente.email} />
              <Campo icon={<Phone size={14} />} label="Teléfono" valor={fichaCliente.telefono} />
              <Campo icon={<MapPin size={14} />} label="Dirección" valor={fichaCliente.direccion} />
            </div>

            <div className="px-8 py-6 border-t border-slate-100 flex gap-3">
              <Link
                href={`/clientes/editar?id=${fichaCliente.id}`}
                className="flex-1 text-center py-2.5 bg-blue-600 text-white rounded-2xl text-xs font-black hover:bg-blue-700 transition"
              >
                Editar cliente
              </Link>
              <button
                onClick={() => setFichaCliente(null)}
                className="flex-1 py-2.5 bg-slate-100 text-slate-500 rounded-2xl text-xs font-black hover:bg-slate-200 transition"
              >
                Cerrar
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}

function Campo({ icon, label, valor }: { icon: any, label: string, valor: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-semibold text-slate-700 mt-0.5">{valor || '—'}</p>
      </div>
    </div>
  )
}
