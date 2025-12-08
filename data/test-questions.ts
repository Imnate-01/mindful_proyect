import { LucideIcon } from 'lucide-react';

export interface TestOption {
    label: string;
    value: number;
}

export interface TestQuestion {
    id: number;
    text: string;
    is_inverse?: boolean;
}

export interface TestResultInterpretation {
    min: number;
    max: number;
    label: string;
    action: string;
}

export interface TestData {
    id: string;
    title: string;
    description: string;
    instructions: string;
    min_score: number;
    max_score: number;
    max_option_value?: number; // Used for inverse scoring calculation
    options: TestOption[];
    questions: TestQuestion[];
    results_interpretation: TestResultInterpretation[];
}

export const TESTS: TestData[] = [
    {
        "id": "gad-7",
        "title": "Escala de Ansiedad (GAD-7)",
        "description": "Evalúa qué tan frecuentes han sido tus síntomas de ansiedad en las últimas 2 semanas.",
        "instructions": "Durante las últimas 2 semanas, ¿con qué frecuencia te han molestado los siguientes problemas?",
        "min_score": 0,
        "max_score": 21,
        "options": [
            { "label": "Nunca", "value": 0 },
            { "label": "Varios días", "value": 1 },
            { "label": "Más de la mitad de los días", "value": 2 },
            { "label": "Casi todos los días", "value": 3 }
        ],
        "questions": [
            { "id": 1, "text": "Sentirse nervioso/a, intranquilo/a o con los nervios de punta" },
            { "id": 2, "text": "No poder dejar de preocuparse o no poder controlar la preocupación" },
            { "id": 3, "text": "Preocuparse demasiado por diferentes cosas" },
            { "id": 4, "text": "Dificultad para relajarse" },
            { "id": 5, "text": "Estar tan inquieto/a que es difícil quedarse quieto/a" },
            { "id": 6, "text": "Facilidad para molestarse o irritarse" },
            { "id": 7, "text": "Sentir miedo como si algo terrible fuera a suceder" }
        ],
        "results_interpretation": [
            { "min": 0, "max": 4, "label": "Ansiedad Mínima", "action": "Sigue practicando mindfulness preventivo." },
            { "min": 5, "max": 9, "label": "Ansiedad Leve", "action": "Te recomendamos nuestros ejercicios de respiración." },
            { "min": 10, "max": 14, "label": "Ansiedad Moderada", "action": "Considera usar el directorio de ayuda." },
            { "min": 15, "max": 21, "label": "Ansiedad Severa", "action": "Por favor, contacta a un profesional en nuestro directorio." }
        ]
    },
    {
        "id": "pss-10",
        "title": "Escala de Estrés Percibido (PSS-10)",
        "description": "Mide tu percepción del estrés en el último mes.",
        "instructions": "En el último mes, ¿con qué frecuencia has sentido lo siguiente?",
        "min_score": 0,
        "max_score": 40,
        "max_option_value": 4,
        "options": [
            { "label": "Nunca", "value": 0 },
            { "label": "Casi nunca", "value": 1 },
            { "label": "De vez en cuando", "value": 2 },
            { "label": "A menudo", "value": 3 },
            { "label": "Muy a menudo", "value": 4 }
        ],
        "questions": [
            { "id": 1, "text": "¿Con qué frecuencia te has sentido afectado/a por algo que ocurrió inesperadamente?", "is_inverse": false },
            { "id": 2, "text": "¿Con qué frecuencia has sentido que eras incapaz de controlar las cosas importantes en tu vida?", "is_inverse": false },
            { "id": 3, "text": "¿Con qué frecuencia te has sentido nervioso/a o estresado/a?", "is_inverse": false },
            { "id": 4, "text": "¿Con qué frecuencia has sentido confianza en tu capacidad para manejar tus problemas personales?", "is_inverse": true },
            { "id": 5, "text": "¿Con qué frecuencia has sentido que las cosas te iban bien?", "is_inverse": true },
            { "id": 6, "text": "¿Con qué frecuencia has sentido que no podías afrontar todas las cosas que tenías que hacer?", "is_inverse": false },
            { "id": 7, "text": "¿Con qué frecuencia has podido controlar las dificultades de tu vida?", "is_inverse": true },
            { "id": 8, "text": "¿Con qué frecuencia has sentido que tenías todo bajo control?", "is_inverse": true },
            { "id": 9, "text": "¿Con qué frecuencia has estado enfadado/a porque las cosas que te han ocurrido estaban fuera de tu control?", "is_inverse": false },
            { "id": 10, "text": "¿Con qué frecuencia has sentido que las dificultades se acumulaban tanto que no podías superarlas?", "is_inverse": false }
        ],
        "results_interpretation": [
            { "min": 0, "max": 13, "label": "Estrés Bajo", "action": "¡Vas bien! Mantén tus hábitos." },
            { "min": 14, "max": 26, "label": "Estrés Moderado", "action": "Tómate un descanso y prueba una meditación guiada." },
            { "min": 27, "max": 40, "label": "Estrés Alto", "action": "Es importante que busques apoyo y priorices tu descanso." }
        ]
    },
    {
        "id": "who-5",
        "title": "Índice de Bienestar (WHO-5)",
        "description": "Una breve evaluación de tu bienestar emocional general.",
        "instructions": "Indica cómo te has sentido en las últimas 2 semanas.",
        "min_score": 0,
        "max_score": 100,
        "max_option_value": 5,
        "options": [
            { "label": "En ningún momento", "value": 0 },
            { "label": "Algo del tiempo", "value": 1 },
            { "label": "Menos de la mitad del tiempo", "value": 2 },
            { "label": "Más de la mitad del tiempo", "value": 3 },
            { "label": "La mayor parte del tiempo", "value": 4 },
            { "label": "Todo el tiempo", "value": 5 }
        ],
        "questions": [
            { "id": 1, "text": "Me he sentido alegre y de buen ánimo" },
            { "id": 2, "text": "Me he sentido tranquilo/a y relajado/a" },
            { "id": 3, "text": "Me he sentido activo/a y con energía" },
            { "id": 4, "text": "Me he despertado fresco/a y descansado/a" },
            { "id": 5, "text": "Mi vida diaria ha estado llena de cosas que me interesan" }
        ],
        "results_interpretation": [
            { "min": 0, "max": 50, "label": "Bienestar Bajo", "action": "Podría indicar un estado de ánimo bajo. Busca actividades que disfrutes." },
            { "min": 51, "max": 100, "label": "Bienestar Adecuado", "action": "Tu nivel de bienestar es saludable." }
        ]
    }
];
