'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { Heart, Sparkles, Mail, Lock, ArrowRight, Menu, X } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    async function handleGoogleLogin() {
    setErrorMsg(null)

    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/home`, // después de loguearse
        },
      })

      if (error) {
        setErrorMsg(error.message)
      }
      // Supabase se encarga del redirect
    } catch (err) {
      setErrorMsg('No se pudo iniciar sesión con Google. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }


  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErrorMsg(null)

    if (!email || !password) {
      setErrorMsg('Por favor ingresa tu correo y contraseña.')
      return
    }

    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setErrorMsg(error.message)
        return
      }

      router.push('/home')
    } catch (err) {
      setErrorMsg('Ocurrió un error inesperado. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 overflow-x-hidden">
      {/* Animaciones globales (mismas que tu landing) */}
      <style jsx global>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }

        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        .animate-breathe { animation: breathe 4s ease-in-out infinite; }
      `}</style>

      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-20 -left-20 md:left-10 w-72 md:w-96 h-72 md:h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 -right-20 md:right-10 w-72 md:w-96 h-72 md:h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-1/2 w-72 md:w-96 h-72 md:h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* NAV: mismo estilo que landing pero simple */}
      <nav className="relative z-20 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
             <Heart className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <span className="font-bold text-lg md:text-xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                iNerzia Mind
            </span>
            </Link>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-4">
           
            <Link
              href="/register"
              className="px-5 py-2 bg-white text-gray-800 rounded-full text-sm font-semibold border border-gray-200 hover:shadow-md hover:scale-105 transition-all"
            >
              Crear cuenta
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setIsMobileMenuOpen((v) => !v)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/90 backdrop-blur-xl border-t border-gray-100 shadow-lg px-4 py-3 space-y-2">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-medium text-gray-700 hover:text-emerald-600"
            >
              Volver al inicio
            </Link>
            <Link
              href="/register"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full text-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-sm font-semibold"
            >
              Crear cuenta
            </Link>
          </div>
        )}
      </nav>

      {/* CONTENIDO */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10 md:pt-10">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Lado izquierdo: mensaje emocional */}
          <div className="space-y-6 md:space-y-8 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="text-xs sm:text-sm font-medium text-emerald-700">
                Bienvenida a tu espacio seguro
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-gray-900">
              <span className="block">Inicia sesión para</span>
              <span className="block bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                continuar tu camino de calma
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-600 max-w-lg mx-auto md:mx-0">
              Recupera tu diario emocional, tus meditaciones favoritas y tus avances.
              Este es un espacio para pausar, respirar y seguir avanzando a tu ritmo.
            </p>

            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <div className="flex items-center gap-2 bg-white/70 border border-emerald-100 rounded-full px-4 py-2 text-xs sm:text-sm text-gray-700">
                <Heart className="w-4 h-4 text-emerald-500" />
                <span>Pensado para estudiantes</span>
              </div>
              <div className="flex items-center gap-2 bg-white/70 border border-teal-100 rounded-full px-4 py-2 text-xs sm:text-sm text-gray-700">
                <Sparkles className="w-4 h-4 text-teal-500" />
                <span>Sesiones rápidas y prácticas</span>
              </div>
            </div>
          </div>

          {/* Lado derecho: tarjeta de login */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-3xl blur-3xl opacity-30 animate-breathe" />

            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/40">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Inicia sesión 💚
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Ingresa tus datos para acceder al panel de iNerzia Mind.
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center animate-float">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>

              {errorMsg && (
                <div className="mb-4 text-xs sm:text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Correo institucional o personal
                  </label>
                  <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      className="flex-1 py-2 text-sm focus:outline-none bg-transparent"
                      placeholder="tucorreo@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Contraseña
                  </label>
                  <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3">
                    <Lock className="w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="flex-1 py-2 text-sm focus:outline-none bg-transparent"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="text-[11px] sm:text-xs text-emerald-600 font-medium hover:text-emerald-700"
                    >
                      {showPassword ? 'Ocultar' : 'Ver'}
                    </button>

                    {/* Separador */}
                    <div className="flex items-center gap-3 my-4">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-[11px] sm:text-xs text-gray-500">o continúa con</span>
                    <div className="flex-1 h-px bg-gray-200" />
                    </div>

                  </div>
                </div>

                

                {/* CTA */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center gap-2 hover:shadow-lg hover:scale-[1.01] transition-all disabled:opacity-70 disabled:hover:scale-100"
                >
                  {loading ? (
                    'Ingresando…'
                  ) : (
                    <>
                      Entrar a mi espacio
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}

                </button>
                    {/* Botón Google */}
                    <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full py-3 bg-white text-gray-800 rounded-xl border border-gray-200 font-semibold text-sm sm:text-base flex items-center justify-center gap-2 hover:shadow-md hover:scale-[1.01] transition-all"
                    disabled={loading}
                    >
                    <img
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        alt="Google"
                        className="w-5 h-5"
                    />
                    <span>Continuar con Google</span>
                    </button>

              </form>
                  
           

              <p className="mt-4 text-[11px] sm:text-xs text-center text-gray-500">
                ¿Aún no tienes cuenta?{' '}
                <Link href="/register" className="font-medium text-emerald-600 hover:text-emerald-700">
                  Crear una nueva cuenta
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}