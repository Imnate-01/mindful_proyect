'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { 
  Home, BookOpen, PlayCircle, Book, Zap, Bell, 
  User, Activity, LogOut, ChevronDown, Heart 
} from 'lucide-react'

// --- Configuración de Navegación ---
const tabs = [
  { href: '/home', label: 'Inicio', icon: Home },
  { href: '/journal', label: 'Diario', icon: Book },  
  { href: '/recursos', label: 'Recursos', icon: BookOpen },
  { href: '/sesiones', label: 'Meditaciones', icon: PlayCircle },
  { href: '/emergencia', label: 'Emergencia', icon: Zap, isEmergency: true },
]

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [profileOpen, setProfileOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  // Estado para el usuario
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Instancia de Supabase
  // Instancia de Supabase
  const supabase = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
    return createClient(url, key)
  }, [])
  // 1. Cargar usuario al iniciar
  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
      }
      setLoading(false)
    }
    getUser()
  }, [supabase])

  // 2. Cerrar sesión
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.refresh()
      router.push('/login')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Rutas donde no se muestra el header
  const rutasOcultas = ['/', '/login', '/register', '/landing']
  if (rutasOcultas.includes(pathname)) return null

  // Datos para mostrar (Fallback si no hay datos)
  const fullName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Usuario"
  const email = user?.email || ""
  const firstLetter = fullName[0]?.toUpperCase() || "U"

  return (
    <>
      <header className="sticky top-0 z-40 w-full px-4 py-3">
        <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-xl border border-white/40 shadow-lg rounded-2xl px-4 py-2.5 flex items-center justify-between transition-all duration-300 relative z-50">
          
          {/* LOGO iNerzia Mind */}
          <div className="mr-4">
            <Link href="/home" className="flex items-center gap-3 group">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <span className="font-bold text-lg md:text-xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent hidden lg:block">
                iNerzia Mind
              </span>
            </Link>
          </div>

          {/* NAVEGACIÓN DESKTOP */}
          <nav className="hidden md:flex items-center gap-1 bg-gray-100/50 p-1 rounded-full border border-gray-200/50">
            {tabs.map((t) => {
              const isActive = pathname === t.href
              const Icon = t.icon

              return (
                <Link 
                  key={t.href} 
                  href={t.href} 
                  className={`
                    relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                    ${isActive 
                      ? 'bg-white text-emerald-600 shadow-sm ring-1 ring-black/5 scale-105' 
                      : 'text-gray-500 hover:text-gray-900 hover:bg-white/60'
                    }
                    ${t.isEmergency && !isActive ? 'text-rose-500 hover:text-rose-600 hover:bg-rose-50' : ''}
                  `}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5px]' : ''}`} />
                  <span>{t.label}</span>
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-500 rounded-full"></span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* PERFIL + NOTIFICACIONES */}
          <div className="flex items-center gap-3 ml-auto">
            
            {loading ? (
               <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            ) : (
              <>
                <button
                  className="relative w-10 h-10 bg-white hover:bg-emerald-50 rounded-full flex items-center justify-center border border-gray-100 shadow-sm transition-transform hover:scale-105 active:scale-95 group"
                  aria-label="Notificaciones"
                >
                  <Bell className="w-5 h-5 text-gray-500 group-hover:text-emerald-600 transition-colors" />
                  <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border border-white animate-pulse"></span>
                </button>

                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setProfileOpen((v) => !v)}
                    className={`flex items-center gap-2 bg-white rounded-full border px-2 py-1 pl-1 shadow-sm transition-all hover:shadow-md ${profileOpen ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-gray-100 hover:border-emerald-200'}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-sm shadow-inner uppercase">
                      {firstLetter}
                    </div>
                    
                    <div className="hidden sm:flex flex-col items-start pr-2">
                      <span className="text-xs font-bold text-gray-700 leading-tight max-w-[80px] truncate">
                        {fullName.split(' ')[0]}
                      </span>
                      <span className="text-[10px] text-gray-400 leading-tight font-medium">
                        Mi espacio
                      </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 hidden sm:block ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown */}
                  {profileOpen && (
                    <div className="absolute right-0 mt-3 w-64 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 ring-1 ring-black/5 py-2 z-50 animate-in slide-in-from-top-2 fade-in duration-200 origin-top-right">
                      
                      <div className="px-5 py-3 border-b border-gray-100">
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {fullName}
                        </p>
                        <p className="text-xs text-gray-500 truncate font-medium">
                          {email}
                        </p>
                      </div>

                      <div className="p-2 space-y-1">
                        <Link href="/perfil" className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors font-medium group">
                          <div className="p-1.5 bg-gray-100 group-hover:bg-emerald-100 rounded-lg transition-colors">
                            <User className="w-4 h-4" />
                          </div>
                          Mi Perfil
                        </Link>
                        
                        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors font-medium group">
                          <div className="p-1.5 bg-gray-100 group-hover:bg-emerald-100 rounded-lg transition-colors">
                            <Activity className="w-4 h-4" />
                          </div>
                          Configuración
                        </button>
                      </div>

                      <div className="p-2 border-t border-gray-100 mt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-xl transition-colors font-medium group"
                        >
                          <div className="p-1.5 bg-rose-50 group-hover:bg-rose-100 rounded-lg transition-colors">
                            <LogOut className="w-4 h-4" />
                          </div>
                          Cerrar sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* NAV MÓVIL */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 bg-white/90 backdrop-blur-xl border border-white/50 shadow-2xl rounded-2xl px-2 py-3 flex justify-between items-center z-50 ring-1 ring-black/5">
        {tabs.map((t) => {
          const isActive = pathname === t.href
          const Icon = t.icon
          if (t.isEmergency) return null 

          return (
            <Link 
              key={t.href} 
              href={t.href}
              className={`relative flex flex-col items-center justify-center w-full py-1 transition-all duration-300 group`}
            >
              <div className={`p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-emerald-100 text-emerald-600 -translate-y-2 shadow-sm' : 'text-gray-400 group-hover:text-gray-600'}`}>
                <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
              </div>
            </Link>
          )
        })}
        <Link 
          href="/emergencia" 
          className="absolute -top-5 left-1/2 -translate-x-1/2 w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg border-4 border-gray-100 text-white hover:scale-105 active:scale-95 transition-transform"
        >
          <Zap className="w-6 h-6 fill-white" />
        </Link>
      </nav>
    </>
  )
}