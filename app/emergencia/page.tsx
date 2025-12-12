'use client';

import { useRouter } from 'next/navigation';
import { BadgeCheck } from 'lucide-react';

export default function Emergencia() {
  const router = useRouter();

  return (
    <section className="grid">
      <div className="card bg-gradient-to-b from-[#f3fbf8] to-white">
        <div className="flex flex-wrap gap-3 justify-between items-center mb-3">
          <h2 className="text-2xl font-semibold">¿Necesitas ayuda inmediata?</h2>
          <a className="btn-danger" href="tel:123456789">Línea de crisis — Hablar ahora</a>
        </div>
        <div className="grid gap-3 md:grid-cols-[2fr_1.2fr_1fr]">
          <div className="card">
            <h3 className="card-title">Contactos de emergencia</h3>
            <ul className="list">
              <li>Universitaria: 123‑466‑7990</li>
              <li>Nacional Salud Mental: 800‑000‑0000</li>
              <li>Hospital cercano: tu ubicación</li>
            </ul>
          </div>
          <div className="card">
            <h3 className="card-title">Herramientas rápidas</h3>
            <div className="grid grid-cols-3 gap-2">
              <button className="px-3 py-2 rounded-full bg-surface2 border">Respiración 10 min</button>
              <button className="px-3 py-2 rounded-full bg-surface2 border">Meditación corta</button>
              <button className="px-3 py-2 rounded-full bg-surface2 border">Diario de crisis</button>
            </div>
          </div>
          <div className="card">
            <h3 className="card-title">Recursos adicionales</h3>
            <ul className="list">
              <li>FAQ sobre crisis</li>
              <li>Conoce a nuestros profesionales</li>
            </ul>
          </div>
        </div>

        {/* Botón Directorio de Profesionales */}
        <button
          type="button"
          onClick={() => router.push('/directorio-ayuda')}
          className="mt-4 bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-md p-4 text-left hover:-translate-y-1 hover:shadow-xl transition-all w-full"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex flex-shrink-0 items-center justify-center">
              <BadgeCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm mb-0.5">
                Directorio de Profesionales
              </h3>
              <p className="text-xs text-gray-600">
                Encuentra terapeutas certificados, clínicas y líneas de ayuda inmediata.
              </p>
            </div>
          </div>
        </button>

        <p className="muted mt-3 text-sm">Esta app no sustituye atención profesional de emergencia.</p>
      </div>
    </section>
  )
}
