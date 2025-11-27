
'use client'
import { useSearchParams } from 'next/navigation'
import FilterPanel from '@/components/FilterPanel'
import ResourceGrid from '@/components/ResourceGrid'

export default function Home(){
  const params = useSearchParams()
  const q = params.get('q') ?? ''
  const type = params.get('type') ?? 'Todos'
  const max = parseInt(params.get('max') ?? '45',10)

  return (
    <div>
      <section className="py-2">
        <h1 className="text-2xl md:text-3xl font-semibold mb-1">Explora herramientas para tu bienestar</h1>
        <p className="muted">Encuentra meditaciones, ejercicios de respiración, rutas y más.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="card">
          <h2 className="card-title">Categorías</h2>
          <ul className="list">
            {['Meditación guiada','Ejercicios de respiración','Artículos y blogs','Herramientas interactivas','Audio Libros'].map(x=>(
              <li key={x} className="bg-surface2 rounded-xl p-3 border border-[#e8efe9]">{x}</li>
            ))}
          </ul>
        </article>

        <article className="card">
          <h2 className="card-title">Rutas destacadas</h2>
          <div className="grid gap-3">
            {[
              {t:'Programa 21 días: Resiliencia', d:'Sesiones diarias • Nivel básico'},
              {t:'Ruta para mejorar el sueño', d:'Respiración + meditación guiada'}
            ].map(it => (
              <div key={it.t} className="grid grid-cols-[84px,1fr] gap-3 items-center">
                <div className="thumb h-16 w-20" aria-hidden="true"></div>
                <div><h3 className="font-semibold">{it.t}</h3><p className="muted text-sm">{it.d}</p></div>
              </div>
            ))}
          </div>
        </article>

        <FilterPanel/>
      </section>

      <section className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Explora todas las rutas</h2>
          <a className="link" href="#">Ver todo</a>
        </div>
        <ResourceGrid q={q} type={type as any} max={max}/>
      </section>
    </div>
  )
}
