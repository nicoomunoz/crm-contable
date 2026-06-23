export const dynamic = 'force-dynamic'

import React from 'react'
import { createClient } from '@/lib/supabase'
import { updateTramite } from '@/app/actions'
import { redirect } from 'next/navigation'

export default async function EditarTramitePage({ searchParams }: { searchParams: { id: string } }) {
  const supabase = createClient()
  const id = searchParams.id

  if (!id) redirect('/tramites')

  const { data: tramite } = await supabase
    .from('tramites')
    .select('*, clientes(razon_social)')
    .eq('id', id)
    .single()

  if (!tramite) redirect('/tramites')

  const { data: clientes } = await supabase
    .from('clientes')
    .select('id, razon_social')
    .order('razon_social')

  return (
    <div className="max-w-xl mx-auto space-y-6 px-4">
      <div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tighter italic">EDITAR TRÁMITE</h1>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1 italic border-l-2 border-blue-600 pl-2 leading-none">
          Estudio Contable
        </p>
      </div>

      <div className="bg-white border border-slate-100 rounded-[2rem] shadow-2xl p-8 space-y-5">
        <form action={updateTramite} className="space-y-5">
          <input type="hidden" name="id" value={tramite.id} />

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cliente</label>
            <select
              name="cliente_id"
              defaultValue={tramite.cliente_id}
              className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-slate-50"
            >
              {(clientes || []).map((c: any) => (
                <option key={c.id} value={c.id}>{c.razon_social}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tipo de Trámite</label>
            <input
              name="tipo_tramite"
              defaultValue={tramite.tipo_tramite}
              className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-slate-50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Fecha de Vencimiento</label>
            <input
              type="date"
              name="fecha_vencimiento"
              defaultValue={tramite.fecha_vencimiento || ''}
              className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-slate-50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Observaciones</label>
            <textarea
              name="observaciones"
              defaultValue={tramite.observaciones || ''}
              rows={4}
              className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-slate-50 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-slate-900 text-white py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all active:scale-95"
            >
              Guardar Cambios
            </button>
            
              href="/tramites"
              className="flex-1 text-center bg-slate-100 text-slate-500 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
            >
              Cancelar
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
