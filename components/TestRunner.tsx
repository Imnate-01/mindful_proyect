'use client'

import { useState } from 'react'
import { TESTS, TestData, TestOption } from '@/data/test-questions'
import { ChevronRight, ChevronLeft, RefreshCw, AlertCircle, Heart } from 'lucide-react'

export default function TestRunner() {
    const [activeTestId, setActiveTestId] = useState<string | null>(null)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [answers, setAnswers] = useState<Record<number, number>>({})
    const [showResults, setShowResults] = useState(false)

    const activeTest = TESTS.find(t => t.id === activeTestId)

    const resetTest = () => {
        setActiveTestId(null)
        setCurrentQuestionIndex(0)
        setAnswers({})
        setShowResults(false)
    }

    const startTest = (id: string) => {
        setActiveTestId(id)
        setCurrentQuestionIndex(0)
        setAnswers({})
        setShowResults(false)
    }

    const handleAnswer = (value: number) => {
        if (!activeTest) return

        setAnswers(prev => ({
            ...prev,
            [activeTest.questions[currentQuestionIndex].id]: value
        }))

        if (currentQuestionIndex < activeTest.questions.length - 1) {
            setTimeout(() => setCurrentQuestionIndex(prev => prev + 1), 250)
        } else {
            setTimeout(() => setShowResults(true), 250)
        }
    }

    const calculateScore = () => {
        if (!activeTest) return { score: 0, interpretation: null }

        let score = 0

        // Calculate raw score
        activeTest.questions.forEach(q => {
            const userAnswer = answers[q.id] || 0

            if (activeTest.id === 'pss-10' && q.is_inverse && activeTest.max_option_value !== undefined) {
                score += (activeTest.max_option_value - userAnswer)
            } else {
                score += userAnswer
            }
        })

        // Special case for WHO-5
        if (activeTest.id === 'who-5') {
            score = score * 4
        }

        // Find interpretation
        const interpretation = activeTest.results_interpretation.find(
            i => score >= i.min && score <= i.max
        )

        return { score, interpretation }
    }

    const { score, interpretation } = calculateScore()
    const progress = activeTest ? ((currentQuestionIndex + 1) / activeTest.questions.length) * 100 : 0

    if (!activeTest) {
        return (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {TESTS.map((test) => (
                    <div key={test.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 text-emerald-600">
                            <Heart className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{test.title}</h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{test.description}</p>
                        <button
                            onClick={() => startTest(test.id)}
                            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            Comenzar Test <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        )
    }

    if (showResults) {
        return (
            <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-emerald-600 p-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-2">Resultados</h2>
                    <p className="text-emerald-100">
                        {activeTest.title}
                    </p>
                </div>

                <div className="p-8">
                    <div className="flex flex-col items-center justify-center mb-8">
                        <div className="w-32 h-32 rounded-full border-8 border-emerald-100 flex items-center justify-center mb-4">
                            <span className="text-4xl font-bold text-emerald-600">{score}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">
                            {interpretation?.label || "Resultado Calculado"}
                        </h3>
                    </div>

                    <div className="bg-emerald-50 rounded-xl p-6 mb-8 border border-emerald-100">
                        <h4 className="font-bold text-emerald-900 mb-2 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" /> Recomendación
                        </h4>
                        <p className="text-emerald-800">
                            {interpretation?.action}
                        </p>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mb-6">
                        <p className="text-xs text-yellow-800 text-justify">
                            <strong>Importante:</strong> Estos resultados son informativos y no sustituyen un diagnóstico profesional.
                            Si sientes malestar significativo, por favor consulta a un especialista de la salud mental.
                        </p>
                    </div>

                    <button
                        onClick={resetTest}
                        className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" /> Volver al menú de tests
                    </button>
                </div>
            </div>
        )
    }

    const question = activeTest.questions[currentQuestionIndex]

    return (
        <div className="max-w-2xl mx-auto">
            {/* Header Test */}
            <div className="mb-8">
                <button
                    onClick={resetTest}
                    className="text-sm text-gray-500 hover:text-emerald-600 mb-4 flex items-center gap-1"
                >
                    <ChevronLeft className="w-4 h-4" /> Volver
                </button>
                <div className="flex justify-between items-end mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">{activeTest.title}</h2>
                    <span className="text-sm font-medium text-emerald-600">
                        {currentQuestionIndex + 1} / {activeTest.questions.length}
                    </span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                        className="bg-emerald-500 h-full transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-white/50 relative overflow-hidden min-h-[400px] flex flex-col justify-center">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500"></div>

                <h3 className="text-xl md:text-2xl font-medium text-gray-800 mb-8 text-center leading-relaxed">
                    {question.text}
                </h3>

                <div className="grid gap-3">
                    {activeTest.options.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => handleAnswer(option.value)}
                            className={`
                w-full p-4 rounded-xl text-left border-2 transition-all duration-200
                ${answers[question.id] === option.value
                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-medium'
                                    : 'border-gray-100 hover:border-emerald-200 hover:bg-gray-50 text-gray-600'
                                }
              `}
                        >
                            <div className="flex items-center justify-between">
                                <span>{option.label}</span>
                                {answers[question.id] === option.value && (
                                    <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-sm"></div>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
