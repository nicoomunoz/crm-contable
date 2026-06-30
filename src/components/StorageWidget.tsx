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
    <div className="bg-slate-800/60 rounded-xl px-3 py-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <HardDrive size={12} className="text-slate-400" />
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Almacenamiento</p>
        </div>
        <p className="text-[9px] text-slate-500 font-bold">{data.cantidadArchivos} arch.</p>
      </div>

      <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden mb-1.5">
        <div
          className={`h-full ${colorBarra} transition-all duration-500 rounded-full`}
          style={{ width: `${data.porcentaje}%` }}
        />
      </div>

      <p className="text-[10px] text-slate-300 font-semibold">
        {data.totalMB} MB <span className="text-slate-500 font-normal">de {data.limiteMB} MB</span>
      </p>
    </div>
  )
}
