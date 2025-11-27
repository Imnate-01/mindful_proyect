
'use client'
import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function FilterPanel(){
  const params = useSearchParams()
  const router = useRouter()
  const [q,setQ] = useState(params.get('q') ?? '')
  const [type,setType] = useState(params.get('type') ?? 'Todos')
  const [dur,setDur] = useState(parseInt(params.get('max') ?? '45',10))

  useEffect(()=>{
    const sp = new URLSearchParams()
    if(q) sp.set('q', q)
    if(type && type!=='Todos') sp.set('type', type)
    if(dur !== 45) sp.set('max', String(dur))
    const query = sp.toString()
    router.replace(query ? `/?${query}` : '/')
  },[q,type,dur])

  return (
    <aside className="card">
      <h2 className="card-title">Buscador y filtros</h2>
      <label className="grid gap-1 mb-3">
        <span>Buscar recursos</span>
        <input value={q} onChange={e=>setQ(e.target.value)} type="search" placeholder="Escribe aquí…" className="px-3 py-2 rounded-xl border border-[#e0ece6] bg-surface2"/>
      </label>
      <label className="grid gap-1 mb-3">
        <span>Tipo de recurso</span>
        <select value={type} onChange={e=>setType(e.target.value)} className="px-3 py-2 rounded-xl border border-[#e0ece6] bg-surface2">
          <option>Todos</option>
          <option>Meditación</option>
          <option>Ejercicio</option>
          <option>Artículo</option>
          <option>Podcast</option>
          <option>Programa</option>
          <option>Herramienta</option>
        </select>
      </label>
      <label className="grid gap-1">
        <span>Duración máxima: {dur} min</span>
        <input value={dur} onChange={e=>setDur(parseInt(e.target.value,10))} type="range" min="5" max="45"/>
        <div className="flex justify-between text-muted text-xs"><small>5 min</small><small>45 min</small></div>
      </label>
    </aside>
  )
}
