// src/lib/recursos.ts
import { supabase } from '@/lib/supabaseClient'

export type EmotionId =
  | 'ansioso'
  | 'triste'
  | 'estresado'
  | 'cansado'
  | 'abrumado'
  | 'confundido'
  | 'desmotivado'
  | 'curioso'

type DBRecursoEducativo = {
  id_recurso: number
  tipo_recurso: string
  id_meditacion: number | null
  id_test: number | null
  titulo: string
  descripcion: string | null
  duracion_estimada_min: number | null
  nivel_dificultad: string | null
  categoria_visual: string | null
  imagen_portada: string | null
  url_externa: string | null
  ruta_app: string | null
  destacado: boolean | null
  activo: boolean | null
}

type DBRecursoEmocion = {
  id_recurso: number
  emocion: string
  peso: number
}

export type RecursoUI = {
  id: number
  title: string
  description: string
  type: 'Artículo' | 'Audio' | 'Video' | 'Herramienta' | 'Ruta'
  duration: string
  category: string
  difficulty: string
  emotions: EmotionId[]
  url_externa?: string | null
  ruta_app?: string | null
  destacado: boolean
}

// Mapea los valores de tipo_recurso de la BD a etiquetas amigables
const MAP_TIPO: Record<string, RecursoUI['type']> = {
  articulo: 'Artículo',
  audio: 'Audio',
  video: 'Video',
  herramienta: 'Herramienta',
  ruta: 'Ruta',
}

export async function fetchRecursosFromSupabase(): Promise<RecursoUI[]> {
  // 1. Recursos educativos
  const { data: recursos, error } = await supabase
    .from('recursos_educativos')
    .select('*')
    .eq('activo', true)
    .order('id_recurso', { ascending: true })

  if (error) {
    console.error('Error cargando recursos_educativos', error)
    throw error
  }

  // 2. Emociones asociadas
  const { data: emociones, error: emoError } = await supabase
    .from('recursos_emociones')
    .select('*')

  if (emoError) {
    console.error('Error cargando recursos_emociones', emoError)
    throw emoError
  }

  const emoMap = new Map<number, EmotionId[]>()
  ;(emociones || []).forEach((e: DBRecursoEmocion) => {
    const list = emoMap.get(e.id_recurso) ?? []
    const value = e.emocion as EmotionId
    if (!list.includes(value)) list.push(value)
    emoMap.set(e.id_recurso, list)
  })

  // 3. Mapear a formato que usa tu UI
  return (recursos || []).map((r: DBRecursoEducativo) => ({
    id: r.id_recurso,
    title: r.titulo,
    description: r.descripcion ?? '',
    type: MAP_TIPO[r.tipo_recurso] ?? 'Artículo',
    duration: r.duracion_estimada_min
      ? `${r.duracion_estimada_min} min`
      : 'Sin estimar',
    category: r.categoria_visual ?? 'General',
    difficulty: r.nivel_dificultad ?? 'Todos',
    emotions: emoMap.get(r.id_recurso) ?? [],
    url_externa: r.url_externa,
    ruta_app: r.ruta_app,
    destacado: !!r.destacado,
  }))
}
