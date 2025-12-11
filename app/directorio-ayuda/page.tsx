'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { CentroAyuda, Profesional } from '@/types/directory'
import { Search, MapPin, BadgeCheck, Filter, Heart, ChevronDown, ChevronUp, Briefcase, User, Phone, Mail, X, Check, Globe, Calendar } from 'lucide-react'

export default function DirectoryPage() {
    const router = useRouter()
    const [centros, setCentros] = useState<CentroAyuda[]>([])
    const [loading, setLoading] = useState(true)

    // Filters
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedType, setSelectedType] = useState('all')
    const [showFreeOnly, setShowFreeOnly] = useState(false)

    // UI State: Set of expanded center IDs
    const [expandedCentros, setExpandedCentros] = useState<Set<string>>(new Set())
    // Modal State
    const [selectedProData, setSelectedProData] = useState<{ pro: Profesional, center: CentroAyuda } | null>(null)

    useEffect(() => {
        fetchCentros()
    }, [])

    const fetchCentros = async () => {
        try {
            setLoading(true)
            // Fetch Centers with their Professionals nested
            const { data, error } = await supabase
                .from('centros_ayuda')
                .select(`
          *,
          profesionales (*)
        `)

            if (error) throw error

            if (data) {
                setCentros(data as CentroAyuda[])
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    const toggleExpand = (id: string) => {
        setExpandedCentros(prev => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    // Derived Data: Filtered Centers
    const uniqueTypes = Array.from(new Set(centros.map(c => c.tipo_centro).filter(Boolean))) as string[]

    const filteredCentros = centros.filter(centro => {
        // 1. Search Term (Matches Center Name, City, or ANY Professional Name/Specialty)
        const term = searchTerm.toLowerCase()

        // Check Center details
        const centerMatch = centro.nombre.toLowerCase().includes(term) ||
            centro.ciudad.toLowerCase().includes(term)

        // Check Professionals inside
        const prosMatch = centro.profesionales?.some(p => {
            const nameMatch = p.nombre_completo.toLowerCase().includes(term)
            let specMatch = false
            if (Array.isArray(p.especialidades)) {
                specMatch = p.especialidades.some(s => s.toLowerCase().includes(term))
            } else if (typeof p.especialidades === 'string') {
                specMatch = (p.especialidades as string).toLowerCase().includes(term)
            }
            return nameMatch || specMatch
        })

        const textMatch = centerMatch || prosMatch

        // 2. Type Filter (Matches Center Type)
        const typeMatch = selectedType === 'all' || centro.tipo_centro === selectedType

        // 3. Cost Filter (Matches if ANY professional in the center matches)
        const costMatch = !showFreeOnly || centro.profesionales?.some(p => p.costo_consulta_desde === 0)

        return textMatch && typeMatch && costMatch
    })

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 bg-emerald-200 rounded-full mb-4"></div>
                    <p className="text-gray-400 text-sm">Cargando directorio...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out forwards;
                }
            `}</style>
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <BadgeCheck className="w-6 h-6 text-emerald-600" />
                                Directorio de Ayuda Profesional
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Encuentra instituciones y especialistas verificados.
                            </p>
                        </div>
                        <button onClick={() => router.push('/home')} className="text-sm text-emerald-600 hover:underline">
                            Volver al inicio
                        </button>
                    </div>

                    {/* Filters Bar */}
                    <div className="mt-6 flex flex-col md:flex-row gap-4">
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar centro, doctor o especialidad..."
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="relative min-w-[200px]">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <select
                                className="w-full pl-10 pr-8 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none appearance-none transition-all text-sm"
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                            >
                                <option value="all">Tipos de Centro</option>
                                {uniqueTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
                            <input
                                type="checkbox"
                                id="freeOnly"
                                checked={showFreeOnly}
                                onChange={(e) => setShowFreeOnly(e.target.checked)}
                                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-gray-300"
                            />
                            <label htmlFor="freeOnly" className="text-sm text-gray-700 cursor-pointer select-none">
                                Opciones Gratuitas
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content: List of Centers */}
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {filteredCentros.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <Search className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                        <h3 className="text-gray-900 font-medium">No se encontraron resultados</h3>
                        <p className="text-gray-500 text-sm">Intenta con otros filtros.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCentros.map((centro, index) => {
                            const isExpanded = expandedCentros.has(centro.id)
                            const proCount = centro.profesionales?.length || 0

                            return (
                                <div
                                    key={centro.id}
                                    className={`
                                    rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden
                                    flex flex-col
                                    animate-fadeIn fill-mode-backwards
                                `}
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {/* Center Header / "Card Nivel 1" - Vertical y más cuadrada */}
                                    <div
                                        onClick={() => toggleExpand(centro.id)}
                                        className={`
                                        cursor-pointer flex-grow p-6 flex flex-col items-center text-center justify-between gap-6 transition-colors relative
                                        ${isExpanded
                                                ? 'bg-gradient-to-br from-emerald-600 to-teal-600'
                                                : 'bg-gradient-to-br from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400'
                                            }
                                    `}
                                    >
                                        {/* Top: Icon & Badge */}
                                        <div className="w-full flex items-start justify-between">
                                            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-inner">
                                                <Briefcase className="w-6 h-6 text-yellow-100" />
                                            </div>
                                            {proCount > 0 && (
                                                <div className="px-3 py-1 bg-white/10 rounded-full border border-white/10 flex items-center gap-1.5 backdrop-blur-md">
                                                    <span className="text-white font-bold text-sm">{proCount}</span>
                                                    <User className="w-3 h-3 text-emerald-100" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Middle: Info */}
                                        <div className="space-y-3 py-2">
                                            <h2 className="text-xl font-bold text-white leading-tight">
                                                {centro.nombre}
                                            </h2>
                                            <div className="flex flex-wrap items-center justify-center gap-2 text-emerald-50 text-xs font-medium">
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {centro.ciudad}
                                                </span>
                                                <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                                                <span className="capitalize">{centro.tipo_centro}</span>
                                            </div>
                                        </div>

                                        {/* Bottom: Action */}
                                        <div className={`p-2 rounded-full border border-white/20 transition-all duration-300 mt-2 ${isExpanded ? 'bg-white text-emerald-600 rotate-180' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                                            <ChevronDown className="w-5 h-5" />
                                        </div>
                                    </div>

                                    {/* Level 2: Nested Professionals List */}
                                    {isExpanded && (
                                        <div className="bg-white border-t border-gray-100 p-4 animate-fadeIn">
                                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                Especialistas
                                            </h3>

                                            <div className="space-y-3">
                                                {centro.profesionales?.map(prof => (
                                                    <div key={prof.id} className="group bg-gray-50 p-3 rounded-xl border border-gray-100 hover:border-emerald-200 transition-all">
                                                        <div className="flex justify-between items-start mb-1">
                                                            <h4 className="font-bold text-gray-900 text-sm">{prof.nombre_completo}</h4>
                                                            <BadgeCheck className="w-3.5 h-3.5 text-blue-500 fill-blue-50" />
                                                        </div>
                                                        <p className="text-emerald-600 text-[10px] font-bold uppercase mb-2">
                                                            {prof.titulo_profesional}
                                                        </p>
                                                        <div className="flex items-center justify-between mt-2">
                                                            <span className="text-[10px] text-gray-500 font-medium">
                                                                {prof.costo_consulta_desde === 0 ? 'Gratuito' : `$${prof.costo_consulta_desde}`}
                                                            </span>
                                                            <button
                                                                onClick={() => setSelectedProData({ pro: prof, center: centro })}
                                                                className="text-[10px] font-bold bg-emerald-600 text-white px-2.5 py-1 rounded-lg hover:bg-emerald-700"
                                                            >
                                                                Contactar
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                                {proCount === 0 && (
                                                    <div className="text-center py-4 text-gray-400 text-xs italic">
                                                        No hay especialistas listados.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </main>
            {/* Modal de Contacto Profesional */}
            {selectedProData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                        onClick={() => setSelectedProData(null)}
                    ></div>

                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-fadeIn">
                        {/* Header del Modal */}
                        <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    {selectedProData.pro.nombre_completo}
                                    <BadgeCheck className="w-5 h-5 text-blue-500" />
                                </h3>
                                <p className="text-emerald-600 font-medium text-sm mt-1">
                                    {selectedProData.pro.titulo_profesional}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedProData(null)}
                                className="p-2 bg-white rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Costo */}
                            <div className="flex items-center justify-between bg-emerald-50 px-4 py-3 rounded-2xl border border-emerald-100">
                                <span className="text-sm text-emerald-800 font-medium">Costo de consulta</span>
                                <span className="text-lg font-bold text-emerald-700">
                                    {selectedProData.pro.costo_consulta_desde === 0 ? 'Gratuito' : `$${selectedProData.pro.costo_consulta_desde}`}
                                </span>
                            </div>

                            {/* Contacto Directo */}
                            <div className="grid grid-cols-2 gap-3">
                                <a
                                    href={`tel:${selectedProData.pro.telefono || ''}`}
                                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all ${selectedProData.pro.telefono ? 'bg-white border-gray-200 hover:border-emerald-500 hover:shadow-md cursor-pointer group' : 'bg-gray-50 border-gray-100 opacity-50 cursor-not-allowed'}`}
                                >
                                    <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-bold text-gray-600">Llamar Ahora</span>
                                </a>

                                <a
                                    href={`mailto:${selectedProData.pro.email || ''}`}
                                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all ${selectedProData.pro.email ? 'bg-white border-gray-200 hover:border-emerald-500 hover:shadow-md cursor-pointer group' : 'bg-gray-50 border-gray-100 opacity-50 cursor-not-allowed'}`}
                                >
                                    <div className="p-3 bg-teal-100 text-teal-600 rounded-full group-hover:bg-teal-600 group-hover:text-white transition-colors">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-bold text-gray-600">Enviar Email</span>
                                </a>
                            </div>

                            {/* Info Adicional */}
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Globe className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <span className="block text-xs uppercase text-gray-400 font-bold tracking-wider">Atención Online</span>
                                        <div className="flex items-center gap-2 mt-1">
                                            {selectedProData.pro.atencion_online ? (
                                                <>
                                                    <Check className="w-4 h-4 text-emerald-500" />
                                                    <span className="text-sm font-medium text-gray-700">Sí, disponible remotamente</span>
                                                </>
                                            ) : (
                                                <span className="text-sm text-gray-500">Solo presencial</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <span className="block text-xs uppercase text-gray-400 font-bold tracking-wider">Especialidades</span>
                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                            {Array.isArray(selectedProData.pro.especialidades)
                                                ? selectedProData.pro.especialidades.map((s, i) => (
                                                    <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">{s}</span>
                                                ))
                                                : <span className="text-sm text-gray-600">{selectedProData.pro.especialidades}</span>
                                            }
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-4 flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <span className="block text-xs uppercase text-gray-400 font-bold tracking-wider mb-1">Ubicación / Centro</span>
                                        <p className="text-sm font-bold text-gray-900">{selectedProData.center.nombre}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {selectedProData.center.direccion || selectedProData.center.ciudad || 'Ubicación no especificada'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 p-4 text-center">
                            <p className="text-xs text-gray-400">
                                La información mostrada es responsabilidad del profesional.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
