export const metadata = {
    title: 'Tests de Autoevaluación | iNerzia Mind',
    description: 'Evalúa tu ansiedad, estrés y bienestar con nuestros tests validados.',
}

import TestRunner from '@/components/TestRunner'

export default function PruebasPage() {
    return (
        <main className="min-h-screen bg-[#F0FDF4] pb-24 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-200/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-200/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 pt-10 md:pt-16">
                <div className="text-center mb-12 max-w-2xl mx-auto animate-in slide-in-from-bottom-4 duration-700 fade-in">
                    <span className="text-emerald-600 font-bold tracking-wider text-sm uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                        Autoconocimiento
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-4 tracking-tight">
                        Tests de Autoevaluación
                    </h1>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Descubre más sobre ti mismo con estas herramientas validadas.
                        Recuerda que estas pruebas son solo una guía informativa.
                    </p>
                </div>

                <TestRunner />
            </div>
        </main>
    )
}
