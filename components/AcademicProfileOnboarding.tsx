'use client'

import { useEffect, useState } from 'react'
import { GraduationCap, X, Loader2 } from 'lucide-react'
import { useAcademicProfile } from '@/hooks/useAcademicProfile'

type Props = {
  userId: string
  onCompleted: () => void
  onSkip: () => void
}

type SchoolOption = {
  id: string
  name: string
  careers: string[]
}

const SCHOOL_OPTIONS: SchoolOption[] = [
  {
    id: 'escom_ipn',
    name: 'ESCOM - IPN',
    careers: [
      'Ingeniería en Sistemas Computacionales',
      'Licenciatura en Ciencia de Datos',
      'Ingeniería en Inteligencia Artificial',
    ],
  },
  {
    id: 'upiita_ipn',
    name: 'UPIITA - IPN',
    careers: [
      'Ingeniería Telemática',
      'Ingeniería Mecatrónica',
      'Ingeniería en Energía',
    ],
  },
  {
    id: 'fes_aragon_unam',
    name: 'FES Aragón - UNAM',
    careers: [
      'Ingeniería en Computación',
      'Psicología',
      'Derecho',
      'Pedagogía',
    ],
  },
  {
    id: 'other',
    name: 'Otra institución',
    careers: ['Otra carrera'],
  },
]

export default function AcademicProfileOnboarding({
  userId,
  onCompleted,
  onSkip,
}: Props) {
  const {
    profile,
    saveProfile,
    saving,
    error,
  } = useAcademicProfile(userId)

  const [schoolId, setSchoolId] = useState<string>('')
  const [career, setCareer] = useState<string>('')
  const [customSchool, setCustomSchool] = useState<string>('')
  const [customCareer, setCustomCareer] = useState<string>('')
  const [semester, setSemester] = useState<number | ''>('')

  // Prefill si ya tiene perfil académico
  useEffect(() => {
    if (!profile) return

    // intentar mapear la escuela a una opción conocida por nombre
    const matchedSchool = SCHOOL_OPTIONS.find(
      (s) => s.name.toLowerCase() === profile.escuela?.toLowerCase()
    )

    if (matchedSchool) {
      setSchoolId(matchedSchool.id)
      setCareer(profile.carrera || '')
    } else {
      setSchoolId('other')
      setCustomSchool(profile.escuela || '')
      setCustomCareer(profile.carrera || '')
    }

    setSemester(profile.semestre || '')
  }, [profile])

  const selectedSchool = SCHOOL_OPTIONS.find((s) => s.id === schoolId)
  const careerOptions = selectedSchool?.careers ?? []

  const isOtherSchool = schoolId === 'other'
  const isOtherCareer = isOtherSchool || career === 'Otra carrera'

  const resolvedEscuela = isOtherSchool
    ? customSchool.trim()
    : selectedSchool?.name ?? ''

  const resolvedCarrera = isOtherCareer
    ? customCareer.trim()
    : career

  const isFormValid =
    !!resolvedEscuela &&
    !!resolvedCarrera &&
    semester !== '' &&
    Number(semester) >= 1 &&
    Number(semester) <= 20

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return

    await saveProfile({
      escuela: resolvedEscuela,
      carrera: resolvedCarrera,
      semestre: Number(semester),
    })

    onCompleted()
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/55 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-xl rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header decorativo */}
        <div className="relative h-28 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
          <div className="relative z-10 flex items-center justify-between px-6 pt-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/90 flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-50/90">
                  Paso adicional
                </p>
                <h2 className="text-base sm:text-lg font-semibold text-white">
                  Completa tu contexto académico
                </h2>
              </div>
            </div>
            <button
              type="button"
              onClick={onSkip}
              className="rounded-full p-1.5 bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Omitir"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Cuerpo */}
        <form onSubmit={handleSubmit} className="px-6 pb-5 pt-4 space-y-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            Esta información se usa de forma anónima para entender mejor la realidad
            de los estudiantes (carrera, escuela, semestre) y adaptar los recursos de
            bienestar. No se comparte con terceros.
          </p>

          {/* Select Escuela */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-800">
              Escuela / institución
            </label>
            <div className="relative">
              <select
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                value={schoolId}
                onChange={(e) => {
                  setSchoolId(e.target.value)
                  setCareer('')
                  setCustomSchool('')
                  setCustomCareer('')
                }}
              >
                <option value="">Selecciona tu escuela</option>
                {SCHOOL_OPTIONS.map((school) => (
                  <option key={school.id} value={school.id}>
                    {school.name}
                  </option>
                ))}
              </select>
            </div>

            {isOtherSchool && (
              <input
                type="text"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                placeholder="Escribe el nombre de tu escuela"
                value={customSchool}
                onChange={(e) => setCustomSchool(e.target.value)}
              />
            )}
          </div>

          {/* Select Carrera */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-800">
              Carrera
            </label>

            {!isOtherSchool && (
              <div className="relative">
                <select
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  value={career}
                  onChange={(e) => setCareer(e.target.value)}
                  disabled={!schoolId}
                >
                  <option value="">
                    {schoolId
                      ? 'Selecciona tu carrera'
                      : 'Primero selecciona una escuela'}
                  </option>
                  {careerOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                  {schoolId && (
                    <option value="Otra carrera">Otra carrera</option>
                  )}
                </select>
              </div>
            )}

            {isOtherCareer && (
              <input
                type="text"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                placeholder="Escribe el nombre de tu carrera"
                value={customCareer}
                onChange={(e) => setCustomCareer(e.target.value)}
              />
            )}
          </div>

          {/* Semestre */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-800">
              Semestre actual
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                max={20}
                className="w-24 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                value={semester}
                onChange={(e) =>
                  setSemester(e.target.value ? Number(e.target.value) : '')
                }
              />
              <p className="text-[11px] text-slate-500">
                Nos ayuda a ver cómo cambia el bienestar a lo largo de la carrera.
              </p>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-500">
              {error}
            </p>
          )}

          {/* Footer botones */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onSkip}
              className="text-[11px] text-slate-400 hover:text-slate-600 underline underline-offset-4"
            >
              Omitir por ahora
            </button>

            <button
              type="submit"
              disabled={!isFormValid || saving}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              Guardar y continuar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
