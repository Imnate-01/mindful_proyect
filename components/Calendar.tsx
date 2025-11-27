
'use client'
import { useState } from 'react'

export default function Calendar(){
  const [sel, setSel] = useState<number>(8)
  return (
    <div className="border border-[#e9f0eb] rounded-xl overflow-hidden">
      <div className="bg-surface2 px-3 py-2 font-semibold">Octubre 2025</div>
      <div className="grid grid-cols-7 gap-1 p-2 text-sm">
        {['Lu','Ma','Mi','Ju','Vi','Sa','Do'].map(d => <span key={d} className="text-muted">{d}</span>)}
        {Array.from({length:31}, (_,i)=>i+1).map(d => (
          <button key={d} onClick={()=>setSel(d)} className={`py-2 rounded-lg bg-white shadow-soft ${sel===d ? 'bg-primary text-white font-semibold' : ''}`}>{d}</button>
        ))}
      </div>
    </div>
  )
}
