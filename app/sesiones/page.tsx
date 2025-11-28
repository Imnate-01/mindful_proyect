'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Clock, Heart, Star, Search, Zap, Moon, Brain, Coffee, Volume2, Loader2, WifiOff, Sparkles } from 'lucide-react';

/* ================== CONFIGURACIÓN DE AUDIO ================== */
const AMBIENT_SOUNDS: Record<string, string> = {
  Sueño: 'https://cdn.pixabay.com/download/audio/2022/02/07/audio_13b63260a9.mp3?filename=night-ambience-17064.mp3',
  Ansiedad: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_03e622359f.mp3?filename=rain-and-thunder-16705.mp3',
  Concentración: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_9593796698.mp3?filename=forest-lullaby-110624.mp3',
  Energía: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=morning-garden-acoustic-chill-15013.mp3',
  Estrés: 'https://cdn.pixabay.com/download/audio/2022/03/09/audio_c8c8a73467.mp3?filename=meditation-bowl-16738.mp3',
  Relajación: 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_2733923212.mp3?filename=relaxing-music-vol1-124477.mp3',
};

// Scripts optimizados para ElevenLabs (Pausas naturales)
const MEDITATION_SCRIPTS: Record<number, { text: string; pause: number }[]> = {
  1: [
    { text: "Bienvenido. Prepárate para descansar profundamente.", pause: 2000 },
    { text: "Acuéstate en una posición cómoda y cierra los ojos suavemente.", pause: 3000 },
    { text: "Inhala lento por la nariz... y exhala por la boca.", pause: 4000 },
    { text: "Siente cómo tu cuerpo se hunde en el colchón, pesado y relajado.", pause: 4000 },
    { text: "Deja ir los pensamientos del día. Ahora es momento de dormir.", pause: 5000 }
  ],
  2: [
    { text: "Hola. Vamos a calmar esa ansiedad juntos.", pause: 1500 },
    { text: "Usaremos la respiración 4, 7, 8.", pause: 2000 },
    { text: "Inhala por la nariz en 4 segundos.", pause: 4000 },
    { text: "Sostén el aire durante 7 segundos.", pause: 7000 },
    { text: "Ahora exhala con fuerza por la boca durante 8 segundos.", pause: 8000 },
    { text: "Muy bien. Siente cómo la ansiedad sale de tu cuerpo.", pause: 4000 }
  ],
  // ... puedes agregar el resto de scripts aquí
};

export default function SesionesPage() {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [playingSession, setPlayingSession] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingVoice, setIsLoadingVoice] = useState(false);
  const [currentSubtitle, setCurrentSubtitle] = useState('');
  const [musicVolume, setMusicVolume] = useState(0.3);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [usingFallback, setUsingFallback] = useState(false);

  const ambientAudioRef = useRef<HTMLAudioElement | null>(null);
  const voiceAudioRef = useRef<HTMLAudioElement | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const scriptTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scriptIndexRef = useRef(0);
  const isCancelledRef = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      ambientAudioRef.current = new Audio();
      ambientAudioRef.current.loop = true;
      voiceAudioRef.current = new Audio();
      synthRef.current = window.speechSynthesis;

      const saved = localStorage.getItem('meditation_favorites');
      if (saved) setFavorites(JSON.parse(saved));
    }
    return () => stopAllAudio();
  }, []);

  useEffect(() => { localStorage.setItem('meditation_favorites', JSON.stringify(favorites)); }, [favorites]);
  
  useEffect(() => { 
    if (ambientAudioRef.current) ambientAudioRef.current.volume = musicVolume; 
    // Voz IA siempre al máximo relativo
    if (voiceAudioRef.current) voiceAudioRef.current.volume = Math.min(1, musicVolume + 0.3);
  }, [musicVolume]);

  const stopAllAudio = () => {
    isCancelledRef.current = true;
    if (ambientAudioRef.current) { ambientAudioRef.current.pause(); ambientAudioRef.current.currentTime = 0; }
    if (voiceAudioRef.current) { voiceAudioRef.current.pause(); voiceAudioRef.current.currentTime = 0; }
    if (synthRef.current) { synthRef.current.cancel(); }
    if (scriptTimeoutRef.current) clearTimeout(scriptTimeoutRef.current);
    
    setIsPlaying(false);
    setIsLoadingVoice(false);
    setCurrentSubtitle('');
  };

  const playSession = (session: any) => {
    if (playingSession?.id === session.id) { togglePlayPause(); return; }
    
    stopAllAudio();
    isCancelledRef.current = false;
    setPlayingSession(session);
    setIsPlaying(true);
    scriptIndexRef.current = 0;
    setUsingFallback(false);

    // 1. Música de fondo
    if (ambientAudioRef.current) {
      const audioUrl = AMBIENT_SOUNDS[session.category] || AMBIENT_SOUNDS['Relajación'];
      ambientAudioRef.current.src = audioUrl;
      ambientAudioRef.current.volume = musicVolume;
      ambientAudioRef.current.play().catch(e => console.error("Error música fondo:", e));
    }

    // 2. Iniciar Secuencia
    const script = MEDITATION_SCRIPTS[session.id] || MEDITATION_SCRIPTS[1];
    processScriptLine(script, 0);
  };

  /* ================== LÓGICA DE VOZ ELEVENLABS ================== */

  const processScriptLine = async (script: { text: string; pause: number }[], index: number) => {
    if (index >= script.length || isCancelledRef.current) {
      if (!isCancelledRef.current) {
        setCurrentSubtitle("Sesión finalizada. Namasté.");
        setTimeout(() => setIsPlaying(false), 3000);
      }
      return;
    }

    const line = script[index];
    scriptIndexRef.current = index;
    setCurrentSubtitle(line.text);

    // Fallback mode activo
    if (usingFallback) {
      playWithBrowser(line.text, line.pause, script, index);
      return;
    }

    setIsLoadingVoice(true);

    try {
      // Petición a ElevenLabs (vía Backend)
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: line.text }),
      });

      if (!response.ok) throw new Error('API Error');
      if (isCancelledRef.current) return;

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      
      if (voiceAudioRef.current) {
        voiceAudioRef.current.src = audioUrl;
        setIsLoadingVoice(false);
        await voiceAudioRef.current.play();
        
        voiceAudioRef.current.onended = () => {
          scriptTimeoutRef.current = setTimeout(() => {
            processScriptLine(script, index + 1);
          }, line.pause);
        };
      }

    } catch (error) {
      console.warn("⚠️ Falló ElevenLabs, usando voz del navegador:", error);
      setUsingFallback(true);
      setIsLoadingVoice(false);
      playWithBrowser(line.text, line.pause, script, index);
    }
  };

  const playWithBrowser = (text: string, pause: number, script: any[], index: number) => {
    if (isCancelledRef.current || !synthRef.current) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-MX';
    utterance.rate = 0.9;
    
    // Intentar buscar una voz decente
    const voices = synthRef.current.getVoices();
    const goodVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Paulina') || v.lang === 'es-MX');
    if (goodVoice) utterance.voice = goodVoice;

    utterance.onend = () => {
      scriptTimeoutRef.current = setTimeout(() => {
        processScriptLine(script, index + 1);
      }, pause);
    };

    synthRef.current.speak(utterance);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      isCancelledRef.current = true;
      ambientAudioRef.current?.pause();
      voiceAudioRef.current?.pause();
      synthRef.current?.pause();
      if (scriptTimeoutRef.current) clearTimeout(scriptTimeoutRef.current);
    } else {
      setIsPlaying(true);
      isCancelledRef.current = false;
      ambientAudioRef.current?.play();
      if (usingFallback && synthRef.current?.paused) {
        synthRef.current.resume();
        return;
      }
      const script = MEDITATION_SCRIPTS[playingSession.id] || MEDITATION_SCRIPTS[1];
      processScriptLine(script, scriptIndexRef.current);
    }
  };

  // UI Data (Sin cambios)
  const sessions = [
    { id: 1, title: "Sueño Profundo", description: "Relajación progresiva para dormir", duration: 15, category: "Sueño", difficulty: "Principiante", instructor: "IA Guía", plays: 12450, rating: 4.9, color: "from-indigo-500 to-purple-500", icon: <Moon className="w-6 h-6" /> },
    { id: 2, title: "Respiración 4-7-8", description: "Técnica SOS para ataques de ansiedad", duration: 5, category: "Ansiedad", difficulty: "Todos", instructor: "IA Guía", plays: 8920, rating: 4.8, color: "from-emerald-500 to-teal-500", icon: <Heart className="w-6 h-6" /> },
    { id: 3, title: "Enfoque Total", description: "Preparación mental para estudiar", duration: 10, category: "Concentración", difficulty: "Intermedio", instructor: "IA Guía", plays: 15320, rating: 4.9, color: "from-amber-500 to-orange-500", icon: <Brain className="w-6 h-6" /> },
    { id: 4, title: "Energía Matutina", description: "Activa tu cuerpo al despertar", duration: 8, category: "Energía", difficulty: "Principiante", instructor: "IA Guía", plays: 9870, rating: 4.7, color: "from-yellow-500 to-orange-500", icon: <Coffee className="w-6 h-6" /> },
    { id: 5, title: "Calma Exprés", description: "3 minutos para bajar el estrés", duration: 3, category: "Estrés", difficulty: "Todos", instructor: "IA Guía", plays: 20100, rating: 5.0, color: "from-cyan-500 to-blue-500", icon: <Zap className="w-6 h-6" /> },
    { id: 6, title: "Escaneo Corporal", description: "Mindfulness clásico para conectar", duration: 20, category: "Relajación", difficulty: "Intermedio", instructor: "IA Guía", plays: 7650, rating: 4.8, color: "from-purple-500 to-pink-500", icon: <Heart className="w-6 h-6" /> }
  ];
  
  const categories = ['Todos', 'Sueño', 'Ansiedad', 'Concentración', 'Energía', 'Estrés', 'Relajación'];
  const filteredSessions = sessions.filter(s => (selectedCategory === 'Todos' || s.category === selectedCategory) && s.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const toggleFavorite = (id: number) => setFavorites(p => p.includes(id) ? p.filter(f => f !== id) : [...p, id]);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8 px-4 ${playingSession ? 'pb-48' : 'pb-8'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Sesiones Guiadas</h1>
          <p className="text-gray-600 text-lg">Meditación con audio inmersivo y guía inteligente.</p>
        </div>

        {/* Filtros */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/20 shadow-lg mb-8 sticky top-4 z-30">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Buscar sesión..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-400 outline-none bg-white/50" />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              {categories.map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{cat}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid Sesiones */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((session) => (
            <div key={session.id} className="group bg-white/90 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/20 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className={`h-32 bg-gradient-to-br ${session.color} p-6 flex items-center justify-between relative`}>
                <div className="relative z-10 flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/30 backdrop-blur-xl rounded-xl flex items-center justify-center text-white">{session.icon}</div>
                  <span className="bg-black/10 px-2 py-1 rounded-lg text-white text-xs font-medium backdrop-blur-sm">{session.category}</span>
                </div>
                <button onClick={() => toggleFavorite(session.id)} className="relative z-10 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/40 transition-all">
                  <Heart className={`w-5 h-5 ${favorites.includes(session.id) ? 'fill-white text-white' : 'text-white'}`} />
                </button>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{session.title}</h3>
                <p className="text-gray-500 text-sm mb-4">{session.description}</p>
                <button onClick={() => playSession(session)} className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${playingSession?.id === session.id && isPlaying ? 'bg-gray-100 text-gray-800' : 'bg-gray-900 text-white hover:bg-gray-800 shadow-md'}`}>
                  {playingSession?.id === session.id && isPlaying ? <><Pause className="w-4 h-4" /> Pausar</> : <><Play className="w-4 h-4" /> Iniciar</>}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* REPRODUCTOR FLOTANTE */}
      {playingSession && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-2xl z-50 animate-in slide-in-from-bottom duration-500">
          <div className="max-w-3xl mx-auto px-6 py-4">
            
            {/* Subtítulos + Estados */}
            <div className="mb-4 text-center min-h-[1.75rem] flex items-center justify-center">
              {isLoadingVoice ? (
                <div className="flex items-center gap-2 text-emerald-600 animate-pulse text-sm font-medium">
                  <Loader2 className="w-4 h-4 animate-spin" /> Conectando con ElevenLabs...
                </div>
              ) : usingFallback ? (
                <div className="flex flex-col items-center">
                   <p className="text-lg font-medium text-emerald-800 animate-in fade-in">"{currentSubtitle}"</p>
                   <span className="flex items-center gap-1 text-[10px] text-gray-400 mt-1"><WifiOff className="w-3 h-3"/> Modo ahorro (Sin créditos/conexión)</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                   <p className="text-lg font-medium text-emerald-800 animate-in fade-in">"{currentSubtitle}"</p>
                   <span className="flex items-center gap-1 text-[10px] text-emerald-500 mt-1"><Sparkles className="w-3 h-3"/> Voz Neural Ultra-Realista</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-4">
              {/* Información */}
              <div className="flex items-center gap-3 w-1/3 min-w-0">
                <div className={`hidden sm:flex w-10 h-10 rounded-lg bg-gradient-to-br ${playingSession.color} items-center justify-center text-white shadow-sm`}>{playingSession.icon}</div>
                <div className="overflow-hidden">
                  <h4 className="font-bold text-gray-900 truncate text-sm">{playingSession.title}</h4>
                  <p className="text-xs text-gray-500 truncate">Voz: ElevenLabs Roger</p>
                </div>
              </div>

              {/* Botón Play */}
              <button onClick={togglePlayPause} className="w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald-200 shrink-0">
                {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
              </button>

              {/* Volumen */}
              <div className="flex items-center justify-end gap-2 w-1/3 group">
                <Volume2 className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                <input type="range" min="0" max="1" step="0.05" value={musicVolume} onChange={(e) => setMusicVolume(parseFloat(e.target.value))} className="w-24 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}