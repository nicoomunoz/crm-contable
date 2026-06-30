'use client'
import { useState, useEffect, useRef } from 'react'
import { Paperclip, FileText, Image as ImageIcon, Trash2, Eye, Upload, Loader2, X } from 'lucide-react'
import { uploadDocumento, deleteDocumento, getUrlFirmada } from '@/app/actions'

function formatearPeso(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function iconoPorTipo(tipo: string) {
  if (tipo?.startsWith('image/')) return <ImageIcon size={14} className="text-blue-500" />
  return <FileText size={14} className="text-red-400" />
}

export default function DocumentosTramite({ tramiteId }: { tramiteId: string }) {
  const [documentos, setDocumentos] = useState<any[]>([])
  const [cargando, setCargando] = useState(true)
  const [subiendo, setSubiendo] = useState(false)
  const [error, setError] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [previewTipo, setPreviewTipo] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function cargarDocumentos() {
    setCargando(true)
    const res = await fetch(`/api/documentos?tramite_id=${tramiteId}`)
    const data = await res.json()
    setDocumentos(data)
    setCargando(false)
  }

  useEffect(() => {
    cargarDocumentos()
  }, [tramiteId])

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setError('')
    setSubiendo(true)

    const formData = new FormData()
    formData.append('tramite_id', tramiteId)
    formData.append('file', file)

    try {
      await uploadDocumento(formData)
      await cargarDocumentos()
    } catch (err: any) {
      setError(err.message || 'Error al subir el archivo')
    } finally {
      setSubiendo(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function handleBorrar(doc: any) {
    const formData = new FormData()
    formData.append('id', doc.id)
    formData.append('url', doc.url)
    formData.append('tramite_id', tramiteId)
    await deleteDocumento(formData)
    await cargarDocumentos()
  }

  async function handlePreview(doc: any) {
    const url = await getUrlFirmada(doc.url)
    setPreviewUrl(url)
    setPreviewTipo(doc.tipo)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Paperclip size={13} className="text-slate-400" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Documentos {documentos.length > 0 && `(${documentos.length})`}
          </p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={subiendo}
          className="flex items-center gap-1 text-[10px] font-black text-blue-500 hover:text-blue-700 uppercase tracking-wide transition disabled:opacity-50"
        >
          {subiendo ? <Loader2 size={11} className="animate-spin" /> : <Upload size={11} />}
          {subiendo ? 'Subiendo...' : 'Adjuntar'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.webp"
          onChange={handleUpload}
          className="hidden"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-3 py-2">
          <p className="text-[11px] text-red-500 font-semibold">{error}</p>
        </div>
      )}

      {cargando ? (
        <p className="text-slate-300 text-xs text-center py-4">Cargando...</p>
      ) : documentos.length === 0 ? (
        <div className="text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <Paperclip size={20} className="text-slate-300 mx-auto mb-1.5" />
          <p className="text-slate-400 text-[11px] font-semibold">Sin documentos adjuntos</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {documentos.map((doc: any) => (
            <div key={doc.id} className="flex items-center gap-2.5 bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-100">
              {iconoPorTipo(doc.tipo)}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-700 truncate">{doc.nombre_archivo}</p>
                <p className="text-[10px] text-slate-400">{formatearPeso(doc.peso)} · {doc.subido_por}</p>
              </div>
              <button
                onClick={() => handlePreview(doc)}
                className="h-7 w-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition flex-shrink-0"
              >
                <Eye size={13} />
              </button>
              <button
                onClick={() => handleBorrar(doc)}
                className="h-7 w-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-50 transition flex-shrink-0"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal de preview */}
      {previewUrl && (
        <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4" onClick={() => setPreviewUrl(null)}>
          <div className="bg-white rounded-2xl overflow-hidden max-w-3xl w-full max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <p className="text-xs font-black text-slate-600 uppercase">Vista previa</p>
              <button onClick={() => setPreviewUrl(null)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-auto bg-slate-100 flex items-center justify-center p-4">
              {previewTipo?.startsWith('image/') ? (
                <img src={previewUrl} alt="preview" className="max-w-full max-h-[70vh] object-contain rounded-lg" />
              ) : (
                <iframe src={previewUrl} className="w-full h-[70vh] rounded-lg bg-white" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
