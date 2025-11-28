'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Clock, Heart, Star, Search, Zap, Moon, Brain, Coffee, Headphones, CheckCircle, Award, Flame, X } from 'lucide-react';

export default function SesionesPage() {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedDuration, setSelectedDuration] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Estado del reproductor
  const [playingSession, setPlayingSession] = useState<typeof sessions[0] | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Estado de respiración
  const [showBreathingExercise, setShowBreathingExercise] = useState(false);
  const [breathPhase, setBreathPhase] = useState('inhale'); // inhale, hold, exhale
  
  // MEJORA: Persistencia de favoritos en LocalStorage
  const [favorites, setFavorites] = useState<number[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('meditation_favorites');
      return saved ? (JSON.parse(saved) as number[]) : [];
    }
    return [];
  });

  // Guardar favoritos cuando cambien
  useEffect(() => {
    localStorage.setItem('meditation_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Datos de sesiones (Igual que tu código original)
  const sessions = [
    { id: 1, title: "Meditación para Dormir Profundo", description: "Relaja tu mente y cuerpo para un sueño reparador", duration: 15, category: "Sueño", difficulty: "Principiante", instructor: "María González", plays: 12450, rating: 4.9, color: "from-indigo-500 to-purple-500", icon: <Moon className="w-6 h-6" /> },
    { id: 2, title: "Respiración Anti-Ansiedad", description: "Técnica 4-7-8 para calmar la ansiedad rápidamente", duration: 5, category: "Ansiedad", difficulty: "Todos", instructor: "Dr. Carlos Ruiz", plays: 8920, rating: 4.8, color: "from-emerald-500 to-teal-500", icon: <Heart className="w-6 h-6" /> },
    { id: 3, title: "Focus Power - Concentración", description: "Mejora tu enfoque antes de estudiar o trabajar", duration: 10, category: "Concentración", difficulty: "Intermedio", instructor: "Ana Torres", plays: 15320, rating: 4.9, color: "from-amber-500 to-orange-500", icon: <Brain className="w-6 h-6" /> },
    { id: 4, title: "Morning Energy Boost", description: "Energiza tu cuerpo y mente para empezar el día", duration: 8, category: "Energía", difficulty: "Principiante", instructor: "Luis Martínez", plays: 9870, rating: 4.7, color: "from-yellow-500 to-orange-500", icon: <Coffee className="w-6 h-6" /> },
    { id: 5, title: "Calma en 3 Minutos", description: "Ejercicio rápido para momentos de estrés", duration: 3, category: "Estrés", difficulty: "Todos", instructor: "María González", plays: 20100, rating: 5.0, color: "from-cyan-500 to-blue-500", icon: <Zap className="w-6 h-6" /> },
    { id: 6, title: "Body Scan Relajación Total", description: "Escaneo corporal para liberar tensión", duration: 20, category: "Relajación", difficulty: "Intermedio", instructor: "Dr. Carlos Ruiz", plays: 7650, rating: 4.8, color: "from-purple-500 to-pink-500", icon: <Heart className="w-6 h-6" /> }
  ];

  const categories = ['Todos', 'Sueño', 'Ansiedad', 'Concentración', 'Energía', 'Estrés', 'Relajación'];
  const durations = ['Todas', '3-5 min', '5-10 min', '10-20 min', '20+ min'];

  const userStats = { totalMinutes: 247, streak: 7, completedSessions: 18, level: 3 };

  // MEJORA: Lógica del Timer (Simulación de reproducción)
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isPlaying && playingSession) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          // Si llega al final, detener
          if (prev >= playingSession.duration * 60) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playingSession]);

  // Lógica del ejercicio de respiración
  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;
    if (showBreathingExercise) {
      const runCycle = (phase: string) => {
        setBreathPhase(phase);
        let nextPhase, duration;
        
        if (phase === 'inhale') { nextPhase = 'hold'; duration = 4000; }
        else if (phase === 'hold') { nextPhase = 'exhale'; duration = 7000; }
        else { nextPhase = 'inhale'; duration = 8000; }

        timeout = setTimeout(() => runCycle(nextPhase), duration);
      };
      
      runCycle('inhale');
    }
    return () => clearTimeout(timeout);
  }, [showBreathingExercise]);

  const filteredSessions = sessions.filter(session => {
    const matchesCategory = selectedCategory === 'Todos' || session.category === selectedCategory;
    const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          session.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesDuration = true;
    if (selectedDuration !== 'Todas') {
      if (selectedDuration === '3-5 min') matchesDuration = session.duration >= 3 && session.duration <= 5;
      if (selectedDuration === '5-10 min') matchesDuration = session.duration > 5 && session.duration <= 10;
      if (selectedDuration === '10-20 min') matchesDuration = session.duration > 10 && session.duration <= 20;
      if (selectedDuration === '20+ min') matchesDuration = session.duration > 20;
    }
    
    return matchesCategory && matchesSearch && matchesDuration;
  });

  const handlePlayPause = (session: typeof sessions[0]) => {
    if (playingSession?.id === session.id) {
      setIsPlaying(!isPlaying);
    } else {
      setPlayingSession(session);
      setIsPlaying(true);
      setCurrentTime(0);
    }
  };

  const toggleFavorite = (sessionId: number) => {
    if (favorites.includes(sessionId)) {
      setFavorites(favorites.filter(id => id !== sessionId));
    } else {
      setFavorites([...favorites, sessionId]);
    }
  };

  const getBreathingInstruction = () => {
    switch(breathPhase) {
      case 'inhale': return 'Inhala (4s)';
      case 'hold': return 'Sostén (7s)';
      case 'exhale': return 'Exhala (8s)';
      default: return '';
    }
  };

  const getBreathingScale = () => {
    switch(breathPhase) {
      case 'inhale': return 'scale-125 duration-[4000ms] ease-out';
      case 'hold': return 'scale-125 duration-0'; // Se mantiene
      case 'exhale': return 'scale-75 duration-[8000ms] ease-in-out';
      default: return 'scale-100';
    }
  };

  // Formatear tiempo mm:ss
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    // MEJORA: pb-32 asegura que el contenido no quede oculto detrás del reproductor en móviles
    <div className={`min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8 px-4 ${playingSession ? 'pb-32' : 'pb-8'}`}>
      
      <style jsx>{`
        @keyframes pulse-soft {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .animate-pulse-soft { animation: pulse-soft 3s ease-in-out infinite; }
      `}</style>

      <div className="max-w-7xl mx-auto">
        
        {/* Header with Stats */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Sesiones de Mindfulness
              </h1>
              <p className="text-gray-600 text-lg">Medita, respira y encuentra tu calma interior</p>
            </div>

            <button
              onClick={() => setShowBreathingExercise(true)}
              className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-red-200 shadow-md"
            >
              <Zap className="w-5 h-5" />
              Calma Rápida (60s)
            </button>
          </div>

          {/* User Stats - Responsive Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[
              { icon: <Clock className="w-5 h-5 md:w-6 md:h-6 text-white" />, val: userStats.totalMinutes, label: "minutos totales", color: "from-emerald-500 to-teal-500" },
              { icon: <Flame className="w-5 h-5 md:w-6 md:h-6 text-white" />, val: userStats.streak, label: "días seguidos", color: "from-orange-500 to-red-500" },
              { icon: <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-white" />, val: userStats.completedSessions, label: "completadas", color: "from-purple-500 to-pink-500" },
              { icon: <Award className="w-5 h-5 md:w-6 md:h-6 text-white" />, val: `Nivel ${userStats.level}`, label: "practicante", color: "from-blue-500 to-cyan-500" }
            ].map((stat, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-xl rounded-2xl p-3 md:p-4 border border-white/20 shadow-lg flex items-center gap-3">
                <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  {stat.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-xl md:text-2xl font-bold text-gray-900 truncate">{stat.val}</p>
                  <p className="text-xs md:text-sm text-gray-600 truncate">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/20 shadow-lg mb-8 sticky top-4 z-30">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar meditaciones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-white/50"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all text-sm md:text-base ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-white cursor-pointer"
            >
              {durations.map(dur => (
                <option key={dur} value={dur}>{dur}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Sessions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((session) => (
            <div
              key={session.id}
              className="group bg-white/90 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/20 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Card Header */}
              <div className={`h-32 bg-gradient-to-br ${session.color} p-6 flex items-center justify-between relative overflow-hidden`}>
                <div className="absolute inset-0 bg-white/10 group-hover:bg-white/0 transition-all"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-white/30 backdrop-blur-xl rounded-xl flex items-center justify-center text-white mb-2 shadow-inner">
                    {session.icon}
                  </div>
                  <span className="text-white font-medium bg-black/10 px-2 py-0.5 rounded-lg text-xs backdrop-blur-sm">{session.category}</span>
                </div>
                <button
                  onClick={() => toggleFavorite(session.id)}
                  className="relative z-10 w-10 h-10 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-white/40 transition-all active:scale-90"
                >
                  <Heart className={`w-5 h-5 transition-colors ${favorites.includes(session.id) ? 'fill-white text-white' : 'text-white'}`} />
                </button>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                   <h3 className="text-lg font-bold text-gray-900 leading-tight">{session.title}</h3>
                   {playingSession?.id === session.id && isPlaying && (
                     <span className="flex h-3 w-3 relative">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                       <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                     </span>
                   )}
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{session.description}</p>

                <div className="flex items-center gap-4 mb-4 text-xs font-medium text-gray-500">
                  <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{session.duration} min</span>
                  </div>
                  <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span>{session.rating}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Instructor</p>
                    <p className="text-sm font-medium text-gray-900">{session.instructor}</p>
                  </div>
                  
                  <button
                    onClick={() => handlePlayPause(session)}
                    className={`px-5 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 text-sm ${
                      playingSession?.id === session.id && isPlaying
                        ? 'bg-gray-100 text-gray-900 border border-gray-200'
                        : 'bg-gray-900 text-white hover:bg-gray-800 shadow-md hover:shadow-lg'
                    }`}
                  >
                    {playingSession?.id === session.id && isPlaying ? (
                      <> <Pause className="w-4 h-4" /> Pausar </>
                    ) : (
                      <> <Play className="w-4 h-4" /> Iniciar </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredSessions.length === 0 && (
          <div className="text-center py-20 bg-white/50 rounded-3xl border border-dashed border-gray-300">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">No encontramos sesiones</h3>
            <p className="text-gray-600 mb-6">Intenta ajustar tus filtros o buscar con otro término</p>
            <button 
              onClick={() => {setSearchQuery(''); setSelectedCategory('Todos'); setSelectedDuration('Todas');}}
              className="text-emerald-600 font-medium hover:underline"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {/* Breathing Exercise Modal */}
      {showBreathingExercise && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-8 md:p-12 max-w-lg w-full text-center text-white relative shadow-2xl border border-white/10">
            <button
              onClick={() => setShowBreathingExercise(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl md:text-3xl font-bold mb-2">Respiración Guiada</h2>
            <p className="text-emerald-100 mb-10 text-sm md:text-base">Técnica 4-7-8 para calmar tu sistema nervioso</p>

            <div className="flex items-center justify-center mb-10 h-64">
              <div className={`w-48 h-48 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center transition-transform ${getBreathingScale()}`}>
                <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                   <Heart className="w-12 h-12 text-white fill-white/50" />
                </div>
              </div>
            </div>

            <h3 className="text-3xl font-bold mb-2 transition-all duration-300">{getBreathingInstruction()}</h3>
            <p className="text-emerald-200/80 text-sm">Sigue el ritmo de la expansión</p>
          </div>
        </div>
      )}

      {/* Now Playing Bar (Sticky Bottom) */}
      {playingSession && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-200 shadow-[0_-8px_30px_rgba(0,0,0,0.1)] z-40 animate-in slide-in-from-bottom duration-300">
          <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
            <div className="flex items-center gap-4">
              <div className={`hidden md:flex w-14 h-14 rounded-xl bg-gradient-to-br ${playingSession.color} items-center justify-center text-white flex-shrink-0 shadow-md`}>
                {playingSession.icon}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 truncate text-sm md:text-base">{playingSession.title}</h4>
                <p className="text-xs md:text-sm text-gray-500 truncate">{playingSession.instructor}</p>
                
                {/* Mobile Progress Bar (Inline) */}
                <div className="md:hidden w-full h-1 bg-gray-200 rounded-full mt-2 overflow-hidden">
                   <div className="h-full bg-emerald-500 transition-all duration-1000 ease-linear" style={{ width: `${(currentTime / (playingSession.duration * 60)) * 100}%` }}></div>
                </div>
              </div>

              <div className="flex items-center gap-3 md:gap-6">
                <div className="hidden md:block text-xs font-mono text-gray-500">
                  {formatTime(currentTime)} / {playingSession.duration}:00
                </div>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-10 h-10 md:w-12 md:h-12 bg-gray-900 rounded-full flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all shadow-lg"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
                </button>
              </div>
            </div>

            {/* Desktop Progress Bar */}
            <div className="hidden md:block w-full h-1.5 bg-gray-100 rounded-full mt-3 overflow-hidden cursor-pointer group">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-1000 ease-linear group-hover:bg-emerald-600"
                style={{ width: `${(currentTime / (playingSession.duration * 60)) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}