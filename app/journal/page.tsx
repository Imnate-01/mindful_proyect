'use client';

import { useEffect, useMemo, useState } from 'react';
import { Book, BarChart2, Plus, Sparkles, Save, Trash2, Calendar, ChevronDown, ChevronRight, Brain, Zap, X } from 'lucide-react';

/* ================= Tipos ================= */
type EmotionKey = 'ansiedad' | 'calma' | 'alegria' | 'tristeza' | 'enojo' | 'frustracion' | 'neutra';

interface EmotionDetection {
  emotion: EmotionKey;
  intensity: number;
  phrases: string[];
}

interface AIAnalysis {
  emotions: { emotion: EmotionKey; intensity: number; confidence: number; phrases: string[] }[];
  primary: EmotionKey;
  mood_vector: { valence: number; arousal: number };
  triggers: string[];
  body_signals: string[];
  cognitive_patterns: string[];
  protective_factors: string[];
  summary: string;
  suggestions_quick: string[];
  suggestions_practice: { title: string; minutes: number; steps: string[] }[];
  red_flags: { self_harm: boolean; crisis: boolean; reason: string };
  citations: string[];
  _model?: string;
}

type Entry = {
  emotion: EmotionKey;
  secondaryEmotions: EmotionKey[];
  intensity: number;
  notes: string;
  tags: string[];
  id: string;
  createdAt: string;
  aiAnalysis?: AIAnalysis;
};

/* ============== Temas por emoción (Diseño Mejorado) ============== */
const THEME: Record<EmotionKey, {
  name: string; emoji: string; gradFrom: string; gradTo: string;
  ring: string; slider: string; header: string; chip: string; color: string; bgSoft: string;
}> = {
  ansiedad: { name:'Ansiedad', emoji:'😟', gradFrom:'from-rose-400', gradTo:'to-orange-400', ring:'focus:ring-rose-300', slider:'accent-rose-500', header:'text-rose-600', chip:'bg-rose-100 text-rose-700 border-rose-200', color:'#f43f5e', bgSoft: 'bg-rose-50' },
  calma: { name:'Calma', emoji:'😌', gradFrom:'from-teal-400', gradTo:'to-emerald-400', ring:'focus:ring-teal-300', slider:'accent-teal-500', header:'text-teal-600', chip:'bg-teal-100 text-teal-700 border-teal-200', color:'#14b8a6', bgSoft: 'bg-teal-50' },
  alegria: { name:'Alegría', emoji:'😊', gradFrom:'from-amber-300', gradTo:'to-yellow-400', ring:'focus:ring-amber-300', slider:'accent-amber-500', header:'text-amber-600', chip:'bg-amber-100 text-amber-700 border-amber-200', color:'#f59e0b', bgSoft: 'bg-amber-50' },
  tristeza: { name:'Tristeza', emoji:'😢', gradFrom:'from-blue-400', gradTo:'to-indigo-400', ring:'focus:ring-blue-300', slider:'accent-blue-500', header:'text-blue-600', chip:'bg-blue-100 text-blue-700 border-blue-200', color:'#3b82f6', bgSoft: 'bg-blue-50' },
  enojo: { name:'Enojo', emoji:'😠', gradFrom:'from-red-500', gradTo:'to-orange-600', ring:'focus:ring-red-300', slider:'accent-red-500', header:'text-red-600', chip:'bg-red-100 text-red-700 border-red-200', color:'#ef4444', bgSoft: 'bg-red-50' },
  frustracion: { name:'Frustración', emoji:'😤', gradFrom:'from-orange-400', gradTo:'to-red-400', ring:'focus:ring-orange-300', slider:'accent-orange-500', header:'text-orange-600', chip:'bg-orange-100 text-orange-700 border-orange-200', color:'#f97316', bgSoft: 'bg-orange-50' },
  neutra: { name:'Neutra', emoji:'🙂', gradFrom:'from-gray-400', gradTo:'to-slate-400', ring:'focus:ring-gray-300', slider:'accent-gray-500', header:'text-gray-600', chip:'bg-gray-100 text-gray-700 border-gray-200', color:'#6b7280', bgSoft: 'bg-gray-50' },
};

/* ============== Helpers de Detección (Misma Lógica) ============== */
const KEYWORDS: Record<EmotionKey, RegExp[]> = {
  ansiedad: [/\b(preocup\w*|ansiedad\w*|presi[oó]n|miedo(s)?|nervio(s)?|estr[eé]s|abrumad\w*|angust\w*)\b/i],
  calma: [/\b(calma(da|do)?|tranquil\w*|paz|respiro|relaj\w*|sereno)\b/i],
  alegria: [/\b(feliz|alegr\w*|content\w*|agradecid\w*|bien|entusias\w*|genial|perfecto)\b/i],
  tristeza: [/\b(triste\w*|llor\w*|nostal\w*|melancol\w*|decepcion\w*|mal)\b/i],
  enojo: [/\b(enoj\w*|rabia|furioso|indignado|molesto)\b/i],
  frustracion: [/\b(frustr\w*|irritado|harto|cansado|no (pude|pod[ií]a)|no (sali[oó]|salen)|impotente)\b/i],
  neutra: [],
};

function detectEmotionsByPhrase(text: string): EmotionDetection[] {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 5);
  const map = new Map<EmotionKey, { count: number; phrases: Set<string> }>();

  sentences.forEach(sentence => {
    const sent = sentence.trim();
    (Object.keys(KEYWORDS) as EmotionKey[]).forEach(emotion => {
      KEYWORDS[emotion].forEach(regex => {
        if (regex.test(sent)) {
          if (!map.has(emotion)) map.set(emotion, { count: 0, phrases: new Set() });
          const d = map.get(emotion)!; d.count++; d.phrases.add(sent.slice(0, 80));
        }
      });
    });
  });

  const results: EmotionDetection[] = [];
  map.forEach((d, emotion) => results.push({
    emotion,
    intensity: Math.min(10, Math.round(3 + d.count * 2)),
    phrases: Array.from(d.phrases).slice(0, 2)
  }));
  results.sort((a, b) => b.intensity - a.intensity);
  return results.length ? results : [{ emotion: 'neutra', intensity: 5, phrases: [] }];
}

/* ============== API IA (Misma Lógica) ============== */
async function analyzeWithClaude(text: string): Promise<AIAnalysis | null> {
  try {
    const r = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text })
    });
    if (!r.ok) return null;
    const parsed = await r.json();
    return parsed as AIAnalysis; // Simplificado para brevedad, asumiendo que coincide
  } catch {
    return null;
  }
}

/* ============== Hooks (Misma Lógica) ============== */
function useDraftAutosave<T>(key: string, data: T, delay = 20000) {
  const [last, setLast] = useState<number | null>(null);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const id = setTimeout(() => {
      localStorage.setItem(key, JSON.stringify(data));
      setLast(Date.now());
    }, delay);
    return () => clearTimeout(id);
  }, [key, data, delay]);
  return last;
}

function useEntries() {
  const [entries, setEntries] = useState<Entry[]>([]);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = localStorage.getItem('journal:entries');
    if (raw) try { setEntries(JSON.parse(raw)); } catch {}
  }, []);

  const saveEntry = (entry: Omit<Entry, 'id' | 'createdAt'>) => {
    const item: Entry = { ...entry, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    const newList = [item, ...entries];
    setEntries(newList);
    if (typeof window !== 'undefined') localStorage.setItem('journal:entries', JSON.stringify(newList));
    if (typeof window !== 'undefined') localStorage.removeItem('journal:draft');
    return item.id;
  };

  const deleteEntry = (id: string) => {
    const newList = entries.filter(e => e.id !== id);
    setEntries(newList);
    if (typeof window !== 'undefined') localStorage.setItem('journal:entries', JSON.stringify(newList));
  };

  return { entries, saveEntry, deleteEntry };
}

function getWeeklyData(entries: Entry[]) {
  const now = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - (6 - i)));
    return { key: d.toISOString().slice(0, 10), label: d.toLocaleDateString('es', { weekday: 'short' }), entries: [] as Entry[] };
  });
  const indexByKey = new Map(days.map((d, i) => [d.key, i]));
  entries.forEach(e => {
    const idx = indexByKey.get(e.createdAt.slice(0, 10));
    if (idx !== undefined) days[idx].entries.push(e);
  });
  return days.map(d => ({
    day: d.label,
    avgIntensity: d.entries.length ? d.entries.reduce((s, e) => s + e.intensity, 0) / d.entries.length : 0,
    dominantEmotion: d.entries.reduce((acc, e) => (acc[e.emotion] = (acc[e.emotion] || 0) + 1, acc), {} as Record<EmotionKey, number>),
    count: d.entries.length
  }));
}

/* ============== Componentes UI Animados ============== */
function AnimatedCard({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setTimeout(() => setShow(true), delay));
    return () => cancelAnimationFrame(id);
  }, [delay]);
  return <div className={`transition-all duration-700 cubic-bezier(0.175, 0.885, 0.32, 1.275) ${show ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'} ${className}`}>{children}</div>;
}

/* ============== Vistas ============== */

function NuevaEntradaView({ onSave }: { onSave: (entry: Omit<Entry, 'id' | 'createdAt'>) => void }) {
  const [data, setData] = useState({ emotion: 'neutra' as EmotionKey, secondaryEmotions: [] as EmotionKey[], intensity: 5, notes: '', tags: [] as string[] });
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = localStorage.getItem('journal:draft');
    if (raw) try { setData(prev => ({ ...prev, ...JSON.parse(raw) })); } catch {}
  }, []);

  const lastSavedAt = useDraftAutosave('journal:draft', data, 5000);
  const quickDetection = useMemo(() => detectEmotionsByPhrase(data.notes), [data.notes]);
  const theme = THEME[data.emotion];

  const handleAIAnalysis = async () => {
    if (data.notes.trim().length < 20) return;
    setIsAnalyzing(true); setShowAIPanel(true);
    const result = await analyzeWithClaude(data.notes);
    setAiAnalysis(result); setIsAnalyzing(false);
  };

  const applyAIAnalysis = () => {
    if (!aiAnalysis) return;
    setData(prev => ({
      ...prev,
      emotion: aiAnalysis.primary,
      secondaryEmotions: aiAnalysis.emotions.slice(1, 3).map(e => e.emotion as EmotionKey),
      intensity: aiAnalysis.emotions[0]?.intensity ?? 5
    }));
  };

  const handleSave = () => {
    onSave({ ...data, notes: data.notes.trim(), tags: data.tags.map(t => t.trim()).filter(Boolean), aiAnalysis: aiAnalysis || undefined });
    setData({ emotion: 'neutra', secondaryEmotions: [], intensity: 5, notes: '', tags: [] });
    setAiAnalysis(null); setShowAIPanel(false);
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      
      {/* 1. Selector de Emoción Visual */}
      <AnimatedCard>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">¿Cómo te sientes hoy?</h2>
          <p className="text-gray-500">Selecciona la emoción que mejor te describa</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {(Object.keys(THEME) as EmotionKey[]).map((e) => {
            const t = THEME[e];
            const isSelected = data.emotion === e;
            return (
              <button
                key={e}
                onClick={() => setData({ ...data, emotion: e })}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 border-2 ${
                  isSelected 
                    ? `bg-white border-${t.color} shadow-lg scale-105 ring-2 ring-offset-2 ring-${t.color}` 
                    : 'bg-white/50 border-transparent hover:bg-white hover:border-gray-200 hover:scale-105'
                }`}
                style={{ borderColor: isSelected ? t.color : undefined }}
              >
                <span className="text-3xl mb-1 filter drop-shadow-sm">{t.emoji}</span>
                <span className={`text-xs font-bold ${isSelected ? 'text-gray-900' : 'text-gray-500'}`}>{t.name}</span>
              </button>
            )
          })}
        </div>
      </AnimatedCard>

      {/* 2. Área de Escritura + Slider */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
           <AnimatedCard delay={100}>
            <div className={`bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/40 shadow-xl transition-colors duration-500 ${theme.ring} ring-1 ring-opacity-20`}>
              <div className="flex justify-between items-center mb-3">
                 <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                   <Book className="w-4 h-4 text-emerald-500"/> Tu Diario
                 </label>
                 <span className="text-xs text-gray-400 font-medium">{lastSavedAt ? 'Autoguardado' : 'Escribiendo...'}</span>
              </div>
              <textarea
                value={data.notes}
                onChange={(e) => setData({ ...data, notes: e.target.value })}
                placeholder="Hoy me siento..."
                className="w-full h-64 bg-transparent border-0 resize-none focus:ring-0 text-gray-700 text-lg leading-relaxed placeholder:text-gray-400"
              />
              
              {/* Botones de Acción dentro de la tarjeta */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100/50">
                 <div className="flex gap-2">
                   {quickDetection.length > 1 && (
                     quickDetection.slice(0, 2).map(det => (
                        <button key={det.emotion} onClick={() => setData(prev => ({...prev, secondaryEmotions: [...prev.secondaryEmotions, det.emotion]}))} className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                           + {THEME[det.emotion].name}
                        </button>
                     ))
                   )}
                 </div>
                 <button
                    onClick={handleAIAnalysis}
                    disabled={isAnalyzing || data.notes.trim().length < 20}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-full text-sm font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? <div className="animate-spin">✨</div> : <Sparkles className="w-4 h-4" />}
                    {isAnalyzing ? 'Pensando...' : 'Analizar IA'}
                 </button>
              </div>
            </div>
          </AnimatedCard>
        </div>

        <div className="space-y-6">
          <AnimatedCard delay={200}>
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/40 shadow-lg">
              <label className="block mb-4">
                <span className="text-sm font-bold text-gray-700 mb-1 block">Intensidad</span>
                <span className={`text-3xl font-black ${theme.header}`}>{data.intensity}</span>
                <span className="text-gray-400 text-sm"> / 10</span>
              </label>
              <div className="h-64 flex flex-col justify-center">
                 <input
                  type="range" min={1} max={10} value={data.intensity}
                  onChange={(e) => setData({ ...data, intensity: Number(e.target.value) })}
                  className={`w-full appearance-none h-4 rounded-full outline-none cursor-pointer shadow-inner ${theme.slider}`}
                  style={{ 
                    background: `linear-gradient(to right, ${theme.color} 0%, ${theme.color} ${data.intensity * 10}%, #e2e8f0 ${data.intensity * 10}%, #e2e8f0 100%)`,
                    transform: 'rotate(-90deg)',
                    width: '256px', // Alto del contenedor
                    margin: '-120px 0' // Compensar rotación
                  }}
                />
              </div>
            </div>
          </AnimatedCard>
          
          <AnimatedCard delay={300}>
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/40 shadow-lg">
              <label className="text-sm font-bold text-gray-700 mb-2 block">Etiquetas</label>
              <input
                type="text"
                value={(data.tags || []).join(', ')}
                onChange={(e) => setData({ ...data, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                placeholder="escuela, amigos..."
                className="w-full bg-white/50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
              />
            </div>
          </AnimatedCard>
        </div>
      </div>

      {/* Panel IA */}
      {showAIPanel && aiAnalysis && (
        <AnimatedCard delay={50} className="relative z-10">
          <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-3xl p-8 border-2 border-violet-100 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Brain className="w-64 h-64 text-violet-500" />
             </div>
             <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                   <div>
                      <h3 className="text-2xl font-bold text-violet-900 flex items-center gap-2"><Sparkles className="w-6 h-6 text-violet-500"/> Insights de IA</h3>
                      <p className="text-violet-600">Esto es lo que noté en tu escritura...</p>
                   </div>
                   <button onClick={() => setShowAIPanel(false)} className="p-2 hover:bg-black/5 rounded-full"><X className="w-5 h-5 text-gray-500"/></button>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                   <div className="bg-white/60 rounded-2xl p-4">
                      <h4 className="font-bold text-gray-700 mb-2 text-sm uppercase tracking-wider">Análisis Emocional</h4>
                      <div className="space-y-2">
                        {aiAnalysis.emotions.map((e, i) => (
                           <div key={i} className="flex justify-between items-center p-2 bg-white rounded-lg shadow-sm">
                              <span className="flex items-center gap-2">{THEME[e.emotion as EmotionKey].emoji} <span className="font-medium">{THEME[e.emotion as EmotionKey].name}</span></span>
                              <div className="h-2 w-24 bg-gray-100 rounded-full overflow-hidden">
                                 <div className={`h-full ${THEME[e.emotion as EmotionKey].chip.split(' ')[0].replace('text-', 'bg-').replace('100', '500')}`} style={{width: `${e.intensity * 10}%`}}></div>
                              </div>
                           </div>
                        ))}
                      </div>
                   </div>
                   <div className="bg-white/60 rounded-2xl p-4">
                      <h4 className="font-bold text-gray-700 mb-2 text-sm uppercase tracking-wider">Resumen & Consejos</h4>
                      <p className="text-sm text-gray-600 mb-3 leading-relaxed">{aiAnalysis.summary}</p>
                      <div className="flex flex-wrap gap-2">
                         {aiAnalysis.suggestions_quick.map((s, i) => <span key={i} className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md border border-emerald-200">💡 {s}</span>)}
                      </div>
                   </div>
                </div>
                <button onClick={applyAIAnalysis} className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-violet-200">
                   Aplicar estos resultados a mi entrada
                </button>
             </div>
          </div>
        </AnimatedCard>
      )}

      {/* Botón Guardar Flotante */}
      <AnimatedCard delay={400}>
        <button onClick={handleSave} className={`w-full py-4 rounded-2xl bg-gradient-to-r ${theme.gradFrom} ${theme.gradTo} text-white font-bold text-lg shadow-lg hover:shadow-2xl hover:scale-[1.01] transition-all flex items-center justify-center gap-3`}>
           <Save className="w-6 h-6" /> Guardar Entrada
        </button>
      </AnimatedCard>
    </div>
  );
}

function HistorialView({ entries, onDelete }: { entries: Entry[]; onDelete: (id: string) => void }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (entries.length === 0) return (
    <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
      <Book className="w-24 h-24 text-gray-300 mb-4" strokeWidth={1} />
      <h3 className="text-xl font-bold text-gray-400">Tu historia comienza hoy</h3>
      <p className="text-gray-400 max-w-xs mx-auto">Escribe tu primera entrada para empezar a ver tus patrones emocionales.</p>
    </div>
  );

  return (
    <div className="grid gap-4 max-w-3xl mx-auto">
      {entries.map((entry, i) => {
        const theme = THEME[entry.emotion];
        const isExpanded = expandedId === entry.id;
        return (
          <AnimatedCard key={entry.id} delay={i * 50}>
            <div className={`group relative bg-white/80 backdrop-blur-md border border-white/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden`}>
              {/* Barra lateral de color */}
              <div className={`absolute left-0 top-0 bottom-0 w-2 ${theme.chip.split(' ')[0].replace('text', 'bg').replace('100', '500')}`}></div>
              
              <div className="p-5 pl-8 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : entry.id)}>
                <div className="flex justify-between items-start">
                  <div className="flex gap-4 items-center">
                     <div className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-2xl text-3xl shadow-inner">
                        {theme.emoji}
                     </div>
                     <div>
                        <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                           {theme.name} 
                           <span className="text-xs font-normal px-2 py-0.5 bg-gray-100 rounded-full text-gray-500">{new Date(entry.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </h3>
                        <p className="text-sm text-gray-500 capitalize">{new Date(entry.createdAt).toLocaleDateString(undefined, {weekday: 'long', day:'numeric', month:'long'})}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="text-right hidden sm:block">
                        <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Intensidad</div>
                        <div className={`text-xl font-black ${theme.header}`}>{entry.intensity}</div>
                     </div>
                     <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}/>
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="px-8 pb-6 pt-2 pl-8 border-t border-gray-100 animate-in slide-in-from-top-2">
                  <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap mb-6 font-serif">{entry.notes}</p>
                  
                  {entry.aiAnalysis && (
                    <div className="bg-gradient-to-r from-violet-50 to-fuchsia-50 p-4 rounded-xl border border-violet-100 mb-4 flex gap-3">
                       <Sparkles className="w-5 h-5 text-violet-500 flex-shrink-0 mt-1" />
                       <div>
                          <p className="text-xs font-bold text-violet-700 uppercase tracking-wide mb-1">Análisis IA</p>
                          <p className="text-sm text-violet-900">{entry.aiAnalysis.summary}</p>
                       </div>
                    </div>
                  )}

                  <div className="flex justify-between items-end mt-4">
                     <div className="flex gap-2 flex-wrap">
                        {entry.tags.map(t => <span key={t} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">#{t}</span>)}
                     </div>
                     <button onClick={(e) => { e.stopPropagation(); onDelete(entry.id); }} className="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors">
                        <Trash2 className="w-5 h-5" />
                     </button>
                  </div>
                </div>
              )}
            </div>
          </AnimatedCard>
        );
      })}
    </div>
  );
}

function AnalisisView({ entries }: { entries: Entry[] }) {
  const weeklyData = getWeeklyData(entries);
  const maxIntensity = Math.max(...weeklyData.map(d => d.avgIntensity), 1);
  // Cálculos simplificados
  const totalEntries = entries.length;
  const avgMood = entries.reduce((acc, curr) => acc + curr.intensity, 0) / (totalEntries || 1);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="grid md:grid-cols-3 gap-4">
         <AnimatedCard delay={0}>
            <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-white/60">
               <div className="text-gray-500 text-sm font-medium mb-1">Entradas Totales</div>
               <div className="text-4xl font-black text-gray-800">{totalEntries}</div>
            </div>
         </AnimatedCard>
         <AnimatedCard delay={50}>
            <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-white/60">
               <div className="text-gray-500 text-sm font-medium mb-1">Intensidad Promedio</div>
               <div className="text-4xl font-black text-emerald-600">{avgMood.toFixed(1)}</div>
            </div>
         </AnimatedCard>
         <AnimatedCard delay={100}>
            <div className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white p-6 rounded-3xl shadow-lg">
               <div className="text-white/80 text-sm font-medium mb-1">Racha Actual</div>
               <div className="text-4xl font-black flex items-center gap-2">3 <span className="text-lg font-normal opacity-80">días</span> 🔥</div>
            </div>
         </AnimatedCard>
      </div>

      <AnimatedCard delay={200}>
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-lg">
          <div className="flex items-center gap-2 mb-8">
             <BarChart2 className="w-6 h-6 text-gray-400" />
             <h3 className="text-xl font-bold text-gray-800">Estado de Ánimo Semanal</h3>
          </div>
          
          <div className="flex items-end justify-between h-64 gap-2 md:gap-4">
            {weeklyData.map((day, i) => {
              const height = (day.avgIntensity / 10) * 100;
              const dominantEntry = Object.entries(day.dominantEmotion).sort((a, b) => b[1] - a[1])[0];
              const emotion = dominantEntry ? dominantEntry[0] as EmotionKey : 'neutra';
              const theme = THEME[emotion];
              
              return (
                <div key={i} className="flex-1 flex flex-col items-center group relative">
                  {/* Tooltip */}
                  <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10">
                     {theme.name}: {day.avgIntensity.toFixed(1)}
                  </div>
                  
                  <div className="w-full relative flex items-end justify-center rounded-2xl bg-gray-100/50 h-full overflow-hidden">
                     {day.count > 0 && (
                        <div 
                           className={`w-full bg-gradient-to-t ${theme.gradFrom} ${theme.gradTo} rounded-t-xl transition-all duration-1000 ease-out opacity-90 group-hover:opacity-100`} 
                           style={{ height: `${height || 5}%` }} 
                        />
                     )}
                  </div>
                  <div className="mt-3 text-center">
                     <div className="text-xl mb-1 filter drop-shadow-sm transition-transform group-hover:scale-125">{day.count > 0 ? theme.emoji : ''}</div>
                     <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{day.day}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </AnimatedCard>
    </div>
  );
}

/* ============== Layout Principal ============== */
export default function DiarioPage() {
  const [view, setView] = useState<'nueva' | 'historial' | 'analisis'>('nueva');
  const { entries, saveEntry, deleteEntry } = useEntries();
  const [toast, setToast] = useState<{ show: boolean; msg: string }>({ show: false, msg: '' });
  
  const showToast = (msg: string) => { setToast({ show: true, msg }); setTimeout(() => setToast({ show: false, msg: '' }), 3000); };
  const handleSave = (entry: Omit<Entry, 'id' | 'createdAt'>) => { saveEntry(entry); showToast('✨ Entrada guardada en tu diario'); setView('historial'); };

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 pb-20">
      <div className="max-w-5xl mx-auto px-4 py-8">
        
        {/* Header de Página */}
        <div className="text-center mb-10 space-y-2">
           <div className="inline-flex items-center justify-center p-3 bg-white/40 backdrop-blur-md rounded-2xl mb-4 shadow-sm border border-white/50">
              <span className="text-4xl">📓</span>
           </div>
           <h1 className="text-4xl md:text-5xl font-black text-gray-800 tracking-tight">
              Diario <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Emocional</span>
           </h1>
           <p className="text-lg text-gray-500 font-medium max-w-lg mx-auto">
              Un espacio seguro para documentar tu viaje, entender tus emociones y crecer cada día.
           </p>
        </div>

        {/* Navegación Flotante Estilo iOS */}
        <div className="sticky top-24 z-30 flex justify-center mb-8">
           <div className="bg-white/80 backdrop-blur-xl p-1.5 rounded-full shadow-xl border border-white/50 flex gap-1">
              {[
                 { id: 'nueva', label: 'Escribir', icon: Plus },
                 { id: 'historial', label: 'Historial', icon: Book },
                 { id: 'analisis', label: 'Insights', icon: BarChart2 },
              ].map((item) => {
                 const isActive = view === item.id;
                 const Icon = item.icon;
                 return (
                    <button 
                       key={item.id}
                       onClick={() => setView(item.id as any)}
                       className={`
                          flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300
                          ${isActive ? 'bg-gray-900 text-white shadow-lg scale-105' : 'text-gray-500 hover:bg-gray-100/80 hover:text-gray-900'}
                       `}
                    >
                       <Icon className="w-4 h-4" />
                       {item.label}
                    </button>
                 )
              })}
           </div>
        </div>

        {/* Contenido */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
           {view === 'nueva' && <NuevaEntradaView onSave={handleSave} />}
           {view === 'historial' && <HistorialView entries={entries} onDelete={deleteEntry} />}
           {view === 'analisis' && <AnalisisView entries={entries} />}
        </div>
      </div>

      {/* Toast Notification */}
      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
         <div className="bg-gray-900/90 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3">
            <div className="bg-emerald-500 rounded-full p-1"><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2U9IndoaXRlIiBjbGFzcz0idy0zIGgtMyI+PHBhdGggc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBkPSJNND.UgMjBsNiA3LjYgOS0xMi42IiAvPjwvc3ZnPg==" className="w-3 h-3" alt="check"/></div>
            <span className="font-medium">{toast.msg}</span>
         </div>
      </div>
    </main>
  );
}