export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Briefcase, Mail, Phone, MapPin, FileText, ArrowLeft, Edit3 } from 'lucide-react'

export default async function FichaCliente({ params }: { params: { id: string } }) {
  const supabase = createClient()

  // Traemos los datos del cliente y sus trámites en paralelo
  const [clienteRes, tramitesRes] = await Promise.all([
    supabase.from('clientes').select('*').eq('id', params.id).single(),
    supabase.from('tramites').select('*').eq('cliente_id', params.id).order('created_at', { ascending: false })
  ])

  const c = clienteRes.data
  const tramites = tramitesRes.data || []

  if (!c) redirect('/clientes')

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Botón Volver */}
      <Link href="/clientes" className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition font-bold text-xs uppercase tracking-widest">
        <ArrowLeft size={16} /> Volver al listado
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMNA IZQUIERDA: INFORMACIÓN FISCAL */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
             <div className="relative z-10">
                <p className="text-blue-400 font-black text-[10px] uppercase tracking-[0.2em] mb-2 italic">Cliente Registrado</p>
                <h1 className="text-2xl font-black leading-tight mb-6">{c.razon_social}</h1>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-slate-400 text-sm">
                    <FileText size={16} className="text-blue-500" /> <span className="font-bold">CUIT: {c.cuit}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 text-sm">
                    <Mail size={16} /> {c.email || 'Sin mail'}
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 text-sm">
                    <Phone size={16} /> {c.telefono || 'Sin teléfono'}
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 text-sm italic">
                    <MapPin size={16} /> {c.direccion || 'Sin dirección'}
                  </div>
                </div>

                <Link href={`/clientes/${c.id}/editar`} className="mt-8 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 p-3 rounded-2xl transition font-black text-[10px] uppercase tracking-widest">
                  <Edit3 size={14} /> Editar Datos
                </Link>
             </div>
             {/* Adorno visual */}
             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600 rounded-full blur-[80px] opacity-20"></div>
          </div>
        </div>

        {/* COLUMNA DERECHA: HISTORIAL DE TRÁMITES */}
        <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-black text-slate-800 italic flex items-center gap-2 px-4 uppercase tracking-tighter">
                <Briefcase className="text-blue-600" /> Historial de Gestiones
            </h2>

            <div className="space-y-4">
              {tramites.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-slate-100 p-10 rounded-[2rem] text-center text-slate-300 font-bold uppercase text-[10px]">Este cliente no tiene trámites iniciados aún.</div>
              ) : (
                tramites.map((t) => (
                  <div key={t.id} className="bg-white p-6 rounded-[2rem] shadow-xl border border-slate-50 flex items-center justify-between group transition-all hover:border-blue-200">
                    <div>
                        <h4 className="font-black text-slate-800 uppercase tracking-tighter text-lg italic">{t.tipo_tramite}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">ESTADO: <span className="text-blue-500">{t.estado}</span></p>
                    </div>
                    <Link href="/tramites" className="bg-slate-50 p-3 rounded-2xl text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition">
                        <FileText size={18} />
                    </Link>
                  </div>
                ))
              )}
            </div>
        </div>

      </div>
    </div>
  )
}
