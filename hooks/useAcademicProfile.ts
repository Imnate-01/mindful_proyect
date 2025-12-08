"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export type AcademicProfile = {
  id_academico: number;
  id_usuario: string;
  escuela: string;
  carrera: string;
  semestre: number;
  fecha_creacion: string;
};

type SavePayload = {
  escuela: string;
  carrera: string;
  semestre: number;
};

export function useAcademicProfile(userId?: string) {
  const [profile, setProfile] = useState<AcademicProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar perfil académico si hay usuario
  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("perfil_academico")
        .select("*")
        .eq("id_usuario", userId)
        .maybeSingle(); // si usas supabase-js v1, cámbialo por .limit(1).single()

      if (error && error.code !== "PGRST116") {
        // PGRST116 = no rows returned (maybeSingle)
        console.error("Error fetching academic profile:", error);
        setError("Error al obtener tu perfil académico.");
      } else {
        setProfile(data as AcademicProfile | null);
      }

      setLoading(false);
    };

    fetchProfile();
  }, [userId]);

  // Guardar o actualizar perfil (upsert por id_usuario único)
  const saveProfile = async (payload: SavePayload) => {
    if (!userId) return;
    setSaving(true);
    setError(null);

    const { data, error } = await supabase
      .from("perfil_academico")
      .upsert(
        {
          id_usuario: userId,
          escuela: payload.escuela,
          carrera: payload.carrera,
          semestre: payload.semestre,
        },
        {
          onConflict: "id_usuario",
        }
      )
      .select("*")
      .single();

    if (error) {
      console.error("Error saving academic profile:", error);
      setError("No se pudo guardar tu perfil académico.");
    } else {
      setProfile(data as AcademicProfile);
    }

    setSaving(false);
  };

  return {
    profile,
    loading,
    saving,
    error,
    saveProfile,
  };
}
