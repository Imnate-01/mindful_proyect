'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Heart,
  Sparkles,
  Bell,
  User,
  LogOut,
  ArrowRight,
  Edit3,
  Wind,
  BookOpen,
  Activity,
  Smile,
  Frown,
  Meh,
} from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { useUser } from '@/context/UserContext'

// 👇 nuevos imports
import { useAcademicProfile } from '@/hooks/useAcademicProfile'
import AcademicProfileOnboarding from '@/components/AcademicProfileOnboarding'

export default function HomePage() {
  const router = useRouter()
  const { user, profile, loading } = useUser()
  const [profileOpen, setProfileOpen] = useState(false)

  // 👇 estado para mostrar / ocultar el onboarding académico
  const [showAcademicOnboarding, setShowAcademicOnboarding] = useState(false)

  // 👇 cargamos el perfil académico desde Supabase
  const {
    profile: academicProfile,
    loading: loadingAcademic,
  } = useAcademicProfile(user?.id)

  // Redirección si no hay usuario
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login')
    }
  }, [user, loading, router])

  // Mostrar onboarding si NO hay perfil académico y no se ha omitido
  useEffect(() => {
    if (!user || loading || loadingAcademic) return

    const storageKey = `academic_profile_seen_${user.id}`
    const skippedOrSeen =
      typeof window !== 'undefined'
        ? localStorage.getItem(storageKey) === 'true'
        : false

    if (!academicProfile && !skippedOrSeen) {
      setShowAcademicOnboarding(true)
    }
  }, [user, loading, academicProfile, loadingAcademic])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <p className="text-sm text-gray-600">Cargando tu espacio seguro…</p>
      </div>
    )
  }

  const displayName =
    profile?.nombre_completo ||
    user?.user_metadata?.full_name ||
    'Estudiante'

  async function handleLogout() {
    await supabase.auth.signOut()
    router.replace('/login')
  }

  // handlers para el onboarding
  const handleOnboardingCompleted = () => {
    if (!user) return
    const storageKey = `academic_profile_seen_${user.id}`
    localStorage.setItem(storageKey, 'true')
    setShowAcademicOnboarding(false)
  }

  const handleOnboardingSkip = () => {
    if (!user) return
    const storageKey = `academic_profile_seen_${user.id}`
    localStorage.setItem(storageKey, 'true')
    setShowAcademicOnboarding(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 overflow-x-hidden">
      {/* Onboarding académico flotando sobre el home */}
      {showAcademicOnboarding && user && (
        <AcademicProfileOnboarding
          userId={user.id}
          onCompleted={handleOnboardingCompleted}
          onSkip={handleOnboardingSkip}
        />
      )}

      {/* Animaciones globales */}
      <style jsx global>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }

        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        .animate-breathe { animation: breathe 4s ease-in-out infinite; }
      `}</style>

      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-20 -left-20 md:left-10 w-72 md:w-96 h-72 md:h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div
          className="absolute top-40 -right-20 md:right-10 w-72 md:w-96 h-72 md:h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className="absolute -bottom-8 left-1/2 w-72 md:w-96 h-72 md:h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"
          style={{ animationDelay: '4s' }}
        ></div>
      </div>

      {/* CONTENIDO */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-10 md:pt-8">
        <div className="grid lg:grid-cols-[2fr,1.2fr] gap-6 md:gap-8">
          {/* Columna izquierda */}
          <div className="space-y-6 md:space-y-8">
            {/* Bienvenida */}
            <section className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-lg p-5 sm:p-7">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 rounded-full">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-medium text-emerald-700">
                      Hola, {displayName} 👋
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    ¿Cómo te gustaría empezar hoy?
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 max-w-xl">
                    Puedes escribir en tu diario, registrar cómo te sientes o probar
                    una meditación corta. Este espacio es solo para ti.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1 text-[11px] text-emerald-800">
                      <Activity className="w-3 h-3" />
                      Racha: 3 días (ejemplo)
                    </div>
                    <div className="flex items-center gap-2 bg-teal-50 border border-teal-100 rounded-full px-3 py-1 text-[11px] text-teal-800">
                      <BookOpen className="w-3 h-3" />
                      Última actividad: Diario ayer
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3 w-full md:w-auto">
                  <button
                    type="button"
                    onClick={() => router.push('/journal')}
                    className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold text-sm hover:shadow-xl hover:scale-[1.02] transition-all"
                  >
                    <Edit3 className="w-4 h-4" />
                    Escribir en mi diario
                  </button>
                  <button
                    type="button"
                    className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-gray-800 border border-gray-200 font-semibold text-sm hover:shadow-md hover:scale-[1.01] transition-all"
                  >
                    <Wind className="w-4 h-4 text-emerald-500" />
                    Registrar cómo me siento
                  </button>
                </div>
              </div>
            </section>

            {/* Acciones rápidas */}
            <section className="grid sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => router.push('/journal')}
                className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-md p-4 text-left hover:-translate-y-1 hover:shadow-xl transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-3">
                  <Edit3 className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">
                  Diario emocional
                </h3>
                <p className="text-xs text-gray-600">
                  Escribe lo que sientes, lo que piensas y lo que te preocupa.
                </p>
              </button>

              <button
                type="button"
                onClick={() => router.push('/sesiones')}
                className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-md p-4 text-left hover:-translate-y-1 hover:shadow-xl transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center mb-3">
                  <Wind className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">
                  Meditaciones rápidas
                </h3>
                <p className="text-xs text-gray-600">
                  Sesiones de 5–10 minutos para bajar estrés y calmar la mente.
                </p>
              </button>

              <button
                type="button"
                onClick={() => router.push('/recursos')}
                className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-md p-4 text-left hover:-translate-y-1 hover:shadow-xl transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mb-3">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">
                  Recursos de apoyo
                </h3>
                <p className="text-xs text-gray-600">
                  Lecturas, tips y contactos confiables para pedir ayuda.
                </p>
              </button>

              <button
                type="button"
                onClick={() => router.push('/emergencia')}
                className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-md p-4 text-left hover:-translate-y-1 hover:shadow-xl transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center mb-3">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">
                  Apoyo en crisis
                </h3>
                <p className="text-xs text-gray-600">
                  Información importante si estás pasando por un momento difícil.
                </p>
              </button>
            </section>

            {/* Sugerencia del día */}
            <section className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 rounded-3xl backdrop-blur-xl"></div>
              <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold mb-1">
                    Sugerencia del día
                  </h2>
                  <p className="text-sm sm:text-base opacity-90 mb-2">
                    Prueba una meditación de respiración de 5 minutos antes de dormir.
                  </p>
                  <p className="text-xs sm:text-sm opacity-90">
                    Puedes usar este momento para revisar cómo te sentiste hoy y
                    escribir tres cosas que agradeces.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => router.push('/sesiones')}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/90 text-emerald-700 text-sm font-semibold hover:bg-white"
                >
                  Empezar ahora
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </section>
          </div>

          {/* Columna derecha */}
          <div className="space-y-6 md:space-y-8">
            {/* Resumen emocional */}
            <section className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-lg p-5 sm:p-6">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                Cómo te has sentido esta semana
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                (Ejemplo) Registra tus emociones cada día para ver patrones y cuidarte mejor.
              </p>
              <div className="grid grid-cols-7 gap-2 text-center text-[10px]">
                {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, idx) => (
                  <div
                    key={day}
                    className="flex flex-col items-center gap-1 bg-gray-50 rounded-xl py-2"
                  >
                    <span className="text-gray-500">{day}</span>
                    {idx === 1 || idx === 2 ? (
                      <Frown className="w-4 h-4 text-amber-500" />
                    ) : idx === 4 ? (
                      <Smile className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Meh className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Diario reciente */}
            <section className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-lg p-5 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                  Tu diario reciente
                </h3>
                <button
                  type="button"
                  onClick={() => router.push('/journal')}
                  className="text-[11px] text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Ver todo
                </button>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                (Ejemplo) Aquí aparecerán tus últimas entradas cuando empieces a escribir.
              </p>
              <ul className="space-y-2">
                <li className="bg-gray-50 rounded-xl px-3 py-2">
                  <p className="text-[11px] text-gray-500">Ayer · Noche</p>
                  <p className="text-xs text-gray-800">
                    “Me sentí nerviosa por los exámenes, pero la meditación me ayudó un poco…”
                  </p>
                </li>
                <li className="bg-gray-50 rounded-xl px-3 py-2">
                  <p className="text-[11px] text-gray-500">Martes · Tarde</p>
                  <p className="text-xs text-gray-800">
                    “Hoy tuve una plática con una amiga que me hizo sentir acompañada…”
                  </p>
                </li>
              </ul>
            </section>

            {/* Atajos / seguridad */}
            <section className="bg-white/85 backdrop-blur-xl rounded-3xl border border-white/50 shadow-lg p-5 sm:p-6">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">
                Atajos rápidos
              </h3>
              <div className="flex flex-col gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => router.push('/recursos')}
                  className="flex items-center justify-between px-3 py-2 rounded-xl bg-gray-50 hover:bg-emerald-50 transition-colors"
                >
                  <span>Ver recursos de ayuda profesional</span>
                  <ArrowRight className="w-3 h-3 text-emerald-500" />
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/emergencia')}
                  className="flex items-center justify-between px-3 py-2 rounded-xl bg-gray-50 hover:bg-rose-50 transition-colors"
                >
                  <span>Información en caso de emergencia</span>
                  <ArrowRight className="w-3 h-3 text-rose-500" />
                </button>
              </div>
              <p className="mt-3 text-[10px] text-gray-500 leading-snug">
                Si estás en una situación de riesgo inmediato, contacta a los
                servicios de emergencia de tu localidad. Esta plataforma es un apoyo
                complementario, no un sustituto de atención profesional urgente.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
