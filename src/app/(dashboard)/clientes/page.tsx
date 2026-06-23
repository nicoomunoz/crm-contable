export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { deleteCliente } from '@/app/actions'
import { User, Search, Trash2, ArrowRight } from 'lucide-react'

export default async function ClientesPage() {
  const supabase = createClient()
  const { data: clientes } = await supabase.from('clientes').select('*').order('razon_social')

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-4">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter uppercase text-slate-800 leading-none">Clientes</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 border-l-4 border-blue-600 pl-3">Estudio Contable - {clientes?.length} Registrados</p>
        </div>
        <Link href="/clientes/nuevo" className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-[11px] uppercase shadow-2xl hover:bg-slate-900 transition-all active:scale-95 tracking-widest">+ Nuevo Cliente</Link>
      </div>

      <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <th className="px-10 py-6 uppercase">Nombre o Razón Social</th>
              <th className="px-10 py-6 text-center uppercase tracking-widest">Identificación</th>
              <th className="px-10 py-6 text-right uppercase tracking-widest">Gestión Administrativa</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {clientes?.map((c) => (
              <tr key={c.id} className="hover:bg-blue-50/20 transition-all group">
                <td className="px-10 py-6">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-950 flex items-center justify-center font-black text-white text-[10px] shadow-lg italic">{(c.razon_social).charAt(0)}</div>
                      <p className="font-black text-slate-800 text-lg tracking-tighter uppercase italic">{c.razon_social}</p>
                   </div>
                </td>
                <td className="px-10 py-6 text-center italic font-bold">
                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">CUIT</span>
                    <p className="text-slate-700 font-bold tracking-widest">{c.cuit}</p>
                </td>
                <td className="px-10 py-6 text-right">
                    <div className="flex justify-end gap-3 items-center">
                        <Link href={`/clientes/${c.id}`} className="bg-white border border-slate-100 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-tighter text-slate-400 hover:bg-slate-900 hover:text-white transition shadow-sm flex items-center gap-2 uppercase font-bold italic tracking-widest">
                           Ver ficha <ArrowRight size={14}/>
                        </Link>
                        
                        <form action={deleteCliente}>
                          <input type="hidden" name="id" value={c.id} />
                          <button onClick={(e) => !confirm("¿Eliminar este cliente y todos sus datos definitivamente?") && e.preventDefault()} className="p-2.5 text-red-100 hover:text-red-500 transition border border-transparent hover:border-red-100 rounded-xl">
                            <Trash2 size={18} />
                          </button>
                        </form>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
