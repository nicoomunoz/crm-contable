'use client'

import { useEffect } from 'react'
import { signOut } from '@/app/actions'

export default function SessionGuard() {
  useEffect(() => {
    // 1. Chequeamos si en esta pestaña existe una "marca" de sesión activa
    const sessionActive = sessionStorage.getItem('estudio_session_active')

    if (!sessionActive) {
      // 2. Si no hay marca, significa que el usuario cerró el navegador 
      // y volvió a abrir, o abrió una pestaña nueva.
      // En cualquier caso: FORZAMOS LOGOUT para limpiar cookies viejas.
      const forceLogout = async () => {
        console.log("Nueva pestaña o ventana detectada: Reiniciando seguridad.")
        await signOut()
      }
      forceLogout()
      
      // 3. Dejamos la marca para que la próxima vez que navegue (o F5) no lo eche
      sessionStorage.setItem('estudio_session_active', 'true')
    }
  }, [])

  return null
}
