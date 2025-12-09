'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  Book,
  Headphones,
  Video,
  Heart,
  Brain,
  Coffee,
  Moon,
  Zap,
  Search,
  Clock,
  Bookmark,
  Play,
  ChevronRight,
  Target,
  X,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { fetchRecursosFromSupabase, RecursoUI } from '@/lib/recursos'

// ====== CONFIGURACIÓN UI ======

const types = ['Todos', 'Artículo', 'Audio', 'Video', 'Herramienta', 'Ruta']

const emotionsList = [
  { id: 'ansioso', label: 'Ansioso/a', icon: '😰', color: 'from-red-400 to-orange-400' },
  { id: 'triste', label: 'Triste', icon: '😢', color: 'from-blue-400 to-indigo-400' },
  { id: 'estresado', label: 'Estresado/a', icon: '😫', color: 'from-purple-400 to-pink-400' },
  { id: 'cansado', label: 'Cansado/a', icon: '😴', color: 'from-gray-400 to-slate-400' },
  { id: 'abrumado', label: 'Abrumado/a', icon: '🤯', color: 'from-amber-400 to-red-400' },
  { id: 'confundido', label: 'Confundido/a', icon: '😕', color: 'from-yellow-400 to-orange-400' },
  { id: 'desmotivado', label: 'Desmotivado/a', icon: '😞', color: 'from-slate-400 to-gray-500' },
  { id: 'curioso', label: 'Curioso/a', icon: '🤔', color: 'from-emerald-400 to-teal-400' },
]

// Emoji / gradiente según tipo de recurso
const typeConfig: Record<
  RecursoUI['type'],
  { emoji: string; gradient: string }
> = {
  Artículo: { emoji: '📚', gradient: 'from-emerald-500 to-teal-500' },
  Audio: { emoji: '🎧', gradient: 'from-purple-500 to-pink-500' },
  Video: { emoji: '🎥', gradient: 'from-blue-500 to-cyan-500' },
  Herramienta: { emoji: '🧰', gradient: 'from-amber-500 to-orange-500' },
  Ruta: { emoji: '🛤️', gradient: 'from-indigo-500 to-purple-500' },
}

export default function RecursosPage() {
  const router = useRouter()

  const [recursos, setRecursos] = useState<RecursoUI[]>([])
  const [loadingRecursos, setLoadingRecursos] = useState(true)
  const [errorRecursos, setErrorRecursos] = useState<string | null>(null)

  const [selectedType, setSelectedType] = useState('Todos')
  const [searchQuery, setSearchQuery] = useState('')
  const [showEmotionMatcher, setShowEmotionMatcher] = useState(false)
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null)
  const [showWheelOfEmotions, setShowWheelOfEmotions] = useState(false)

  const resultsRef = useRef<HTMLDivElement>(null)

  // Favoritos persistidos en localStorage
  const [favorites, setFavorites] = useState<number[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('resources_favorites')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  useEffect(() => {
    localStorage.setItem('resources_favorites', JSON.stringify(favorites))
  }, [favorites])

  // Cargar recursos desde Supabase
  useEffect(() => {
    async function load() {
      try {
        setLoadingRecursos(true)
        const data = await fetchRecursosFromSupabase()
        setRecursos(data)
      } catch (err) {
        console.error('No se pudieron cargar los recursos', err)
        setErrorRecursos(
          'No pudimos cargar la biblioteca de recursos en este momento. Inténtalo más tarde.',
        )
      } finally {
        setLoadingRecursos(false)
      }
    }
    load()
  }, [])

  // Filtros
  const filteredRecursos = recursos.filter((recurso) => {
    const matchesType = selectedType === 'Todos' || recurso.type === selectedType
    const matchesSearch =
      recurso.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recurso.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesEmotion =
      !selectedEmotion || recurso.emotions.includes(selectedEmotion as any)

    return matchesType && matchesSearch && matchesEmotion
  })

  const toggleFavorite = (recursoId: number) => {
    setFavorites((prev) =>
      prev.includes(recursoId)
        ? prev.filter((id) => id !== recursoId)
        : [...prev, recursoId],
    )
  }

  const handleEmotionSelect = (emotionId: string) => {
    setSelectedEmotion(emotionId)
    setShowEmotionMatcher(false)
    setShowWheelOfEmotions(false)

    // Scroll suave a resultados
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const clearFilters = () => {
    setSelectedType('Todos')
    setSearchQuery('')
    setSelectedEmotion(null)
  }

  const openRecurso = (recurso: RecursoUI) => {
    if (recurso.ruta_app) {
      router.push(recurso.ruta_app)
    } else if (recurso.url_externa) {
      window.open(recurso.url_externa, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8 px-4 pb-24">
      <style jsx>{`
        @keyframes pulse-glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(244, 63, 94, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(244, 63, 94, 0.6);
          }
        }
        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Biblioteca de Recursos
              </h1>
              <p className="text-gray-600 text-lg">
                Guías, herramientas y contenidos de calidad para tu bienestar emocional.
              </p>
            </div>

            <button
              onClick={() => setShowEmotionMatcher(true)}
              className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2 animate-pulse-glow"
            >
              <Heart className="w-5 h-5" />
              ¿Cómo te sientes hoy?
            </button>
          </div>

          {/* Banner de emoción seleccionada */}
          {selectedEmotion && (
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">
                  {emotionsList.find((e) => e.id === selectedEmotion)?.icon}
                </span>
                <div>
                  <p className="text-sm text-gray-600">Mostrando recursos para:</p>
                  <p className="font-bold text-gray-900 text-lg">
                    {emotionsList.find((e) => e.id === selectedEmotion)?.label}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEmotion(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium text-gray-700 transition-all text-sm"
              >
                Ver todos los recursos
              </button>
            </div>
          )}
        </div>

        {/* Barra de búsqueda + filtros */}
        <div
          ref={resultsRef}
          className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/20 shadow-lg mb-8 sticky top-4 z-30"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar artículos, audios, videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-white/50"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all text-sm md:text-base ${
                    selectedType === type
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Herramientas destacadas (hardcodeadas pero útiles) */}
        {!selectedEmotion && !searchQuery && selectedType === 'Todos' && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="w-6 h-6 text-amber-600" />
              Herramientas Interactivas
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div
                onClick={() => setShowWheelOfEmotions(true)}
                className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl p-6 text-white cursor-pointer hover:scale-105 transition-all shadow-lg hover:shadow-2xl flex flex-col justify-between h-full"
              >
                <div>
                  <div className="text-5xl mb-3">🎯</div>
                  <h3 className="text-xl font-bold mb-2">Rueda de Emociones</h3>
                  <p className="text-pink-100 text-sm">
                    Explora y entiende tus emociones complejas.
                  </p>
                </div>
                <div className="mt-4 flex justify-end">
                  <span className="bg-white/20 p-2 rounded-full">
                    <ChevronRight className="w-5 h-5" />
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white cursor-pointer hover:scale-105 transition-all shadow-lg hover:shadow-2xl flex flex-col justify-between h-full">
                <div>
                  <div className="text-5xl mb-3">🧠</div>
                  <h3 className="text-xl font-bold mb-2">Registro de Pensamientos</h3>
                  <p className="text-amber-100 text-sm">
                    Identifica patrones de pensamiento negativos.
                  </p>
                </div>
                <div className="mt-4 flex justify-end">
                  <span className="bg-white/20 p-2 rounded-full">
                    <ChevronRight className="w-5 h-5" />
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white cursor-pointer hover:scale-105 transition-all shadow-lg hover:shadow-2xl flex flex-col justify-between h-full">
                <div>
                  <div className="text-5xl mb-3">💨</div>
                  <h3 className="text-xl font-bold mb-2">Entrenador de Respiración</h3>
                  <p className="text-blue-100 text-sm">
                    Practica técnicas de respiración guiadas.
                  </p>
                </div>
                <div className="mt-4 flex justify-end">
                  <span className="bg-white/20 p-2 rounded-full">
                    <ChevronRight className="w-5 h-5" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Estado de carga / error */}
        {loadingRecursos && (
          <div className="text-center py-10 text-gray-500">
            Cargando recursos…
          </div>
        )}

        {errorRecursos && !loadingRecursos && (
          <div className="text-center py-6 mb-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl">
            {errorRecursos}
          </div>
        )}

        {/* Título de sección */}
        {!loadingRecursos && !errorRecursos && (
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-emerald-600" />
              {selectedEmotion
                ? 'Recursos recomendados'
                : searchQuery
                ? 'Resultados de búsqueda'
                : 'Todos los recursos'}
            </h2>
          </div>
        )}

        {/* Grid de recursos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecursos.map((recurso) => {
            const cfg = typeConfig[recurso.type] ?? typeConfig['Artículo']

            return (
              <div
                key={recurso.id}
                className="group bg-white/90 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/20 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Header */}
                <div
                  className={`h-32 bg-gradient-to-br ${cfg.gradient} p-6 flex items-center justify-between relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-white/10 group-hover:bg-white/0 transition-all" />
                  <div className="relative z-10 flex items-center gap-3">
                    <div className="text-4xl bg-white/20 w-12 h-12 flex items-center justify-center rounded-xl backdrop-blur-md">
                      {cfg.emoji}
                    </div>
                    <span className="inline-block px-3 py-1 bg-white/30 backdrop-blur-xl rounded-full text-white text-xs font-medium">
                      {recurso.type}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleFavorite(recurso.id)}
                    className="relative z-10 w-10 h-10 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-white/40 transition-all active:scale-90"
                  >
                    <Bookmark
                      className={`w-5 h-5 transition-colors ${
                        favorites.includes(recurso.id)
                          ? 'fill-white text-white'
                          : 'text-white'
                      }`}
                    />
                  </button>
                </div>

                {/* Contenido */}
                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="inline-block px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-xs font-medium">
                      {recurso.category}
                    </span>
                    <span className="inline-block px-2 py-1 bg-gray-50 text-gray-600 border border-gray-100 rounded-lg text-xs font-medium">
                      {recurso.difficulty}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight min-h-[3.5rem]">
                    {recurso.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 min-h-[3.5rem]">
                    {recurso.description}
                  </p>

                  <div className="flex items-center gap-4 mb-5 text-xs font-medium text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{recurso.duration}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => openRecurso(recurso)}
                    className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-60"
                    disabled={!recurso.url_externa && !recurso.ruta_app}
                  >
                    {recurso.type === 'Video' || recurso.type === 'Audio' ? (
                      <>
                        <Play className="w-4 h-4" /> Abrir recurso
                      </>
                    ) : recurso.type === 'Herramienta' ? (
                      <>
                        <Zap className="w-4 h-4" /> Abrir herramienta
                      </>
                    ) : (
                      <>
                        <Book className="w-4 h-4" /> Ver recurso
                      </>
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty state */}
        {!loadingRecursos && !errorRecursos && filteredRecursos.length === 0 && (
          <div className="text-center py-20 bg-white/50 rounded-3xl border border-dashed border-gray-300 mt-6">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              No encontramos recursos
            </h3>
            <p className="text-gray-600 mb-6">
              Prueba ajustando tus filtros o tu búsqueda.
            </p>
            <button
              onClick={clearFilters}
              className="text-emerald-600 font-medium hover:underline px-6 py-2 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
            >
              Limpiar todos los filtros
            </button>
          </div>
        )}
      </div>

      {/* MODAL: selector de emoción */}
      {showEmotionMatcher && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setShowEmotionMatcher(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Heart className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                ¿Cómo te sientes hoy?
              </h2>
              <p className="text-gray-600 text-sm md:text-base">
                Selecciona tu emoción y te recomendaremos contenido.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
              {emotionsList.map((emotion) => (
                <button
                  key={emotion.id}
                  onClick={() => handleEmotionSelect(emotion.id)}
                  className={`p-4 rounded-2xl border-2 hover:scale-105 transition-all text-center group ${
                    selectedEmotion === emotion.id
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-100 hover:border-emerald-200 bg-white'
                  }`}
                >
                  <div className="text-3xl md:text-4xl mb-2 group-hover:scale-110 transition-transform">
                    {emotion.icon}
                  </div>
                  <p className="font-semibold text-gray-900 text-xs md:text-sm">
                    {emotion.label}
                  </p>
                </button>
              ))}
            </div>

            <div className="mt-8 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
              <p className="text-xs md:text-sm text-gray-700 text-center">
                💡 <strong>Tip:</strong> Todas las emociones son válidas. Identificarlas es el
                primer paso.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: rueda de emociones */}
      {showWheelOfEmotions && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full relative shadow-2xl">
            <button
              onClick={() => setShowWheelOfEmotions(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-1">Rueda de Emociones</h2>
              <p className="text-gray-500 text-sm">
                Toca el sentimiento que más resuene contigo.
              </p>
            </div>

            <div className="relative w-full aspect-square max-w-[300px] mx-auto mb-6">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-rose-100 to-teal-100 opacity-60 animate-spin-slow" />
              <div className="absolute inset-8 rounded-full bg-white/80 backdrop-blur-sm z-0" />

              <div className="absolute inset-0 flex items-center justify-center z-0">
                <div className="text-center">
                  <div className="text-3xl mb-1">🎯</div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Elige
                  </span>
                </div>
              </div>

              {emotionsList.slice(0, 6).map((emotion, index) => {
                const total = 6
                const angle = (index * (360 / total)) * (Math.PI / 180)
                const radius = 42
                const x = 50 + radius * Math.cos(angle - Math.PI / 2)
                const y = 50 + radius * Math.sin(angle - Math.PI / 2)

                return (
                  <button
                    key={emotion.id}
                    onClick={() => handleEmotionSelect(emotion.id)}
                    className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center text-2xl md:text-3xl border border-gray-100 z-10"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    title={emotion.label}
                  >
                    {emotion.icon}
                  </button>
                )
              })}
            </div>

            <p className="text-center text-xs text-gray-400">
              Inspirado en la rueda de emociones de Plutchik.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
