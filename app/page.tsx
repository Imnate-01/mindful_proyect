'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Heart,
  Brain,
  Users,
  Calendar,
  Search,
  MessageCircle,
  Sparkles,
  ChevronDown,
  Play,
  Check,
  Star,
  Menu,
  X,
  Activity,
} from 'lucide-react';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const elements = document.querySelectorAll('.scroll-fade');
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
          el.classList.add('visible');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'Conócete emocionalmente',
      description:
        'Registros y autoevaluaciones breves para ponerle nombre a lo que sientes.',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Pausas conscientes',
      description:
        'Meditaciones y ejercicios sencillos para bajar la inercia del estrés diario.',
      color: 'from-teal-500 to-cyan-500',
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: 'Pequeños hábitos, gran cambio',
      description:
        'Rachas, recordatorios y espacio para construir tu propia rutina de autocuidado.',
      color: 'from-cyan-500 to-blue-500',
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: 'Puentes hacia ayuda profesional',
      description:
        'Información de centros y contactos de apoyo para cuando necesitas algo más que una app.',
      color: 'from-blue-500 to-indigo-500',
    },
  ];

  const scenarios = [
    {
      title: 'Antes de un examen importante',
      text: 'Usas iNerzia para hacer una pausa de respiración de 5 minutos, registrar cómo te sientes y llegar con un poco más de calma.',
      icon: <Activity className="w-6 h-6 text-emerald-500" />,
    },
    {
      title: 'Cuando todo se siente “demasiado”',
      text: 'Tomas el celular, abres iNerzia y escribes en tu diario lo que traes en la mente, sin juicios, solo para sacar el ruido.',
      icon: <MessageCircle className="w-6 h-6 text-teal-500" />,
    },
    {
      title: 'Buscando a quién acudir',
      text: 'Desde la app consultas información de centros y líneas de apoyo para dar el siguiente paso y pedir ayuda.',
      icon: <Search className="w-6 h-6 text-cyan-500" />,
    },
  ];

  const timelineSteps = [
    {
      year: 'Origen',
      title: 'La experiencia real de ser estudiante',
      text: 'iNerzia nace de noches de tareas, exámenes, ansiedad y esa sensación de ir en piloto automático. Más que una idea “de app”, nace de sentir que algo hacía falta para pausar.',
      tag: 'Punto de partida',
    },
    {
      year: 'Idea',
      title: 'De la primera ley de Newton a la salud mental',
      text: 'Si la inercia hace que un cuerpo siga en el mismo estado, iNerzia Mind busca ser ese pequeño empujón que rompe la rutina: un registro, una meditación, un recordatorio de que puedes pedir ayuda.',
      tag: 'Inercia → cambio',
    },
    {
      year: 'Diseño',
      title: 'Un espacio seguro, sin likes ni máscaras',
      text: 'El diseño de la app se centra en tres cosas: registrar cómo estás, ofrecer pausas sencillas y acercarte a recursos de apoyo sin juicios, métricas sociales ni presión de “ser productivo”.',
      tag: 'Espacio seguro',
    },
    {
      year: 'Futuro',
      title: 'Datos con sentido y comunidad',
      text: 'iNerzia quiere crecer con estudiantes: entender cómo influye la carga académica, el semestre, la carrera, y construir recursos que realmente respondan a esa realidad.',
      tag: 'Camino a largo plazo',
    },
  ];

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Estilos globales */}
      <style jsx global>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes breathe {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.05);
            opacity: 1;
          }
        }
        .animate-breathe {
          animation: breathe 4s ease-in-out infinite;
        }

        .scroll-fade {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .scroll-fade.visible {
          opacity: 1;
          transform: translateY(0);
        }

        @keyframes timelinePulse {
          0%,
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.35);
          }
          50% {
            transform: scale(1.08);
            box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);
          }
        }

        .timeline-dot {
          animation: timelinePulse 2.4s ease-out infinite;
        }
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

      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || isMobileMenuOpen
            ? 'bg-white/90 backdrop-blur-xl shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                <Heart className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg md:text-xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  iNerzia Mind
                </span>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              <a
                href="#inicio"
                className="text-gray-700 hover:text-emerald-600 font-medium transition-colors"
              >
                Inicio
              </a>
              <a
                href="#que-es"
                className="text-gray-700 hover:text-emerald-600 font-medium transition-colors"
              >
                ¿Qué es iNerzia?
              </a>
              <a
                href="#historia"
                className="text-gray-700 hover:text-emerald-600 font-medium transition-colors"
              >
                Historia
              </a>
              <a
                href="#caracteristicas"
                className="text-gray-700 hover:text-emerald-600 font-medium transition-colors"
              >
                Características
              </a>
              <a
                href="#escenarios"
                className="text-gray-700 hover:text-emerald-600 font-medium transition-colors"
              >
                Escenarios
              </a>
              <Link
                href="/login"
                className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all"
              >
                Entrar a la app
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:text-emerald-600 p-2"
              >
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 shadow-xl">
            <div className="flex flex-col space-y-4">
              <a
                href="#inicio"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-700 hover:text-emerald-600 font-medium"
              >
                Inicio
              </a>
              <a
                href="#que-es"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-700 hover:text-emerald-600 font-medium"
              >
                ¿Qué es iNerzia?
              </a>
              <a
                href="#historia"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-700 hover:text-emerald-600 font-medium"
              >
                Historia
              </a>
              <a
                href="#caracteristicas"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-700 hover:text-emerald-600 font-medium"
              >
                Características
              </a>
              <a
                href="#escenarios"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-700 hover:text-emerald-600 font-medium"
              >
                Escenarios
              </a>
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold text-center"
              >
                Entrar a iNerzia
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section
        id="inicio"
        className="relative min-h-screen flex flex-col justify-center px-4 pt-28 pb-12 md:pt-20"
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 md:space-y-8 fade-in-up text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">
                Una app creada desde la experiencia estudiantil
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              <span className="block text-gray-900">Detén tu inercia,</span>
              <span className="block bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                escucha cómo estás hoy.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-lg mx-auto md:mx-0">
              iNerzia Mind nace de una idea simple: si la primera ley de Newton
              habla de inercia, esta app quiere ser ese pequeño empujón que te
              ayuda a salir del piloto automático y cuidar tu salud mental a tu
              ritmo.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                href="/login"
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Entrar a iNerzia
              </Link>
              <a
                href="#que-es"
                className="px-8 py-4 bg-white text-gray-700 rounded-2xl font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all border-2 border-gray-200"
              >
                Conocer la idea
              </a>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 md:gap-6 pt-4">
              <p className="text-sm text-gray-600 max-w-xs">
                No es una app mágica. Es un espacio para registrar, respirar y,
                poco a poco, cambiar tu propia inercia.
              </p>
            </div>
          </div>

          {/* Right Content - Interactive Card */}
          <div className="relative mt-8 md:mt-0">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-3xl blur-3xl opacity-30 animate-breathe"></div>

            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 border border-white/20">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                    Un vistazo a tu día
                  </h3>
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center animate-float">
                    <Heart className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                </div>

                <p className="text-xs md:text-sm text-gray-500">
                  Imagina que abres iNerzia al final del día y eliges con qué
                  energía llegas:
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    '😊 Tranquilo/a',
                    '😰 Acelerado/a',
                    '😔 Cansado emocionalmente',
                    '😴 Agotado/a',
                  ].map((mood) => (
                    <div
                      key={mood}
                      className="p-3 md:p-4 bg-gray-50 border-2 border-transparent rounded-xl transition-all text-left text-xs md:text-sm text-gray-700"
                    >
                      {mood}
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1 text-sm md:text-base">
                        ¿Qué hace la app con esto?
                      </p>
                      <p className="text-xs md:text-sm text-gray-600">
                        Te propone una pausa corta, una reflexión o un recurso
                        según cómo dices que llegas. Sin juicios, sin presión.
                      </p>
                    </div>
                  </div>
                </div>

                <Link
                  href="/login"
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all text-sm md:text-base text-center"
                >
                  Empezar a usar iNerzia
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ¿Qué es iNerzia? */}
      <section id="que-es" className="py-16 md:py-20 px-4 relative">
        <div className="max-w-5xl mx-auto scroll-fade">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/40 p-6 md:p-10">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-gray-900">
              ¿Qué es iNerzia Mind?
            </h2>
            <p className="text-sm md:text-base text-gray-600 mb-4 leading-relaxed">
              El nombre viene de juntar dos ideas:
            </p>
            <ul className="space-y-3 text-sm md:text-base text-gray-700 mb-6">
              <li>
                <span className="font-semibold text-emerald-700">i</span> es
                el “I” en inglés, el yo. La parte de ti que siente, piensa y a
                veces no sabe cómo poner todo en palabras.
              </li>
              <li>
                <span className="font-semibold text-emerald-700">
                  Nerzia
                </span>{' '}
                viene de la inercia de la primera ley de Newton:{' '}
                <span className="italic">
                  “un cuerpo mantiene su estado a menos que algo actúe sobre
                  él”
                </span>
                .
              </li>
            </ul>
            <p className="text-sm md:text-base text-gray-700 mb-3 leading-relaxed">
              En la vida diaria esa “inercia” pueden ser hábitos, rutinas,
              pensamientos automáticos o semanas de estrés acumulado. iNerzia
              Mind no pretende ser una solución mágica, sino ese “algo” pequeño
              que actúa sobre tu inercia: una pausa, un registro, una
              meditación, un recordatorio de que puedes pedir ayuda.
            </p>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              La app está pensada especialmente para estudiantes, pero cualquier
              persona puede usarla como un espacio seguro para revisar cómo
              está, sin likes, sin métricas sociales, solo tú y tu proceso.
            </p>
          </div>
        </div>
      </section>

      {/* Línea del tiempo: historia de la idea */}
      <section id="historia" className="py-16 md:py-20 px-4 relative">
        <div className="max-w-5xl mx-auto scroll-fade">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3">
              La historia detrás de iNerzia Mind
            </h2>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
              No es solo un nombre bonito. Es el resultado de juntar ciencia,
              experiencia estudiantil y la necesidad de tener un lugar para
              pausar.
            </p>
          </div>

          <div className="relative">
            {/* Línea vertical */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 border-l-2 border-dashed border-emerald-200 pointer-events-none" />

            <div className="space-y-8 md:space-y-10">
              {timelineSteps.map((step, index) => {
                const isLeft = index % 2 === 0;
                return (
                  <div
                    key={step.title}
                    className={`
                      relative flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 scroll-fade
                    `}
                    style={{ transitionDelay: `${index * 120}ms` }}
                  >
                    {/* Punto de la línea */}
                    <div
                      className={`
                        absolute
                        left-4 md:left-1/2
                        -translate-x-1/2
                        w-5 h-5
                        rounded-full
                        bg-white
                        border-2 border-emerald-500
                        flex items-center justify-center
                        timeline-dot
                      `}
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    </div>

                    {/* Contenido de la tarjeta */}
                    <div
                      className={`
                        mt-6 md:mt-0
                        w-full md:w-1/2
                        ${
                          isLeft
                            ? 'md:pr-10 md:ml-0 md:mr-auto md:text-right'
                            : 'md:pl-10 md:mr-0 md:ml-auto md:text-left'
                        }
                      `}
                    >
                      <div className="inline-flex items-center gap-2 mb-2">
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-emerald-600">
                          {step.year}
                        </span>
                        <span className="hidden md:inline-block text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                          {step.tag}
                        </span>
                      </div>

                      <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-emerald-50 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 px-4 py-4 md:px-6 md:py-5">
                        <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-2">
                          {step.title}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                          {step.text}
                        </p>
                        <span className="inline-block mt-3 text-[10px] px-2 py-1 rounded-full bg-gray-50 text-gray-500 border border-gray-100 md:hidden">
                          {step.tag}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="caracteristicas" className="py-16 md:py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16 scroll-fade">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Piezas clave de iNerzia
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              No necesitas hacerlo todo perfecto. iNerzia se centra en darte
              pequeñas herramientas que puedas integrar en días reales.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="scroll-fade bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div
                  className={`w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-4 text-white`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mensaje emocional */}
      <section className="py-16 md:py-20 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center scroll-fade">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl p-8 md:p-16 text-white shadow-2xl relative">
            <div className="absolute inset-0 bg-white/10 rounded-3xl backdrop-blur-xl"></div>

            <div className="relative z-10">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>

              <h2 className="text-2xl md:text-4xl font-bold mb-6">
                No se trata de ser “fuerte”, se trata de no hacerlo solo.
              </h2>
              <p className="text-lg md:text-2xl leading-relaxed opacity-90 mb-8">
                Si tu día a día ya está lleno de tareas, presión y
                expectativas, está bien tener un lugar donde solo tengas que
                ser honesto contigo mismo.
              </p>

              <div className="flex flex-col md:flex-row flex-wrap justify-center gap-4">
                <div className="flex items-center gap-2 bg-white/20 px-6 py-3 rounded-full justify-center">
                  <Check className="w-5 h-5" />
                  <span className="font-medium text-sm md:text-base">
                    Espacio seguro para escribir y sentir
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 px-6 py-3 rounded-full justify-center">
                  <Check className="w-5 h-5" />
                  <span className="font-medium text-sm md:text-base">
                    Herramientas sencillas, no abrumadoras
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Escenarios reales */}
      <section id="escenarios" className="py-16 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16 scroll-fade">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Momentos donde iNerzia puede acompañarte
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              No son “testimonios de marketing”, son situaciones reales que
              probablemente ya viviste o vas a vivir.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {scenarios.map((scenario, index) => (
              <div
                key={index}
                className="scroll-fade bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:shadow-xl transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center mb-3">
                  {scenario.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">
                  {scenario.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-600">
                  {scenario.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-gray-400 text-sm space-y-1">
            <p>© 2025 iNerzia Mind.</p>
            <p>
              Proyecto en construcción. Esta app no reemplaza la atención
              profesional en salud mental.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
