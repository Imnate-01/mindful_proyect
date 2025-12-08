'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  User,
  Mail,
  Calendar,
  LogOut,
  Camera,
  Shield,
  Zap,
  Award,
  Loader2,
} from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { useUser } from '@/context/UserContext'

// 👇 nuevo import
import { useAcademicProfile } from '@/hooks/useAcademicProfile'

export default function ProfilePage() {
  const router = useRouter()
  const { user, profile, loading, refreshProfile } = useUser()

  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 👇 estado local para el formulario académico
  const [escuela, setEscuela] = useState('')
  const [carrera, setCarrera] = useState('')
  const [semestre, setSemestre] = useState<number | ''>('')

  const {
    profile: academicProfile,
    loading: loadingAcademic,
    saving: savingAcademic,
    error: academicError,
    saveProfile: saveAcademicProfile,
  } = useAcademicProfile(user?.id)

  // Redirect si no hay usuario
  if (!loading && !user) {
    router.push('/login')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
    router.replace('/login')
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return
      }

      if (!user) return

      const file = event.target.files[0]

      // 1. Optimistic UI: preview
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
      setUploading(true)

      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      // 2. Upload to Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      // 3. Get Public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('avatars').getPublicUrl(filePath)

      // 4. Update Profile in DB
      const { error: updateError } = await supabase
        .from('perfiles_usuario')
        .update({ avatar_url: publicUrl })
        .eq('id_usuario', user.id)

      if (updateError) {
        throw updateError
      }

      // 5. Refresh Context
      await refreshProfile()

      setImagePreview(null)
    } catch (error) {
      console.error('Error uploading avatar:', error)
      alert('Error actualizando el avatar. Inténtalo de nuevo.')
      setImagePreview(null)
    } finally {
      setUploading(false)
    }
  }

  // Cargar datos académicos en el formulario cuando lleguen de la BD
  useEffect(() => {
    if (academicProfile) {
      setEscuela(academicProfile.escuela || '')
      setCarrera(academicProfile.carrera || '')
      setSemestre(academicProfile.semestre || '')
    }
  }, [academicProfile])

  const handleSaveAcademic = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !escuela || !carrera || !semestre) return

    await saveAcademicProfile({
      escuela,
      carrera,
      semestre: Number(semestre),
    })

    // aquí podrías mostrar un toast si usas alguna lib de UI
  }

  // Loading general
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-emerald-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-emerald-100 rounded"></div>
        </div>
      </div>
    )
  }

  const fullName = profile?.nombre_completo || 'Estudiante'
  const displayEmail = profile?.email || user?.email || ''
  const currentAvatarUrl = imagePreview || profile?.avatar_url
  const displayInitial = fullName
    ? fullName[0].toUpperCase()
    : displayEmail?.[0]?.toUpperCase() || 'U'

  let joinDate = 'Fecha desconocida'
  if (user?.created_at) {
    joinDate = new Date(user.created_at).toLocaleDateString('es-ES', {
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
      {/* Main Profile Card */}
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden relative">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-emerald-500 to-teal-500 relative">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]"></div>
        </div>

        {/* Content Body */}
        <div className="px-8 pb-8">
          {/* Avatar */}
          <div className="relative -mt-16 mb-6 flex justify-center">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full ring-4 ring-white shadow-lg bg-white flex items-center justify-center text-4xl font-bold text-emerald-600 overflow-hidden relative select-none">
                {currentAvatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={currentAvatarUrl}
                    alt="Avatar"
                    className="w-full h-full object-cover bg-white"
                  />
                ) : (
                  displayInitial
                )}

                {uploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm z-10">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                )}
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute bottom-1 right-1 p-2.5 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors shadow-lg ring-4 ring-white disabled:opacity-70 disabled:cursor-not-allowed group-hover:scale-110 active:scale-95 duration-200 z-20"
                title="Cambiar foto"
              >
                <Camera className="w-4 h-4" />
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          {/* Info básica */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">{fullName}</h1>
            <p className="text-gray-500 font-medium">{displayEmail}</p>
            <div className="flex items-center justify-center gap-2 mt-2 text-sm text-gray-400">
              <Calendar className="w-3 h-3" />
              <span>Miembro desde {joinDate}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-indigo-50 p-4 rounded-2xl text-center border border-indigo-100">
              <div className="mx-auto w-8 h-8 bg-white rounded-full flex items-center justify-center text-indigo-500 mb-2 shadow-sm">
                <Zap className="w-4 h-4" />
              </div>
              <p className="text-xl font-bold text-indigo-900">12</p>
              <p className="text-xs text-indigo-600 font-medium">Sesiones</p>
            </div>

            <div className="bg-amber-50 p-4 rounded-2xl text-center border border-amber-100">
              <div className="mx-auto w-8 h-8 bg-white rounded-full flex items-center justify-center text-amber-500 mb-2 shadow-sm">
                <Award className="w-4 h-4" />
              </div>
              <p className="text-xl font-bold text-amber-900">3</p>
              <p className="text-xs text-amber-600 font-medium">Racha días</p>
            </div>

            <div className="bg-emerald-50 p-4 rounded-2xl text-center border border-emerald-100">
              <div className="mx-auto w-8 h-8 bg-white rounded-full flex items-center justify-center text-emerald-500 mb-2 shadow-sm">
                <Shield className="w-4 h-4" />
              </div>
              <p className="text-xl font-bold text-emerald-900">Nivel 2</p>
              <p className="text-xs text-emerald-600 font-medium">Explorador</p>
            </div>
          </div>

          {/* 🔹 Perfil académico */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-900 mb-2">
              Perfil académico
            </h2>
            <p className="text-xs text-gray-500 mb-3">
              Esta información se usa de forma anónima para entender mejor el contexto
              de los estudiantes y mejorar los recursos de bienestar.
            </p>

            <form
              onSubmit={handleSaveAcademic}
              className="space-y-3 bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-4"
            >
              <div className="grid gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Escuela / institución
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    placeholder="ESCOM IPN, FES Aragón, etc."
                    value={escuela}
                    onChange={(e) => setEscuela(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Carrera
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    placeholder="Ingeniería en Sistemas Computacionales, Psicología, etc."
                    value={carrera}
                    onChange={(e) => setCarrera(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Semestre actual
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    placeholder="6"
                    value={semestre}
                    onChange={(e) =>
                      setSemestre(e.target.value ? Number(e.target.value) : '')
                    }
                  />
                </div>
              </div>

              {academicError && (
                <p className="text-xs text-red-500">{academicError}</p>
              )}

              <div className="flex items-center justify-between pt-1">
                {academicProfile ? (
                  <p className="text-[11px] text-gray-500">
                    Última actualización de tu perfil académico guardada.
                  </p>
                ) : (
                  <p className="text-[11px] text-gray-500">
                    Aún no tenemos tu perfil académico completo.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={
                    savingAcademic || !escuela || !carrera || !semestre
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingAcademic && (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  )}
                  Guardar perfil académico
                </button>
              </div>
            </form>
          </div>

          {/* Extra / futuro + logout */}
          <div className="space-y-3">
            <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center">
              <p className="text-sm text-gray-500">
                Más configuraciones próximamente
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors font-bold border border-rose-100"
            >
              <LogOut className="w-4 h-4" /> Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
