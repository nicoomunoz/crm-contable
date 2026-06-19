import { redirect } from 'next/navigation'

export default function RootPage() {
  // Simplemente redirigimos al dashboard. 
  // El middleware se encargará de frenar el acceso si no está logueado.
  redirect('/dashboard')
}
