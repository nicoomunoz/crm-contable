'use client'
import { useState, useEffect } from 'react'
import { HardDrive } from 'lucide-react'

export default function StorageWidget() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    fetch('/api/storage-usage')
      .then(r => r.json())
      .then(setData)
  }, [])

  if (!data || data.error) return null

  const colorBarra = data.porcentaje > 80 ? 'bg-red-500' : data.porcentaje > 50 ? 'bg-orange-400' : 'bg-blue-500'

  return (
    <div className="bg-white rounded-2xl border border-slate-100 px-5 py-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <HardDrive size={14} className="text-slate-400" />
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Almacenamiento</p>
        </div>
        <p className="text-[10px] text-slate-400 font-bold">{data.cantidadArchivos} archivo{data.cantidadArchivos !== 1 ? 's' : ''}</p>
      </div>

      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
        <div
          className={`h-full ${colorBarra} transition-all duration-500 rounded-full`}
          style={{ width: `${data.porcentaje}%` }}
        />
      </div>

      <p className="text-xs text-slate-600 font-semibold">
        {data.totalMB} MB <span className="text-slate-400 font-normal">de {data.limiteMB} MB usados</span>
      </p>
    </div>
  )
}
