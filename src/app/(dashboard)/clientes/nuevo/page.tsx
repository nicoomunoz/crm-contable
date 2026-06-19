import { createCliente } from '@/app/actions'

export default function NuevoCliente() {
  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl border shadow-sm">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">Dar de alta nuevo cliente</h1>
      
      <form action={createCliente} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Nombre o Razón Social</label>
            <input name="razon_social" required className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">CUIT</label>
            <input name="cuit" required className="w-full p-2 border rounded-md" placeholder="XX-XXXXXXXX-X" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email de contacto</label>
            <input name="email" type="email" className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Teléfono</label>
            <input name="telefono" className="w-full p-2 border rounded-md" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Dirección</label>
            <input name="direccion" className="w-full p-2 border rounded-md" />
          </div>
        </div>
        
        <div className="pt-4 flex gap-3">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">
            Guardar Cliente
          </button>
          <a href="/clientes" className="bg-gray-100 px-6 py-2 rounded-lg font-medium text-gray-600 text-center">
            Cancelar
          </a>
        </div>
      </form>
    </div>
  )
}
