'use client';

import { useEffect, useMemo, useState } from 'react';

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
  _model?: string; // opcional (lo devuelve tu API)
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

/* ============== Temas por emoción ============== */
const THEME: Record<EmotionKey, {
  name: string; emoji: string; gradFrom: string; gradTo: string;
  ring: string; slider: string; header: string; chip: string; color: string;
}> = {
  ansiedad: { name:'Ansiedad', emoji:'😟', gradFrom:'from-red-50', gradTo:'to-orange-50', ring:'focus:ring-red-300', slider:'accent-red-500', header:'text-red-600', chip:'bg-red-100 text-red-700 border-red-300', color:'#ef4444' },
  calma: { name:'Calma', emoji:'😌', gradFrom:'from-blue-50', gradTo:'to-cyan-50', ring:'focus:ring-blue-300', slider:'accent-blue-500', header:'text-blue-600', chip:'bg-blue-100 text-blue-700 border-blue-300', color:'#3b82f6' },
  alegria: { name:'Alegría', emoji:'😊', gradFrom:'from-yellow-50', gradTo:'to-amber-50', ring:'focus:ring-yellow-300', slider:'accent-yellow-500', header:'text-yellow-600', chip:'bg-yellow-100 text-yellow-700 border-yellow-300', color:'#eab308' },
  tristeza: { name:'Tristeza', emoji:'😢', gradFrom:'from-indigo-50', gradTo:'to-purple-50', ring:'focus:ring-indigo-300', slider:'accent-indigo-500', header:'text-indigo-600', chip:'bg-indigo-100 text-indigo-700 border-indigo-300', color:'#6366f1' },
  enojo: { name:'Enojo', emoji:'😠', gradFrom:'from-rose-50', gradTo:'to-pink-50', ring:'focus:ring-rose-300', slider:'accent-rose-500', header:'text-rose-600', chip:'bg-rose-100 text-rose-700 border-rose-300', color:'#f43f5e' },
  frustracion: { name:'Frustración', emoji:'😤', gradFrom:'from-orange-50', gradTo:'to-red-50', ring:'focus:ring-orange-300', slider:'accent-orange-500', header:'text-orange-600', chip:'bg-orange-100 text-orange-700 border-orange-300', color:'#f97316' },
  neutra: { name:'Neutra', emoji:'🙂', gradFrom:'from-gray-50', gradTo:'to-slate-50', ring:'focus:ring-gray-300', slider:'accent-gray-500', header:'text-gray-600', chip:'bg-gray-100 text-gray-700 border-gray-300', color:'#6b7280' },
};

/* ============== Detector rápido por frases ============== */
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

/* ============== IA (via API interna) ============== */
async function analyzeWithClaude(text: string): Promise<AIAnalysis | null> {
  try {
    const r = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text })
    });
    if (!r.ok) return null;
    const parsed = await r.json();

    // Mapear estrictamente al nuevo esquema:
    const out: AIAnalysis = {
      emotions: Array.isArray(parsed.emotions) ? parsed.emotions.map((e: any) => ({
        emotion: (e.emotion ?? 'neutra') as EmotionKey,
        intensity: Number(e.intensity ?? 5),
        confidence: Number(e.confidence ?? 0.7),
        phrases: Array.isArray(e.phrases) ? e.phrases : []
      })) : [],
      primary: (parsed.primary ?? 'neutra') as EmotionKey,
      mood_vector: parsed.mood_vector ?? { valence: 0, arousal: 5 },
      triggers: parsed.triggers ?? [],
      body_signals: parsed.body_signals ?? [],
      cognitive_patterns: parsed.cognitive_patterns ?? [],
      protective_factors: parsed.protective_factors ?? [],
      summary: parsed.summary ?? '',
      suggestions_quick: parsed.suggestions_quick ?? [],
      suggestions_practice: Array.isArray(parsed.suggestions_practice) ? parsed.suggestions_practice : [],
      red_flags: parsed.red_flags ?? { self_harm: false, crisis: false, reason: '' },
      citations: parsed.citations ?? [],
      _model: parsed._model
    };

    return out;
  } catch {
    return null;
  }
}

/* ============== Autosave de borrador ============== */
function useDraftAutosave<T>(key: string, data: T, delay = 20000) {
  const [last, setLast] = useState<number | null>(null);

  // (carga es gestionada en la vista con un efecto propio)
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

/* ============== Storage de entradas ============== */
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
    if (typeof window !== 'undefined') localStorage.removeItem('journal:draft'); // limpiar borrador
    return item.id;
  };

  const deleteEntry = (id: string) => {
    const newList = entries.filter(e => e.id !== id);
    setEntries(newList);
    if (typeof window !== 'undefined') localStorage.setItem('journal:entries', JSON.stringify(newList));
  };

  return { entries, saveEntry, deleteEntry };
}

/* ============== Analítica semanal robusta (sin DST) ============== */
function ymd(d: Date) { return d.toISOString().slice(0, 10); }

function getWeeklyData(entries: Entry[]) {
  const now = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - (6 - i)));
    return { key: ymd(d), label: d.toLocaleDateString('es', { weekday: 'short' }), entries: [] as Entry[] };
  });
  const indexByKey = new Map(days.map((d, i) => [d.key, i]));
  entries.forEach(e => {
    const idx = indexByKey.get(ymd(new Date(e.createdAt)));
    if (idx !== undefined) days[idx].entries.push(e);
  });
  return days.map(d => ({
    day: d.label,
    avgIntensity: d.entries.length ? d.entries.reduce((s, e) => s + e.intensity, 0) / d.entries.length : 0,
    dominantEmotion: d.entries.reduce((acc, e) => (acc[e.emotion] = (acc[e.emotion] || 0) + 1, acc), {} as Record<EmotionKey, number>),
    count: d.entries.length
  }));
}

/* ============== Helpers UI ============== */
function AnimatedCard({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setTimeout(() => setShow(true), delay));
    return () => cancelAnimationFrame(id);
  }, [delay]);
  return <div className={`transition-all duration-500 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${className}`}>{children}</div>;
}

/* ============== Vista: Nueva Entrada ============== */
function NuevaEntradaView({ onSave }: { onSave: (entry: Omit<Entry, 'id' | 'createdAt'>) => void }) {
  const [data, setData] = useState({ emotion: 'neutra' as EmotionKey, secondaryEmotions: [] as EmotionKey[], intensity: 5, notes: '', tags: [] as string[] });
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);

  // cargar borrador si existe (solo una vez)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = localStorage.getItem('journal:draft');
    if (raw) try { setData(prev => ({ ...prev, ...JSON.parse(raw) })); } catch {}
  }, []);

  const lastSavedAt = useDraftAutosave('journal:draft', data, 20000);
  const quickDetection = useMemo(() => detectEmotionsByPhrase(data.notes), [data.notes]);
  const theme = THEME[data.emotion];

  const handleAIAnalysis = async () => {
    if (data.notes.trim().length < 20) { alert('Escribe al menos 20 caracteres para análisis IA'); return; }
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

  const toggleSecondary = (emotion: EmotionKey) => {
    setData(prev => ({
      ...prev,
      secondaryEmotions: prev.secondaryEmotions.includes(emotion)
        ? prev.secondaryEmotions.filter(e => e !== emotion)
        : [...prev.secondaryEmotions, emotion].slice(0, 3)
    }));
  };

  const handleSave = () => {
    const trimmed = data.notes.trim();
    const cleanTags = data.tags.map(t => t.trim()).filter(Boolean).slice(0, 8);
    onSave({ ...data, notes: trimmed, tags: cleanTags, aiAnalysis: aiAnalysis || undefined });
    setData({ emotion: 'neutra', secondaryEmotions: [], intensity: 5, notes: '', tags: [] });
    setAiAnalysis(null); setShowAIPanel(false);
  };

  return (
    <div className="space-y-6">
      <AnimatedCard>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{theme.emoji}</div>
            <div>
              <h2 className={`text-2xl font-bold ${theme.header}`}>Nueva Entrada</h2>
              <p className="text-xs text-gray-500">
                {lastSavedAt ? `Autoguardado hace ${Math.floor((Date.now() - lastSavedAt) / 1000)}s` : 'Sin guardar'}
              </p>
            </div>
          </div>
          <button
            onClick={handleAIAnalysis}
            disabled={isAnalyzing || data.notes.trim().length < 20}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
            aria-label="Analizar con IA"
          >
            <span className="text-lg">🤖</span>{isAnalyzing ? 'Analizando...' : 'Analizar con IA'}
          </button>
        </div>
      </AnimatedCard>

      {showAIPanel && (
        <AnimatedCard delay={50}>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2"><span className="text-2xl">🧠</span><h3 className="font-bold text-purple-900">Análisis IA</h3></div>
              <button onClick={() => setShowAIPanel(false)} className="text-gray-500 hover:text-gray-700" aria-label="Cerrar panel IA">✕</button>
            </div>

            {isAnalyzing ? (
              <div className="flex items-center justify-center py-8"><div className="animate-spin text-4xl">🔄</div></div>
            ) : aiAnalysis ? (
              <div className="space-y-4">
                {/* Emociones */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Emociones detectadas:</p>
                  <div className="space-y-2">
                    {aiAnalysis.emotions.map((e, i) => {
                      const eTheme = THEME[e.emotion];
                      return (
                        <div key={i} className="flex items-center gap-3 bg-white rounded-lg p-3">
                          <span className="text-2xl">{eTheme.emoji}</span>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{eTheme.name}</p>
                            <p className="text-xs text-gray-600">{e.phrases?.[0]}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-bold ${eTheme.chip} border`}>{e.intensity}/10</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Resumen */}
                {aiAnalysis.summary && (
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-700">{aiAnalysis.summary}</p>
                  </div>
                )}

                {/* Sugerencias rápidas */}
                {aiAnalysis.suggestions_quick?.length > 0 && (
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">💡 Sugerencias rápidas:</p>
                    <ul className="space-y-1">
                      {aiAnalysis.suggestions_quick.map((s, i) => (
                        <li key={i} className="text-sm text-gray-600 flex gap-2"><span>•</span><span>{s}</span></li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Primer ejercicio guiado (opcional) */}
                {aiAnalysis.suggestions_practice?.[0] && (
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">🧩 {aiAnalysis.suggestions_practice[0].title} ({aiAnalysis.suggestions_practice[0].minutes} min)</p>
                    <ol className="list-decimal ml-5 text-sm text-gray-700 space-y-1">
                      {aiAnalysis.suggestions_practice[0].steps.map((st, i) => <li key={i}>{st}</li>)}
                    </ol>
                  </div>
                )}

                {/* Modelo (debug A/B) */}
                {aiAnalysis._model && <p className="text-[11px] text-gray-400 text-right">IA: {aiAnalysis._model}</p>}

                <button onClick={applyAIAnalysis} className="w-full bg-purple-600 text-white rounded-lg py-3 font-medium hover:bg-purple-700 transition-colors">✨ Aplicar análisis IA</button>
              </div>
            ) : (
              <p className="text-center text-gray-600 py-4">No se pudo completar el análisis</p>
            )}
          </div>
        </AnimatedCard>
      )}

      {/* Select emoción */}
      <AnimatedCard delay={100}>
        <label className="block">
          <span className="text-sm font-medium text-gray-700 mb-2 block">Emoción Principal</span>
          <select
            className={`w-full rounded-xl border-2 border-gray-200 bg-white p-4 outline-none hover:border-gray-300 ${theme.ring}`}
            value={data.emotion}
            onChange={(e) => setData({ ...data, emotion: e.target.value as EmotionKey })}
          >
            {(Object.keys(THEME) as EmotionKey[]).map((e) => <option key={e} value={e}>{THEME[e].emoji} {THEME[e].name}</option>)}
          </select>
        </label>
      </AnimatedCard>

      {/* Detección rápida (usa memo ya calculado) */}
      {quickDetection.length > 1 && !showAIPanel && (
        <AnimatedCard delay={150}>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
            <p className="text-sm font-medium text-blue-900 mb-3">🔍 Emociones detectadas en tu texto:</p>
            <div className="flex flex-wrap gap-2">
              {quickDetection.slice(0, 3).map(det => {
                const isSelected = data.secondaryEmotions.includes(det.emotion);
                const detTheme = THEME[det.emotion];
                return (
                  <button
                    key={det.emotion}
                    onClick={() => toggleSecondary(det.emotion)}
                    className={`px-3 py-2 rounded-lg border-2 transition-all ${isSelected ? `${detTheme.chip} border-current shadow-md scale-105` : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'}`}
                  >
                    <span className="text-lg mr-1">{detTheme.emoji}</span>{detTheme.name}
                  </button>
                );
              })}
            </div>
          </div>
        </AnimatedCard>
      )}

      {/* Secundarias */}
      {data.secondaryEmotions.length > 0 && (
        <AnimatedCard delay={200}>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Emociones Secundarias:</p>
            <div className="flex flex-wrap gap-2">
              {data.secondaryEmotions.map(emotion => {
                const secTheme = THEME[emotion];
                return (
                  <span key={emotion} className={`px-3 py-1 rounded-full text-sm font-medium ${secTheme.chip} border flex items-center gap-2`}>
                    {secTheme.emoji} {secTheme.name}
                    <button onClick={() => toggleSecondary(emotion)} className="hover:text-gray-900" aria-label={`Quitar ${secTheme.name}`}>✕</button>
                  </span>
                );
              })}
            </div>
          </div>
        </AnimatedCard>
      )}

      {/* Intensidad */}
      <AnimatedCard delay={250}>
        <label className="block">
          <span className="text-sm font-medium text-gray-700 mb-2 block">Intensidad: {data.intensity}/10</span>
          <input
            type="range" min={1} max={10} value={data.intensity}
            onChange={(e) => setData({ ...data, intensity: Number(e.target.value) })}
            className={`w-full h-3 rounded-full appearance-none cursor-pointer ${theme.slider}`}
            style={{ color: theme.color, background: `linear-gradient(to right, ${theme.color} 0%, ${theme.color} ${data.intensity * 10}%, #e5e7eb ${data.intensity * 10}%, #e5e7eb 100%)` }}
          />
        </label>
      </AnimatedCard>

      {/* Notas */}
      <AnimatedCard delay={300}>
        <label className="block">
          <span className="text-sm font-medium text-gray-700 mb-2 block">¿Qué está pasando?</span>
          <textarea
            value={data.notes}
            onChange={(e) => setData({ ...data, notes: e.target.value })}
            placeholder="Escribe libremente sobre tus pensamientos y emociones..."
            className={`h-48 w-full resize-none rounded-xl border-2 border-gray-200 bg-white p-4 outline-none hover:border-gray-300 ${theme.ring}`}
          />
          <p className="text-xs text-gray-500 mt-1">
            {data.notes.length} caracteres • {data.notes.trim().length >= 20 ? '✅ Listo para análisis IA' : '⏳ Mínimo 20 para IA'}
          </p>
        </label>
      </AnimatedCard>

      {/* Tags */}
      <AnimatedCard delay={350}>
        <label className="block">
          <span className="text-sm font-medium text-gray-700 mb-2 block">Etiquetas</span>
          <input
            type="text"
            value={(data.tags || []).join(', ')}
            onChange={(e) => setData({ ...data, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
            placeholder="ej: escuela, amigos, familia"
            className={`w-full rounded-xl border-2 border-gray-200 bg-white p-4 outline-none hover:border-gray-300 ${theme.ring}`}
          />
        </label>
      </AnimatedCard>

      {/* Guardar */}
      <AnimatedCard delay={400}>
        <button onClick={handleSave}
          className={`w-full rounded-xl bg-gradient-to-r ${theme.gradFrom} ${theme.gradTo} border-2 ${theme.header.replace('text-', 'border-')} px-6 py-4 text-lg font-bold ${theme.header} hover:scale-[1.02] transition-transform shadow-lg`}>
          💾 Guardar Entrada
        </button>
      </AnimatedCard>
    </div>
  );
}

/* ============== Vista: Historial ============== */
function HistorialView({ entries, onDelete }: { entries: Entry[]; onDelete: (id: string) => void }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  if (entries.length === 0) return (
    <div className="text-center py-16">
      <div className="text-6xl mb-4">📔</div>
      <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay entradas aún</h3>
      <p className="text-gray-500">Comienza a escribir tu primer registro</p>
    </div>
  );

  return (
    <div className="space-y-4">
      {entries.map((entry, i) => {
        const theme = THEME[entry.emotion];
        const isExpanded = expandedId === entry.id;
        const date = new Date(entry.createdAt);
        return (
          <AnimatedCard key={entry.id} delay={i * 50}>
            <div className={`rounded-xl border-2 ${theme.header.replace('text-', 'border-')} bg-white overflow-hidden transition-all hover:shadow-lg`}>
              <div className={`p-4 cursor-pointer bg-gradient-to-r ${theme.gradFrom} ${theme.gradTo}`} onClick={() => setExpandedId(isExpanded ? null : entry.id)}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{theme.emoji}</span>
                    <div>
                      <h3 className={`font-bold ${theme.header}`}>{theme.name}</h3>
                      <p className="text-sm text-gray-600">
                        {date.toLocaleDateString('es', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {entry.secondaryEmotions?.length > 0 && (
                        <div className="flex gap-1 mt-1">{entry.secondaryEmotions.map(e => <span key={e} className="text-lg">{THEME[e].emoji}</span>)}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${theme.chip} border`}>{entry.intensity}/10</span>
                    <span className="text-gray-400">{isExpanded ? '▼' : '▶'}</span>
                  </div>
                </div>
              </div>
              {isExpanded && (
                <div className="p-4 space-y-3">
                  <p className="text-gray-700 leading-relaxed">{entry.notes}</p>
                  {entry.aiAnalysis && (
                    <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                      <p className="text-xs font-medium text-purple-900 mb-1">🧠 Análisis IA:</p>
                      <p className="text-sm text-purple-800">{entry.aiAnalysis.summary}</p>
                    </div>
                  )}
                  {entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {entry.tags.map(tag => <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">#{tag}</span>)}
                    </div>
                  )}
                  <button onClick={() => onDelete(entry.id)} className="text-red-600 hover:text-red-700 text-sm font-medium" aria-label="Eliminar entrada">🗑️ Eliminar entrada</button>
                </div>
              )}
            </div>
          </AnimatedCard>
        );
      })}
    </div>
  );
}

/* ============== Vista: Análisis ============== */
function AnalisisView({ entries }: { entries: Entry[] }) {
  const weeklyData = getWeeklyData(entries);
  const maxIntensity = Math.max(...weeklyData.map(d => d.avgIntensity), 1);

  const weekEntries = entries.filter(e => {
    const d0 = new Date(); const d7 = new Date(d0.getTime() - 7 * 86400000);
    return new Date(e.createdAt) >= d7;
  });

  const emotionCount: Record<string, number> = {};
  weekEntries.forEach(e => {
    emotionCount[e.emotion] = (emotionCount[e.emotion] || 0) + 1;
    e.secondaryEmotions?.forEach(sec => { emotionCount[sec] = (emotionCount[sec] || 0) + 0.5; });
  });
  const dominant = Object.entries(emotionCount).sort((a, b) => b[1] - a[1])[0];
  const avgIntensity = weekEntries.reduce((s, e) => s + e.intensity, 0) / (weekEntries.length || 1);

  return (
    <div className="space-y-6">
      <AnimatedCard>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-4xl">📊</span>
          <div><h2 className="text-2xl font-bold text-gray-800">Análisis Emocional</h2><p className="text-sm text-gray-500">Últimos 7 días</p></div>
        </div>
      </AnimatedCard>

      <AnimatedCard delay={100}>
        <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-4">Intensidad Emocional Semanal</h3>
          <div className="flex items-end justify-around h-48 gap-2">
            {weeklyData.map((day, i) => {
              const height = (day.avgIntensity / maxIntensity) * 100;
              const dominantEntry = Object.entries(day.dominantEmotion).sort((a, b) => b[1] - a[1])[0];
              const emotion = dominantEntry ? dominantEntry[0] as EmotionKey : 'neutra';
              const theme = THEME[emotion];
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-gray-100 rounded-t-lg overflow-hidden relative" style={{ height: '100%' }}>
                    <div className={`w-full bg-gradient-to-t ${theme.gradFrom} ${theme.gradTo} absolute bottom-0 transition-all duration-1000 rounded-t-lg border-2 ${theme.header.replace('text-', 'border-')}`} style={{ height: `${height}%`, transitionDelay: `${i * 100}ms` }} />
                  </div>
                  <span className="text-2xl">{day.count > 0 ? theme.emoji : '·'}</span>
                  <span className="text-xs text-gray-600 font-medium">{day.day}</span>
                  {day.count > 0 && <span className="text-xs text-gray-400">{day.count}</span>}
                </div>
              );
            })}
          </div>
        </div>
      </AnimatedCard>

      {weekEntries.length > 0 && (
        <AnimatedCard delay={200}>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
            <div className="flex items-center gap-2 mb-4"><span className="text-2xl">✨</span><h3 className="font-semibold text-gray-800">Insights Personalizados</h3></div>
            <div className="space-y-3">
              {dominant && (
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    <span className="text-2xl mr-2">{THEME[dominant[0] as EmotionKey].emoji}</span>
                    Emoción dominante: <strong>{THEME[dominant[0] as EmotionKey].name}</strong>
                  </p>
                </div>
              )}
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <span className="text-2xl mr-2">{avgIntensity > 7 ? '🔥' : avgIntensity > 4 ? '😊' : '😌'}</span>
                  Promedio de intensidad: <strong>{avgIntensity.toFixed(1)}/10</strong>
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-700"><span className="text-2xl mr-2">📝</span> Entradas totales: <strong>{entries.length}</strong></p>
              </div>
              {weeklyData.filter(d => d.count > 0).length >= 5 && (
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-700"><span className="text-2xl mr-2">🏆</span> ¡Excelente! Escribiste <strong>{weeklyData.filter(d => d.count > 0).length}</strong> días esta semana.</p>
                </div>
              )}
            </div>
          </div>
        </AnimatedCard>
      )}
    </div>
  );
}

/* ============== App principal (tabs) ============== */
export default function DiarioEmocional() {
  const [view, setView] = useState<'nueva' | 'historial' | 'analisis'>('nueva');
  const { entries, saveEntry, deleteEntry } = useEntries();
  const [toast, setToast] = useState<{ show: boolean; msg: string }>({ show: false, msg: '' });
  const showToast = (msg: string) => { setToast({ show: true, msg }); setTimeout(() => setToast({ show: false, msg: '' }), 2000); };

  const handleSave = (entry: Omit<Entry, 'id' | 'createdAt'>) => { saveEntry(entry); showToast('✅ Entrada guardada con éxito'); setView('historial'); };
  const handleDelete = (id: string) => { if (confirm('¿Eliminar esta entrada?')) { deleteEntry(id); showToast('🗑️ Entrada eliminada'); } };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">Mindful Campus</h1>
          <p className="text-gray-600">Tu espacio de bienestar emocional</p>
        </div>

        <div className="flex gap-2 mb-6 bg-white rounded-2xl p-2 shadow-lg border-2 border-gray-100">
          <button onClick={() => setView('nueva')} className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${view === 'nueva' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md scale-105' : 'text-gray-600 hover:bg-gray-50'}`}>➕ Nueva</button>
          <button onClick={() => setView('historial')} className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${view === 'historial' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md scale-105' : 'text-gray-600 hover:bg-gray-50'}`}>📔 Historial {entries.length > 0 && <span className="bg-white text-purple-600 text-xs font-bold rounded-full px-2 py-0.5 ml-1">{entries.length}</span>}</button>
          <button onClick={() => setView('analisis')} className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${view === 'analisis' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md scale-105' : 'text-gray-600 hover:bg-gray-50'}`}>📊 Análisis</button>
        </div>

        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-white/50">
          {view === 'nueva' && <NuevaEntradaView onSave={handleSave} />}
          {view === 'historial' && <HistorialView entries={entries} onDelete={handleDelete} />}
          {view === 'analisis' && <AnalisisView entries={entries} />}
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">💡 <strong>Tip:</strong> Usa el análisis IA para insights profundos.</p>
        </div>
      </div>

      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 transition-all duration-300 z-50 ${toast.show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <div className="bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl font-medium">{toast.msg}</div>
      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-in; }
        input[type="range"]::-webkit-slider-thumb { appearance: none; width: 20px; height: 20px; border-radius: 50%; background: currentColor; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,.2); }
        input[type="range"]::-moz-range-thumb { width: 20px; height: 20px; border-radius: 50%; background: currentColor; cursor: pointer; border: none; box-shadow: 0 2px 4px rgba(0,0,0,.2); }
      `}</style>
    </main>
  );
}
