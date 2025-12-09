'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Clock,
  Heart,
  Star,
  Search,
  Zap,
  Moon,
  Brain,
  Coffee,
  Volume2,
  Loader2,
  WifiOff,
  Sparkles,
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

/* ================== CONFIGURACIÓN DE AUDIO ================== */
// Música de fondo según el tipo de sesión.
// Puedes cambiar los audios por otros que te gusten más.
const AMBIENT_SOUNDS: Record<string, string> = {
  Sueño:
    'https://cdn.pixabay.com/download/audio/2022/02/07/audio_13b63260a9.mp3?filename=night-ambience-17064.mp3',
  Ansiedad:
    'https://cdn.pixabay.com/download/audio/2021/08/09/audio_03e622359f.mp3?filename=rain-and-thunder-16705.mp3',
  Concentración:
    'https://cdn.pixabay.com/download/audio/2021/09/06/audio_9593796698.mp3?filename=forest-lullaby-110624.mp3',
  Energía:
    'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=morning-garden-acoustic-chill-15013.mp3',
  Estrés:
    'https://cdn.pixabay.com/download/audio/2022/03/09/audio_c8c8a73467.mp3?filename=meditation-bowl-16738.mp3',
  Relajación:
    'https://cdn.pixabay.com/download/audio/2022/10/25/audio_2733923212.mp3?filename=relaxing-music-vol1-124477.mp3',
};

type ScriptLine = { text: string; pause: number };

/* ================== SCRIPTS PARA ELEVENLABS (MUCHO MÁS RICOS) ================== */
/**
 * Cada entrada representa el guion de una meditación.
 * El ID (1, 2, 3…) idealmente coincide con id_meditacion en tu tabla `meditaciones`.
 * Puedes editar estos textos a tu gusto, pero ya vienen pensados como
 * meditaciones completas, con metáforas, respiración, y pausas.
 */
const MEDITATION_SCRIPTS: Record<number, ScriptLine[]> = {
  // 1. Sueño profundo
  1: [
    {
      text:
        'Bienvenido a tu espacio seguro para descansar. Antes de comenzar, asegúrate de estar acostado o recostada en una postura cómoda, con las luces bajas o apagadas.',
      pause: 5000,
    },
    {
      text:
        'Cierra suavemente tus ojos. Siente el peso de tu cuerpo apoyado en la cama, como si cada músculo empezara a rendirse al descanso.',
      pause: 5000,
    },
    {
      text:
        'Inhala lentamente por la nariz contando hasta cuatro... uno... dos... tres... cuatro... y exhala por la boca dejando salir cualquier tensión que haya quedado de tu día.',
      pause: 7000,
    },
    {
      text:
        'Mientras escuchas la música de fondo, imagina que estás en un lugar tranquilo: quizá un bosque de noche, un cielo lleno de estrellas, o un cuarto suave y cálido sólo para ti.',
      pause: 7000,
    },
    {
      text:
        'Con cada exhalación, visualiza que sueltas preocupaciones, pendientes y miedos. No tienes que resolver nada ahora. Este momento es sólo para descansar.',
      pause: 7000,
    },
    {
      text:
        'Lleva ahora tu atención a los pies. Siente cómo se relajan... luego tus piernas... tu cadera... tu abdomen... tu pecho... tus hombros... tu cuello... y finalmente tu rostro.',
      pause: 9000,
    },
    {
      text:
        'Si aparece algún pensamiento, agradécele que haya venido y déjalo ir, como si fuera una nube que pasa por el cielo. Tú sólo vuelves suave a tu respiración y a la sensación de calma.',
      pause: 9000,
    },
    {
      text:
        'Permite que la música y mi voz se vayan alejando poco a poco. Confía en que tu cuerpo sabe cómo dormir y cómo recuperar su energía.',
      pause: 9000,
    },
    {
      text:
        'Te mereces descansar. Te mereces soltar la presión por un momento. Que tengas un sueño profundo y reparador.',
      pause: 9000,
    },
  ],

  // 2. Respiración 4-7-8 para ansiedad
  2: [
    {
      text:
        'Hola. Gracias por darte este momento para cuidar de ti. Vamos a trabajar juntos con la respiración cuatro, siete, ocho, una técnica sencilla pero muy poderosa para calmar la ansiedad.',
      pause: 6000,
    },
    {
      text:
        'Si puedes, siéntate con la espalda recta pero relajada, o recuéstate en una posición cómoda. Coloca una mano sobre tu pecho y otra sobre tu abdomen.',
      pause: 6000,
    },
    {
      text:
        'Inhala suavemente por la nariz contando mentalmente hasta cuatro. Uno... dos... tres... cuatro. Nota cómo el aire entra y expande tu abdomen.',
      pause: 8000,
    },
    {
      text:
        'Ahora, mantén el aire dentro y cuenta hasta siete. Uno... dos... tres... cuatro... cinco... seis... siete. No fuerces, sólo sostén el aire de manera suave.',
      pause: 9000,
    },
    {
      text:
        'Por último, exhala por la boca en un soplo lento y continuo, contando hasta ocho. Uno... dos... tres... cuatro... cinco... seis... siete... ocho. Imagina que con el aire sale también la tensión.',
      pause: 10000,
    },
    {
      text:
        'Vamos a repetir este ciclo dos veces más. Inhala en cuatro... sostén en siete... exhala en ocho. Si te pierdes en la cuenta, no pasa nada. Vuelve a comenzar amablemente.',
      pause: 12000,
    },
    {
      text:
        'Mientras sigues respirando a tu propio ritmo, obsérvate con curiosidad. Tal vez tu corazón sigue algo acelerado, o tu mente sigue activa, y está bien. No estás fallando. Sólo estás practicando.',
      pause: 10000,
    },
    {
      text:
        'Recuerda que la ansiedad no es un enemigo. Es una señal de que tu sistema está tratando de protegerte. Hoy le estás enseñando, con tu respiración, que en este momento estás a salvo.',
      pause: 10000,
    },
    {
      text:
        'Toma una última inhalación profunda... y exhala con un suspiro suave. Cuando lo necesites, puedes regresar a este ejercicio. Estás haciendo un buen trabajo.',
      pause: 9000,
    },
  ],

  // 3. Enfoque total (estudio / concentración)
  3: [
    {
      text:
        'Vamos a preparar tu mente para concentrarte. Imagina que este momento es como limpiar tu escritorio interno antes de empezar a estudiar o trabajar.',
      pause: 6000,
    },
    {
      text:
        'Siéntate con la espalda recta, los pies apoyados en el suelo y las manos descansando sobre tus piernas o sobre la mesa.',
      pause: 6000,
    },
    {
      text:
        'Inhala profundo por la nariz y exhala por la boca, dejando caer los hombros. Permite que la música de fondo cree un ambiente suave pero despierto.',
      pause: 9000,
    },
    {
      text:
        'Lleva tu atención a un punto de tu cuerpo: puede ser la respiración en la punta de la nariz, el movimiento del pecho, o el peso del cuerpo sobre la silla.',
      pause: 9000,
    },
    {
      text:
        'Durante unos momentos, cada vez que un pensamiento aparezca —sea una preocupación, un recuerdo o una distracción— simplemente di para ti: “pensamiento”, y vuelve a tu punto de enfoque.',
      pause: 10000,
    },
    {
      text:
        'Imagina que cada inhalación enciende un poco más tu claridad mental, y cada exhalación se lleva un poco de ruido, cansancio y autoexigencia innecesaria.',
      pause: 10000,
    },
    {
      text:
        'Repite para ti: “Puedo avanzar paso a paso. No tengo que hacerlo perfecto, sólo presente”.',
      pause: 8000,
    },
    {
      text:
        'Cuando termines esta breve preparación, elige una sola tarea con la que vas a comenzar. Una. Y decide que, durante los próximos minutos, tu atención estará aquí.',
      pause: 9000,
    },
  ],

  // 4. Energía matutina
  4: [
    {
      text:
        'Buenos días. Esta meditación está diseñada para activar suavemente tu energía y ayudarte a comenzar el día con intención.',
      pause: 6000,
    },
    {
      text:
        'Si puedes, siéntate al borde de la cama o en una silla, con la espalda recta y los pies firmes en el suelo.',
      pause: 6000,
    },
    {
      text:
        'Inhala por la nariz llenando tu pecho y tu abdomen... y exhala por la boca como si soltaras lo que quedó pendiente de ayer.',
      pause: 9000,
    },
    {
      text:
        'Mientras escuchas la música de fondo, imagina que cada inhalación trae una luz suave que recorre tu cuerpo desde los pies hasta la cabeza.',
      pause: 9000,
    },
    {
      text:
        'Piensa en una pequeña intención para tu día de hoy. Puede ser algo simple, como: “Hoy me hablaré con más amabilidad”, o “Hoy daré mi mejor esfuerzo, sin olvidarme de mí”.',
      pause: 11000,
    },
    {
      text:
        'Siente esa intención como si ya fuera real, como si estuviera escrita en cada respiración que haces ahora.',
      pause: 8000,
    },
    {
      text:
        'Cuando estés listo o lista, lleva una última inhalación profunda y estira suavemente tu cuerpo. Hoy tienes permiso de avanzar a tu ritmo, sin compararte con nadie.',
      pause: 9000,
    },
  ],

  // 5. Calma exprés (estrés)
  5: [
    {
      text:
        'Esta es una pausa de pocos minutos para bajar el estrés. No necesitas estar en silencio perfecto, sólo encuentra una postura cómoda donde puedas estar sin ser interrumpido unos instantes.',
      pause: 7000,
    },
    {
      text:
        'Cierra los ojos o suaviza la mirada. Inhala profundo por la nariz, exhala por la boca con un suspiro, como si soltaras presión acumulada.',
      pause: 9000,
    },
    {
      text:
        'Escucha atentamente la música de fondo, como si cada sonido fuera una ola que pasa y se aleja. No tienes que hacer nada, sólo observar.',
      pause: 9000,
    },
    {
      text:
        'Lleva tu atención a la zona del cuerpo donde más sientes el estrés: tal vez la mandíbula, el cuello, el pecho o el estómago. Sólo nota esa sensación, sin juzgarla.',
      pause: 10000,
    },
    {
      text:
        'Con cada exhalación, imagina que aflojas un milímetro esa tensión. No tiene que desaparecer por completo. Sólo un poco menos de presión que hace un momento.',
      pause: 9000,
    },
    {
      text:
        'Repite para ti: “Estoy haciendo lo mejor que puedo con lo que tengo hoy”.',
      pause: 7000,
    },
    {
      text:
        'Cuando estés listo, abre los ojos lentamente. Lleva contigo esta pequeña calma al resto de tu día.',
      pause: 9000,
    },
  ],

  // 6. Escaneo corporal (relajación)
  6: [
    {
      text:
        'Vamos a hacer un escaneo corporal consciente, una práctica clásica de mindfulness para reconectar con tu cuerpo sin juzgarlo.',
      pause: 7000,
    },
    {
      text:
        'Puedes hacerlo recostado o sentado. Elige la postura donde tu cuerpo pueda permanecer sin esfuerzo durante unos minutos.',
      pause: 6000,
    },
    {
      text:
        'Cierra los ojos. Comienza llevando tu atención a los pies. Sin moverlos, simplemente nota la temperatura, el peso, cualquier cosquilleo o sensación.',
      pause: 9000,
    },
    {
      text:
        'Lentamente sube tu atención a las pantorrillas, rodillas y muslos. No intentes cambiar nada; tu tarea es observar.',
      pause: 9000,
    },
    {
      text:
        'Sigue subiendo a la cadera, el abdomen y el pecho. Si hay incomodidad, ansiedad o mariposas en el estómago, sólo reconócelas. Están hablando de cómo te sientes.',
      pause: 11000,
    },
    {
      text:
        'Lleva ahora tu atención a los hombros, brazos y manos. Nota si los hombros están tensos o levantados. Si puedes, permite que caigan unos milímetros hacia abajo.',
      pause: 9000,
    },
    {
      text:
        'Por último, recorre cuello, mandíbula, rostro y frente. Relaja la lengua, separa ligeramente los dientes, suaviza el entrecejo.',
      pause: 9000,
    },
    {
      text:
        'Respira profundo una vez más. Tu cuerpo ha estado sosteniéndote todo este tiempo. Merece este momento de atención y cuidado.',
      pause: 9000,
    },
  ],
};

/* ================== TIPO DE SESIÓN (UI) ================== */
type UISession = {
  id: number;
  title: string;
  description: string;
  duration: number;
  category: keyof typeof AMBIENT_SOUNDS;
  difficulty: string;
  instructor: string;
  plays: number;
  rating: number;
  color: string;
  icon: React.ReactNode;
};

export default function SesionesPage() {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [playingSession, setPlayingSession] = useState<UISession | null>(null);
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

  // Para conexión con historial_meditaciones:
  const currentHistoryIdRef = useRef<number | null>(null);
  const sessionStartTimeRef = useRef<Date | null>(null);

  /* ========== INIT AUDIO + FAVORITOS ========== */
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

  useEffect(() => {
    localStorage.setItem('meditation_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (ambientAudioRef.current) ambientAudioRef.current.volume = musicVolume;
    if (voiceAudioRef.current)
      voiceAudioRef.current.volume = Math.min(1, musicVolume + 0.3);
  }, [musicVolume]);

  /* ========== DB: registrar inicio / fin de sesión ========== */

  async function registrarInicioSesion(session: UISession) {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) return;

      sessionStartTimeRef.current = new Date();

      const { data, error: insertError } = await supabase
        .from('historial_meditaciones')
        .insert({
          id_usuario: user.id,
          id_meditacion: session.id, // Asegúrate que coincide con meditaciones.id_meditacion
          fecha_inicio: new Date().toISOString(),
          completada: false,
        })
        .select('id_historial')
        .single();

      if (insertError) {
        console.error('Error insertando historial_meditaciones', insertError);
        return;
      }

      currentHistoryIdRef.current = data.id_historial;
    } catch (e) {
      console.error('Error registrarInicioSesion', e);
    }
  }

  async function registrarFinSesion(completada: boolean) {
    try {
      const id = currentHistoryIdRef.current;
      if (!id) return;

      const fechaFin = new Date();
      let duracionMin = null;

      if (sessionStartTimeRef.current) {
        const diffMs = fechaFin.getTime() - sessionStartTimeRef.current.getTime();
        duracionMin = Math.round(diffMs / 1000 / 60);
      }

      await supabase
        .from('historial_meditaciones')
        .update({
          fecha_fin: fechaFin.toISOString(),
          completada,
          duracion_real_minutos: duracionMin,
        })
        .eq('id_historial', id);

      currentHistoryIdRef.current = null;
      sessionStartTimeRef.current = null;
    } catch (e) {
      console.error('Error registrarFinSesion', e);
    }
  }

  /* ========== CONTROL AUDIO ========== */

  const stopAllAudio = () => {
    isCancelledRef.current = true;
    if (ambientAudioRef.current) {
      ambientAudioRef.current.pause();
      ambientAudioRef.current.currentTime = 0;
    }
    if (voiceAudioRef.current) {
      voiceAudioRef.current.pause();
      voiceAudioRef.current.currentTime = 0;
    }
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    if (scriptTimeoutRef.current) clearTimeout(scriptTimeoutRef.current);

    setIsPlaying(false);
    setIsLoadingVoice(false);
    setCurrentSubtitle('');
  };

  const playSession = async (session: UISession) => {
    if (playingSession?.id === session.id) {
      togglePlayPause();
      return;
    }

    // Nueva sesión → detener todo lo anterior
    await registrarFinSesion(false);
    stopAllAudio();
    isCancelledRef.current = false;
    setPlayingSession(session);
    setIsPlaying(true);
    scriptIndexRef.current = 0;
    setUsingFallback(false);

    // Registrar inicio en la BD
    await registrarInicioSesion(session);

    // 1. Música de fondo
    if (ambientAudioRef.current) {
      const audioUrl =
        AMBIENT_SOUNDS[session.category] || AMBIENT_SOUNDS['Relajación'];
      ambientAudioRef.current.src = audioUrl;
      ambientAudioRef.current.volume = musicVolume;
      ambientAudioRef.current
        .play()
        .catch((e) => console.error('Error música fondo:', e));
    }

    // 2. Iniciar Secuencia del Script
    const script = MEDITATION_SCRIPTS[session.id] || MEDITATION_SCRIPTS[1];
    processScriptLine(script, 0);
  };

  /* ================== LÓGICA DE VOZ ELEVENLABS ================== */

  const processScriptLine = async (script: ScriptLine[], index: number) => {
    if (index >= script.length || isCancelledRef.current) {
      if (!isCancelledRef.current) {
        setCurrentSubtitle('Sesión finalizada. Gracias por darte este tiempo.');
        registrarFinSesion(true);
        setTimeout(() => setIsPlaying(false), 3000);
      }
      return;
    }

    const line = script[index];
    scriptIndexRef.current = index;
    setCurrentSubtitle(line.text);

    // Si estamos en modo fallback, usar voz del navegador
    if (usingFallback) {
      playWithBrowser(line.text, line.pause, script, index);
      return;
    }

    setIsLoadingVoice(true);

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Aquí podrías mandar también parámetros de estilo/voz a tu API
        body: JSON.stringify({
          text: line.text,
          voice: 'meditacion_suave_es', // opcional: maneja esto en tu /api/tts
        }),
      });

      if (!response.ok) throw new Error('API ElevenLabs error');
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
      console.warn('⚠️ Falló ElevenLabs, usando voz del navegador:', error);
      setUsingFallback(true);
      setIsLoadingVoice(false);
      playWithBrowser(line.text, line.pause, script, index);
    }
  };

  const playWithBrowser = (
    text: string,
    pause: number,
    script: ScriptLine[],
    index: number,
  ) => {
    if (isCancelledRef.current || !synthRef.current) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-MX';
    utterance.rate = 0.9;

    const voices = synthRef.current.getVoices();
    const goodVoice = voices.find(
      (v) =>
        v.name.includes('Google') ||
        v.name.includes('Paulina') ||
        v.lang === 'es-MX',
    );
    if (goodVoice) utterance.voice = goodVoice;

    utterance.onend = () => {
      scriptTimeoutRef.current = setTimeout(() => {
        processScriptLine(script, index + 1);
      }, pause);
    };

    synthRef.current.speak(utterance);
  };

  const togglePlayPause = () => {
    if (!playingSession) return;

    if (isPlaying) {
      setIsPlaying(false);
      isCancelledRef.current = true;
      ambientAudioRef.current?.pause();
      voiceAudioRef.current?.pause();
      synthRef.current?.pause();
      if (scriptTimeoutRef.current) clearTimeout(scriptTimeoutRef.current);
      // Aquí consideramos que se interrumpió → fin no completado
      registrarFinSesion(false);
    } else {
      setIsPlaying(true);
      isCancelledRef.current = false;
      ambientAudioRef.current?.play();
      if (usingFallback && synthRef.current) {
        synthRef.current.resume();
        return;
      }
      const script =
        MEDITATION_SCRIPTS[playingSession.id] || MEDITATION_SCRIPTS[1];
      processScriptLine(script, scriptIndexRef.current);
    }
  };

  /* ========== UI DATA (podemos enlazarlo con `meditaciones` después) ========== */
  const sessions: UISession[] = [
    {
      id: 1,
      title: 'Sueño Profundo',
      description: 'Relajación progresiva para dormir profundamente.',
      duration: 15,
      category: 'Sueño',
      difficulty: 'Principiante',
      instructor: 'IA Guía',
      plays: 12450,
      rating: 4.9,
      color: 'from-indigo-500 to-purple-500',
      icon: <Moon className="w-6 h-6" />,
    },
    {
      id: 2,
      title: 'Respiración 4-7-8',
      description: 'Técnica SOS para momentos intensos de ansiedad.',
      duration: 5,
      category: 'Ansiedad',
      difficulty: 'Todos',
      instructor: 'IA Guía',
      plays: 8920,
      rating: 4.8,
      color: 'from-emerald-500 to-teal-500',
      icon: <Heart className="w-6 h-6" />,
    },
    {
      id: 3,
      title: 'Enfoque Total',
      description: 'Preparación mental para estudiar con concentración.',
      duration: 10,
      category: 'Concentración',
      difficulty: 'Intermedio',
      instructor: 'IA Guía',
      plays: 15320,
      rating: 4.9,
      color: 'from-amber-500 to-orange-500',
      icon: <Brain className="w-6 h-6" />,
    },
    {
      id: 4,
      title: 'Energía Matutina',
      description: 'Activa tu cuerpo y tu mente al despertar.',
      duration: 8,
      category: 'Energía',
      difficulty: 'Principiante',
      instructor: 'IA Guía',
      plays: 9870,
      rating: 4.7,
      color: 'from-yellow-500 to-orange-500',
      icon: <Coffee className="w-6 h-6" />,
    },
    {
      id: 5,
      title: 'Calma Exprés',
      description: 'Pausa breve para bajar el estrés del momento.',
      duration: 3,
      category: 'Estrés',
      difficulty: 'Todos',
      instructor: 'IA Guía',
      plays: 20100,
      rating: 5.0,
      color: 'from-cyan-500 to-blue-500',
      icon: <Zap className="w-6 h-6" />,
    },
    {
      id: 6,
      title: 'Escaneo Corporal',
      description: 'Mindfulness clásico para reconectar con tu cuerpo.',
      duration: 20,
      category: 'Relajación',
      difficulty: 'Intermedio',
      instructor: 'IA Guía',
      plays: 7650,
      rating: 4.8,
      color: 'from-purple-500 to-pink-500',
      icon: <Heart className="w-6 h-6" />,
    },
  ];

  const categories = [
    'Todos',
    'Sueño',
    'Ansiedad',
    'Concentración',
    'Energía',
    'Estrés',
    'Relajación',
  ];

  const filteredSessions = sessions.filter(
    (s) =>
      (selectedCategory === 'Todos' || s.category === selectedCategory) &&
      s.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const toggleFavorite = (id: number) =>
    setFavorites((p) => (p.includes(id) ? p.filter((f) => f !== id) : [...p, id]));

  /* ================== UI ================== */
  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8 px-4 ${
        playingSession ? 'pb-48' : 'pb-8'
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Sesiones Guiadas
          </h1>
          <p className="text-gray-600 text-lg">
            Meditaciones con voz IA + música de fondo, conectadas a tu historial.
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/20 shadow-lg mb-8 sticky top-4 z-30">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar sesión..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-400 outline-none bg-white/50"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid Sesiones */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((session) => (
            <div
              key={session.id}
              className="group bg-white/90 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/20 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <div
                className={`h-32 bg-gradient-to-br ${session.color} p-6 flex items-center justify-between relative`}
              >
                <div className="relative z-10 flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/30 backdrop-blur-xl rounded-xl flex items-center justify-center text-white">
                    {session.icon}
                  </div>
                  <span className="bg-black/10 px-2 py-1 rounded-lg text-white text-xs font-medium backdrop-blur-sm">
                    {session.category}
                  </span>
                </div>
                <button
                  onClick={() => toggleFavorite(session.id)}
                  className="relative z-10 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/40 transition-all"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      favorites.includes(session.id)
                        ? 'fill-white text-white'
                        : 'text-white'
                    }`}
                  />
                </button>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {session.title}
                </h3>
                <p className="text-gray-500 text-sm mb-4">{session.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {session.duration} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    {session.rating}
                  </span>
                </div>
                <button
                  onClick={() => playSession(session)}
                  className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                    playingSession?.id === session.id && isPlaying
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-gray-900 text-white hover:bg-gray-800 shadow-md'
                  }`}
                >
                  {playingSession?.id === session.id && isPlaying ? (
                    <>
                      <Pause className="w-4 h-4" /> Pausar
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" /> Iniciar
                    </>
                  )}
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
                  <Loader2 className="w-4 h-4 animate-spin" /> Conectando con la
                  voz IA...
                </div>
              ) : usingFallback ? (
                <div className="flex flex-col items-center">
                  <p className="text-lg font-medium text-emerald-800 animate-in fade-in">
                    "{currentSubtitle}"
                  </p>
                  <span className="flex items-center gap-1 text-[10px] text-gray-400 mt-1">
                    <WifiOff className="w-3 h-3" /> Modo ahorro (voz del
                    navegador)
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <p className="text-lg font-medium text-emerald-800 animate-in fade-in">
                    "{currentSubtitle}"
                  </p>
                  <span className="flex items-center gap-1 text-[10px] text-emerald-500 mt-1">
                    <Sparkles className="w-3 h-3" /> Voz neural con música de
                    fondo
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-4">
              {/* Información */}
              <div className="flex items-center gap-3 w-1/3 min-w-0">
                <div
                  className={`hidden sm:flex w-10 h-10 rounded-lg bg-gradient-to-br ${playingSession.color} items-center justify-center text-white shadow-sm`}
                >
                  {playingSession.icon}
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-bold text-gray-900 truncate text-sm">
                    {playingSession.title}
                  </h4>
                  <p className="text-xs text-gray-500 truncate">
                    Guía: IA + música ambiente
                  </p>
                </div>
              </div>

              {/* Botón Play */}
              <button
                onClick={togglePlayPause}
                className="w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald-200 shrink-0"
              >
                {isPlaying ? (
                  <Pause className="w-7 h-7" />
                ) : (
                  <Play className="w-7 h-7 ml-1" />
                )}
              </button>

              {/* Volumen */}
              <div className="flex items-center justify-end gap-2 w-1/3 group">
                <Volume2 className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={musicVolume}
                  onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                  className="w-24 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
