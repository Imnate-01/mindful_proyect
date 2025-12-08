'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Heart,
  Sparkles,
  BookOpen,
  Activity,
  Edit3,
  Wind,
  Smile,
  Frown,
  Meh,
  ArrowRight,
} from 'lucide-react'
import { useUser } from '@/context/UserContext'
import { useAcademicProfile } from '@/hooks/useAcademicProfile'
import { useEntries } from '@/hooks/useEntries'
import { Entry, EmotionKey } from '@/types/journal'
import AcademicProfileOnboarding from '@/components/AcademicProfileOnboarding'

// UI Helpers (Mismo diseño que JournalPage)
const EMOTION_ICONS: Record<EmotionKey, any> = {
  ansiedad: { emoji: '😟', color: 'text-rose-500' },
  calma: { emoji: '😌', color: 'text-emerald-500' },
  alegria: { emoji: '😊', color: 'text-amber-500' },
  tristeza: { emoji: '😢', color: 'text-blue-500' },
  enojo: { emoji: '😠', color: 'text-red-500' },
  frustracion: { emoji: '😤', color: 'text-orange-500' },
  neutra: { emoji: '🙂', color: 'text-gray-400' },
};

export default function HomePage() {
  const router = useRouter()
  const { user, profile, loading } = useUser()
  const [showAcademicOnboarding, setShowAcademicOnboarding] = useState(false)
  const {
    profile: academicProfile,
    loading: loadingAcademic,
  } = useAcademicProfile(user?.id)

  const { entries, loadingEntries } = useEntries()
  const [streak, setStreak] = useState(0)

  // Calculadora de Racha Simple
  useEffect(() => {
    if (!entries.length) {
      setStreak(0)
      return
    }

    // Simplificación: contar días únicos consecutivos hacia atrás desde hoy/ayer
    const dates = Array.from(new Set(entries.map(e => e.createdAt.split('T')[0]))).sort().reverse()

    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

    if (dates[0] !== today && dates[0] !== yesterday) {
      setStreak(0)
      return
    }

    let currentStreak = 1
    let lastDate = new Date(dates[0])

    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i])
      const diffTime = Math.abs(lastDate.getTime() - prevDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 1) {
        currentStreak++
        lastDate = prevDate
      } else {
        break
      }
    }
    setStreak(currentStreak)
  }, [entries])

  // Datos de la semana para el gráfico
  const weeklyData = useMemo(() => {
    const days = ['D', 'L', 'M', 'X', 'J', 'V', 'S']
    const today = new Date()
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(today.getDate() - (6 - i))
      return {
        dateStr: d.toISOString().split('T')[0],
        dayLabel: days[d.getDay()],
        entries: [] as Entry[]
      }
    })

    entries.forEach(entry => {
      const entryDate = entry.createdAt.split('T')[0]
      const dayData = last7Days.find(d => d.dateStr === entryDate)
      if (dayData) {
        dayData.entries.push(entry)
      }
    })

    return last7Days
  }, [entries])


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
    const skippedOrSeen = typeof window !== 'undefined' ? localStorage.getItem(storageKey) === 'true' : false
    if (!academicProfile && !skippedOrSeen) {
      setShowAcademicOnboarding(true)
    }
  }, [user, loading, academicProfile, loadingAcademic])

  if (loading || loadingEntries) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <p className="text-sm text-gray-600 animate-pulse">Cargando tu espacio seguro…</p>
      </div>
    )
  }

  const displayName = profile?.nombre_completo || user?.user_metadata?.full_name || 'Estudiante'

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
      `}</style>

      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-20 -left-20 md:left-10 w-72 md:w-96 h-72 md:h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 -right-20 md:right-10 w-72 md:w-96 h-72 md:h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-1/2 w-72 md:w-96 h-72 md:h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob" style={{ animationDelay: '4s' }}></div>
      </div>

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
                    Este es tu espacio seguro. Sin juicios, solo herramientas para ti.
                  </p>

                  {/* Stats reales */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1 text-[11px] text-emerald-800">
                      <Activity className="w-3 h-3" />
                      Racha: {streak} {streak === 1 ? 'día' : 'días'} 🔥
                    </div>
                    {entries.length > 0 && (
                      <div className="flex items-center gap-2 bg-teal-50 border border-teal-100 rounded-full px-3 py-1 text-[11px] text-teal-800">
                        <BookOpen className="w-3 h-3" />
                        Último registro: {new Date(entries[0].createdAt).toLocaleDateString('es-ES', { weekday: 'short', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    )}
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
                    onClick={() => router.push('/journal')}
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

          </div>

          {/* Columna derecha */}
          <div className="space-y-6 md:space-y-8">

            {/* Resumen semanal dinámico */}
            <section className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-lg p-5 sm:p-6">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                Tu semana emocional
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Así te has sentido los últimos 7 días.
              </p>
              <div className="grid grid-cols-7 gap-2 text-center text-[10px]">
                {weeklyData.map((d, idx) => {
                  const entry = d.entries[0] // Tomamos la última de ese día si hay varias
                  return (
                    <div
                      key={idx}
                      className="group relative flex flex-col items-center gap-1 bg-gray-50 rounded-xl py-2 cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-gray-500 font-bold">{d.dayLabel}</span>
                      {entry ? (
                        <>
                          <span className="text-lg relative z-10">{EMOTION_ICONS[entry.emotion]?.emoji}</span>

                          {/* Tooltip con detalles del diario */}
                          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-white p-3 rounded-xl shadow-xl z-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-gray-100 hidden group-hover:block">
                            <div className="flex items-center gap-2 mb-1 border-b border-gray-50 pb-1">
                              <span className="text-lg">{EMOTION_ICONS[entry.emotion]?.emoji}</span>
                              <span className={`text-xs font-bold capitalize ${EMOTION_ICONS[entry.emotion]?.color}`}>
                                {entry.emotion}
                              </span>
                            </div>
                            <p className="text-[10px] text-gray-600 line-clamp-3 text-left leading-relaxed italic">
                              "{entry.notes}"
                            </p>
                            <div className="mt-1 text-[9px] text-gray-400 text-right">
                              {new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-r border-b border-gray-100"></div>
                          </div>
                        </>
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-gray-200/50 mt-1"></div>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>

            {/* Diario reciente dinámico */}
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

              {entries.length === 0 ? (
                <div className="text-center py-6 text-gray-400">
                  <p className="text-xs mb-2">Aún no has escrito nada.</p>
                  <Link href="/journal" className="text-xs text-emerald-600 font-bold hover:underline">¡Escribe tu primera entrada!</Link>
                </div>
              ) : (
                <ul className="space-y-2">
                  {entries.slice(0, 2).map(entry => (
                    <li key={entry.id} className="bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">
                          {new Date(entry.createdAt).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric' })}
                        </p>
                        <span className="text-sm">{EMOTION_ICONS[entry.emotion]?.emoji}</span>
                      </div>
                      <p className="text-xs text-gray-800 line-clamp-2 italic opacity-90">
                        “{entry.notes}”
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Atajos / seguridad (igual) */}
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
                servicios de emergencia de tu localidad.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
