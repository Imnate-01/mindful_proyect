export interface Profesional {
    id: string;
    nombre_completo: string;
    titulo_profesional: string;
    especialidades: string[] | string;
    costo_consulta_desde: number;
    id_centro: string;
    // Contact Info
    telefono?: string;
    email?: string;
    atencion_online?: boolean;
}

export interface CentroAyuda {
    id: string;
    nombre: string;
    ciudad: string;
    tipo_centro: string;
    direccion?: string; // New field
    profesionales: Profesional[];
}
