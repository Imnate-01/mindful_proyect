export type EmotionKey =
    | 'ansiedad'
    | 'calma'
    | 'alegria'
    | 'tristeza'
    | 'enojo'
    | 'frustracion'
    | 'neutra';

export interface EmotionDetection {
    emotion: EmotionKey;
    intensity: number;
    phrases: string[];
}

export interface AIAnalysis {
    emotions: {
        emotion: EmotionKey;
        intensity: number;
        confidence: number;
        phrases: string[];
    }[];
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

export type Entry = {
    emotion: EmotionKey;
    secondaryEmotions: EmotionKey[];
    intensity: number;
    notes: string;
    tags: string[];
    id: string;
    createdAt: string;
    aiAnalysis?: AIAnalysis;
};
