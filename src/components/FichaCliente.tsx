'use client'
import { useState, useEffect } from 'react'
import { X, Mail, Phone, MapPin, Hash, Briefcase, Plus, ArrowRight } from 'lucide-react'
import Link from 'next/link'

function diasRestantes(fecha: string) {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  return Math.ceil((new Date(fecha).getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
}

export default function FichaCliente({ clienteId, onClose }: { clienteId: string | null, onClose: () => void }) {
  const [data, setData] = useState<any>(null)
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    if (!clienteId) return
    setCargando(true)
    setData(null)
    fetch(`/api/cliente/${clienteId}`)
      .then(r => r.json())
      .then(d => { setData(d); setCargando(false) })
  }, [clienteId])

  if (!clienteId) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-full md:w-[480px] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300">
        {cargando || !data ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-slate-400 text-sm">Cargando...</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-lg font-black flex-shrink-0">
                  {data.cliente?.razon_social?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-slate-800 font-black text-lg tracking-tight leading-tight">{data.cliente?.razon_social}</h2>
                  <p className="text-slate-400 text-xs font-mono mt-0.5">{data.cliente?.cuit || 'Sin CUIT'}</p>
                </div>
              </div>
              <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-xl text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition">
                <X size={16} />
              </button>
            </div>

            {/* Datos de contacto */}
            <div className="px-6 py-4 border-b border-slate-100 grid grid-cols-2 gap-3">
              {data.cliente?.email && (
                <div className="flex items-center gap-2">
                  <Mail size={13} className="text-slate-400 flex-shrink-0" />
                  <p className="text-xs text-slate-600 truncate">{data.cliente.email}</p>
                </div>
              )}
              {data.cliente?.telefono && (
                <div className="flex items-center gap-2">
                  <Phone size={13} className="text-slate-400 flex-shrink-0" />
                  <p className="text-xs text-slate-600">{data.cliente.telefono}</p>
                </div>
              )}
              {data.cliente?.direccion && (
                <div className="flex items-center gap-2 col-span-2">
                  <MapPin size={13} className="text-slate-400 flex-shrink-0" />
                  <p className="text-xs text-slate-600">{data.cliente.direccion}</p>
                </div>
              )}
            </div>

            {/* Trámites */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Briefcase size={13} className="text-slate-400" />
                <p className="text-xs font-black text-slate-600 uppercase tracking-wide">
                  Trámites ({data.tramites?.length || 0})
                </p>
              </div>
              <Link
                href={`/tramites/nuevo`}
                onClick={onClose}
                className="flex items-center gap-1 text-[10px] font-black text-blue-500 hover:text-blue-700 uppercase tracking-wide transition"
              >
                <Plus size={11} /> Nuevo
              </Link>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
              {data.tramites?.length === 0 ? (
                <div className="text-center py-10">
                  <Briefcase size={24} className="text-slate-200 mx-auto mb-2" />
                  <p className="text-slate-400 text-xs font-bold">Sin trámites registrados</p>
                </div>
              ) : (
                data.tramites?.map((t: any) => {
                  const dias = t.fecha_vencimiento ? diasRestantes(t.fecha_vencimiento) : null
                  const vencido = dias !== null && dias < 0
                  const urgente = dias !== null && dias >= 0 && dias <= 3

                  return (
                    <div key={t.id} className={`rounded-2xl border px-4 py-3 ${vencido ? 'border-red-100 bg-red-50/30' : urgente ? 'border-orange-100 bg-orange-50/20' : 'border-slate-100'}`}>
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-bold text-slate-800 leading-tight">{t.tipo_tramite}</p>
                        <span className={`flex-shrink-0 text-[10px] font-black px-2 py-1 rounded-full ${
                          t.estado === 'pendiente' ? 'bg-orange-50 text-orange-500' :
                          t.estado === 'en_proceso' ? 'bg-blue-50 text-blue-500' :
                          'bg-emerald-50 text-emerald-600'
                        }`}>
                          {t.estado.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        {t.creado_por && (
                          <p className="text-[10px] text-slate-400 font-semibold">{t.creado_por}</p>
                        )}
                        {t.asignado_a && t.asignado_a !== t.creado_por && (
                          <p className="text-[10px] text-blue-500 font-semibold">→ {t.asignado_a}</p>
                        )}
                        {t.fecha_vencimiento && (
                          <p className={`text-[10px] font-black ${vencido ? 'text-red-500' : urgente ? 'text-orange-500' : 'text-slate-400'}`}>
                            {vencido ? 'Vencido' : dias === 0 ? 'Hoy' : `${dias}d`} · {new Date(t.fecha_vencimiento).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })}
