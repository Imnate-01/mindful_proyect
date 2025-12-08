'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { User, Mail, Calendar, LogOut, Camera, Shield, Zap, Award, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { useUser } from '@/context/UserContext'

export default function ProfilePage() {
  const router = useRouter()
  // Use context for user data
  const { user, profile, loading, refreshProfile } = useUser()

  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Redirect if not logged in
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

      // 1. Optimistic UI: Show preview immediately
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
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // 4. Update Profile in DB
      const { error: updateError } = await supabase
        .from('perfiles_usuario')
        .update({ avatar_url: publicUrl })
        .eq('id_usuario', user.id)

      if (updateError) {
        throw updateError
      }

      // 5. Refresh Context to update Header and this page
      await refreshProfile()

      // Clear preview after successful sync
      setImagePreview(null)

    } catch (error) {
      console.error('Error uploading avatar:', error)
      alert('Error actualizando el avatar. Inténtalo de nuevo.')
      setImagePreview(null) // Revert on failure
    } finally {
      setUploading(false)
    }
  }

  // Loading Screen
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

  // Data preparation using Context Profile
  const fullName = profile?.nombre_completo || 'Estudiante'
  const displayEmail = profile?.email || user?.email || ''

  // Logic: Priority to Preview -> then Profile DB -> then null
  const currentAvatarUrl = imagePreview || profile?.avatar_url

  const displayInitial = fullName ? fullName[0].toUpperCase() : (displayEmail?.[0]?.toUpperCase() || 'U')

  // Format date safely
  let joinDate = 'Fecha desconocida'
  if (user?.created_at) {
    joinDate = new Date(user.created_at).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
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

          {/* Avatar Section (Overlapping) */}
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

                {/* Loading Overlay */}
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm z-10">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute bottom-1 right-1 p-2.5 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors shadow-lg ring-4 ring-white disabled:opacity-70 disabled:cursor-not-allowed group-hover:scale-110 active:scale-95 duration-200 z-20"
                title="Cambiar foto"
              >
                <Camera className="w-4 h-4" />
              </button>

              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          {/* User Info */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">{fullName}</h1>
            <p className="text-gray-500 font-medium">{displayEmail}</p>
            <div className="flex items-center justify-center gap-2 mt-2 text-sm text-gray-400">
              <Calendar className="w-3 h-3" />
              <span>Miembro desde {joinDate}</span>
            </div>
          </div>

          {/* Stats Grid */}
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

          {/* Actions / Logout */}
          <div className="space-y-3">
            <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center">
              <p className="text-sm text-gray-500">Más configuraciones próximamente</p>
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