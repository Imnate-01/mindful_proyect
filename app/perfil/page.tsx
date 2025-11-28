'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { User, Mail, Calendar, LogOut, Camera, Shield, Zap, Award } from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  
  // Cliente de Supabase
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/login')
        return
      }

      setUser(session.user)
      setLoading(false)
    }

    getUser()
  }, [supabase, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-emerald-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-emerald-100 rounded"></div>
        </div>
      </div>
    )
  }

  // Datos del usuario (o fallbacks)
  const fullName = user?.user_metadata?.full_name || "Usuario de iNerzia"
  const email = user?.email
  const initial = fullName[0]?.toUpperCase() || "U"
  const joinDate = new Date(user?.created_at).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Encabezado del Perfil */}
        <div className="relative mb-8">
          {/* Banner de fondo decorativo */}
          <div className="h-48 rounded-3xl bg-gradient-to-r from-emerald-400 to-teal-500 shadow-lg overflow-hidden relative">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
          </div>

          {/* Tarjeta de Info Principal (flotante) */}
          <div className="absolute top-24 left-6 right-6 md:left-12 md:right-auto flex items-end">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-xl flex items-center justify-center text-5xl font-bold text-emerald-600 select-none bg-gradient-to-br from-emerald-50 to-teal-50">
                {initial}
              </div>
              <button className="absolute bottom-2 right-0 p-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors shadow-lg border-2 border-white" title="Cambiar foto">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div className="mb-4 ml-6 hidden md:block">
              <h1 className="text-3xl font-bold text-white shadow-black/10 drop-shadow-md">{fullName}</h1>
              <p className="text-emerald-50 font-medium opacity-90">{email}</p>
            </div>
          </div>
        </div>

        {/* Espaciador para móvil */}
        <div className="mt-16 md:mt-4 md:ml-48 px-2 md:px-0 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 md:hidden text-center">{fullName}</h1>
          <p className="text-gray-500 text-center md:hidden mb-6">{email}</p>
          
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium border border-emerald-200 flex items-center gap-1">
              <Shield className="w-3 h-3" /> Estudiante
            </span>
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium border border-blue-200 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Miembro desde {joinDate}
            </span>
          </div>
        </div>

        {/* Grid de Contenido */}
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Columna Izquierda: Datos */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-sm">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Información</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Nombre completo</p>
                    <p className="text-sm font-medium text-gray-800">{fullName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs text-gray-500">Correo electrónico</p>
                    <p className="text-sm font-medium text-gray-800 truncate" title={email}>{email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-sm">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Cuenta</h2>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium border border-red-100"
              >
                <LogOut className="w-4 h-4" /> Cerrar Sesión
              </button>
            </div>
          </div>

          {/* Columna Derecha: Estadísticas / Logros */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-800">Tu Progreso</h2>
                <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-lg">Esta semana</span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-xl border border-indigo-100 text-center">
                  <div className="mx-auto w-10 h-10 bg-white rounded-full flex items-center justify-center text-indigo-500 mb-2 shadow-sm">
                    <Zap className="w-5 h-5" />
                  </div>
                  <p className="text-2xl font-bold text-indigo-900">12</p>
                  <p className="text-xs text-indigo-600">Sesiones</p>
                </div>
                
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-100 text-center">
                  <div className="mx-auto w-10 h-10 bg-white rounded-full flex items-center justify-center text-amber-500 mb-2 shadow-sm">
                    <Award className="w-5 h-5" />
                  </div>
                  <p className="text-2xl font-bold text-amber-900">3</p>
                  <p className="text-xs text-amber-600">Racha días</p>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-xl border border-emerald-100 text-center">
                  <div className="mx-auto w-10 h-10 bg-white rounded-full flex items-center justify-center text-emerald-500 mb-2 shadow-sm">
                    <Shield className="w-5 h-5" />
                  </div>
                  <p className="text-2xl font-bold text-emerald-900">Nivel 2</p>
                  <p className="text-xs text-emerald-600">Explorador</p>
                </div>
              </div>
            </div>

            {/* Sección de "Próximamente" o Configuración rápida */}
            <div className="bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-dashed border-gray-300 text-center">
              <p className="text-gray-500 mb-2">Más configuraciones próximamente</p>
              <p className="text-sm text-gray-400">Estamos trabajando para que puedas personalizar tu experiencia en iNerzia Mind.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}