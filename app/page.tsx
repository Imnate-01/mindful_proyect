'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Brain, Users, Calendar, Search, MessageCircle, Sparkles, ChevronDown, Play, Check, Star, Menu, X } from 'lucide-react';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      const elements = document.querySelectorAll('.scroll-fade');
      elements.forEach(el => {
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
      title: "Autoevaluación Emocional",
      description: "Tests breves para entender cómo te sientes hoy",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Meditaciones Guiadas",
      description: "Ejercicios para estrés, ansiedad, sueño y concentración",
      color: "from-teal-500 to-cyan-500"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Hábitos Saludables",
      description: "Construye rutinas de autocuidado con rachas y progreso",
      color: "from-cyan-500 to-blue-500"
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: "Ayuda Profesional",
      description: "Conecta con psicólogos y centros verificados cerca de ti",
      color: "from-blue-500 to-indigo-500"
    }
  ];

  const testimonials = [
    {
        name: "María González",
        role: "Estudiante de Ingeniería",
        text: "Esta app me ayudó a manejar mi ansiedad durante finales. Las meditaciones de 5 minutos son perfectas.",
        rating: 5
      },
      {
        name: "Carlos Ramírez",
        role: "Estudiante de Medicina",
        text: "Encontré un psicólogo cerca de mi universidad en minutos. El proceso fue súper fácil.",
        rating: 5
      },
      {
        name: "Ana Torres",
        role: "Estudiante de Diseño",
        text: "Los ejercicios de respiración me ayudan a calmarme antes de presentaciones.",
        rating: 5
      }
  ];

  return (
    // FIX APLICADO: Agregado 'w-full' y 'relative' para mayor seguridad en el layout
    <div className="min-h-screen w-full relative overflow-x-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      
      {/* Estilos globales */}
      <style jsx global>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        .animate-breathe { animation: breathe 4s ease-in-out infinite; }

        .scroll-fade {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .scroll-fade.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-20 -left-20 md:left-10 w-72 md:w-96 h-72 md:h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 -right-20 md:right-10 w-72 md:w-96 h-72 md:h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-1/2 w-72 md:w-96 h-72 md:h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Navigation */}
      {/* FIX APLICADO: Usamos left-0 right-0 en lugar de w-full */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || isMobileMenuOpen ? 'bg-white/90 backdrop-blur-xl shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                <Heart className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <span className="font-bold text-lg md:text-xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                iNerzia
              </span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#inicio" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">Inicio</a>
              <a href="#caracteristicas" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">Características</a>
              <a href="#testimonios" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">Testimonios</a>
             <Link 
                href="/login" 
                className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all"
              >
                Comenzar
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
              <a href="#inicio" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 hover:text-emerald-600 font-medium">Inicio</a>
              <a href="#caracteristicas" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 hover:text-emerald-600 font-medium">Características</a>
              <a href="#testimonios" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 hover:text-emerald-600 font-medium">Testimonios</a>
              <button className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold">
                Comenzar ahora
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="inicio" className="relative min-h-screen flex flex-col justify-center px-4 pt-28 pb-12 md:pt-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          
          {/* Left Content */}
          <div className="space-y-6 md:space-y-8 fade-in-up text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">Tu bienestar importa</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              <span className="block text-gray-900">Un espacio de</span>
              <span className="block bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                calma y claridad
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-lg mx-auto md:mx-0">
              Herramientas de mindfulness, meditación y conexión con ayuda profesional. 
              <span className="font-semibold text-gray-800"> Todo en un solo lugar.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2">
                <Play className="w-5 h-5" />
                Comenzar gratis
              </button>
              <button className="px-8 py-4 bg-white text-gray-700 rounded-2xl font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all border-2 border-gray-200">
                Ver demo
              </button>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-6 md:gap-8 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 border-2 border-white flex items-center justify-center text-white font-semibold text-sm">
                    {i}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">+2,500</p>
                <p className="text-sm text-gray-600">estudiantes</p>
              </div>
            </div>
          </div>

          {/* Right Content - Interactive Card */}
          <div className="relative mt-8 md:mt-0">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-3xl blur-3xl opacity-30 animate-breathe"></div>
            
            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 border border-white/20">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900">¿Cómo te sientes?</h3>
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center animate-float">
                    <Heart className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {['😊 Bien', '😰 Ansioso', '😔 Triste', '😴 Cansado'].map(mood => (
                    <button key={mood} className="p-3 md:p-4 bg-gray-50 hover:bg-emerald-50 hover:border-emerald-300 border-2 border-transparent rounded-xl transition-all text-left font-medium text-sm md:text-base">
                      {mood}
                    </button>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1 text-sm md:text-base">Sugerencia del día</p>
                      <p className="text-xs md:text-sm text-gray-600">Meditación de 5 minutos para reducir ansiedad.</p>
                    </div>
                  </div>
                </div>

                <button className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all text-sm md:text-base">
                  Comenzar evaluación
                </button>
              </div>
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
                Todo lo que necesitas
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Herramientas diseñadas para acompañarte en tu bienestar emocional
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="scroll-fade bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                style={{transitionDelay: `${index * 100}ms`}}
              >
                <div className={`w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-4 text-white`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm md:text-base text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emotional Message Section */}
      <section className="py-16 md:py-20 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center scroll-fade">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl p-8 md:p-16 text-white shadow-2xl relative">
            <div className="absolute inset-0 bg-white/10 rounded-3xl backdrop-blur-xl"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              
              <h2 className="text-2xl md:text-4xl font-bold mb-6">
                "Tu bienestar importa. No estás solo."
              </h2>
              <p className="text-lg md:text-2xl leading-relaxed opacity-90 mb-8">
                Un espacio para respirar, evaluar cómo te sientes, orientarte y mejorar a tu ritmo.
              </p>
              
              <div className="flex flex-col md:flex-row flex-wrap justify-center gap-4">
                <div className="flex items-center gap-2 bg-white/20 px-6 py-3 rounded-full justify-center">
                  <Check className="w-5 h-5" />
                  <span className="font-medium text-sm md:text-base">Calma cuando hay estrés</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 px-6 py-3 rounded-full justify-center">
                  <Check className="w-5 h-5" />
                  <span className="font-medium text-sm md:text-base">Claridad en la confusión</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonios" className="py-16 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16 scroll-fade">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Historias reales
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600">Lo que dicen otros estudiantes</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="scroll-fade bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:shadow-xl transition-all">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 md:w-5 md:h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic text-sm md:text-base">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm md:text-base">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm md:text-base">{testimonial.name}</p>
                    <p className="text-xs md:text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
           {/* ... contenido del footer ... */}
           <div className="text-center text-gray-400 text-sm">
              <p>© 2024 Mindful Campus. Hecho con ❤️ para estudiantes.</p>
           </div>
        </div>
      </footer>
    </div>
  );
}