import { login } from '@/app/actions'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200">
        <h1 className="text-2xl font-bold mb-2 text-center text-slate-800">Estudio Contable</h1>
        <p className="text-center text-gray-500 mb-6 text-sm">Ingresa tus credenciales para acceder</p>
        
        <form action={login} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-slate-700">Email</label>
            <input 
              name="email" 
              type="email" 
              required 
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800" 
              placeholder="admin@estudio.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-slate-700">Contraseña</label>
            <input 
              name="password" 
              type="password" 
              required 
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="w-full bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-800 transition font-medium mt-2">
            Entrar al CRM
          </button>
        </form>
      </div>
    </div>
  )
}
