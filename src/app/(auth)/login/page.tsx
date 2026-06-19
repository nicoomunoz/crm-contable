export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-slate-800">Estudio Contable - Acceso</h1>
        <form action="/auth/login" method="POST" className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              name="email" 
              type="email" 
              required 
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contraseña</label>
            <input 
              name="password" 
              type="password" 
              required 
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="••••••••"
            />
          </div>
          <button className="w-full bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-800 transition font-medium">
            Entrar al CRM
          </button>
        </form>
      </div>
    </div>
  )
}
