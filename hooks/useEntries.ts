import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useUser } from '@/context/UserContext';
import { Entry, EmotionKey } from '@/types/journal';

export function useEntries() {
    const { user } = useUser();
    const [entries, setEntries] = useState<Entry[]>([]);
    const [loadingEntries, setLoadingEntries] = useState(true);

    // Cargar desde Supabase
    useEffect(() => {
        if (!user) {
            setEntries([]);
            setLoadingEntries(false);
            return;
        }

        const fetchEntries = async () => {
            setLoadingEntries(true);
            const { data, error } = await supabase
                .from('journal_entries')
                .select(
                    'id, user_id, content, emotion, intensity, tags, secondary_emotions, ai_analysis, created_at',
                )
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error cargando entradas de diario:', error);
                setEntries([]);
                setLoadingEntries(false);
                return;
            }

            const mapped: Entry[] =
                data?.map((row: any) => ({
                    id: row.id,
                    emotion: (row.emotion || 'neutra') as EmotionKey,
                    secondaryEmotions: (row.secondary_emotions || []) as EmotionKey[],
                    intensity: row.intensity ?? 5,
                    notes: row.content ?? '',
                    tags: row.tags || [],
                    createdAt: row.created_at,
                    aiAnalysis: row.ai_analysis ?? undefined,
                })) || [];

            setEntries(mapped);
            setLoadingEntries(false);
        };

        fetchEntries();
    }, [user]);

    const saveEntry = async (
        entry: Omit<Entry, 'id' | 'createdAt'>,
    ): Promise<string | null> => {
        if (!user) return null;

        const payload = {
            user_id: user.id,
            content: entry.notes,
            emotion: entry.emotion,
            emocion_principal: entry.emotion,
            intensidad: entry.intensity,
            tags: entry.tags,
            secondary_emotions: entry.secondaryEmotions,
            analisis_ia: entry.aiAnalysis ?? null,
        };

        const { data, error } = await supabase
            .from('journal_entries')
            .insert(payload)
            .select()
            .single();

        if (error) {
            console.error('Error guardando entrada:', error);
            return null;
        }

        const newEntry: Entry = {
            id: data.id,
            emotion: (data.emotion || entry.emotion) as EmotionKey,
            secondaryEmotions: (data.secondary_emotions ||
                entry.secondaryEmotions) as EmotionKey[],
            intensity: data.intensity ?? entry.intensity,
            notes: data.content ?? entry.notes,
            tags: data.tags || entry.tags,
            createdAt: data.created_at,
            aiAnalysis: data.ai_analysis ?? entry.aiAnalysis,
        };

        setEntries((prev) => [newEntry, ...prev]);

        if (typeof window !== 'undefined') {
            localStorage.removeItem('journal:draft');
        }

        return newEntry.id;
    };

    const deleteEntry = async (id: string) => {
        const { error } = await supabase
            .from('journal_entries')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error al borrar entrada:', error);
            return;
        }

        setEntries((prev) => prev.filter((e) => e.id !== id));
    };

    return { entries, saveEntry, deleteEntry, loadingEntries };
}
