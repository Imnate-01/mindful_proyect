
'use client'
import { useState } from 'react'

export default function TimePicker({onConfirm}:{onConfirm:(t:string)=>void}){
  const [t,setT] = useState('10:00 AM')
  return (
    <div className="grid gap-3">
      <label className="grid gap-1">
        <span>Horario</span>
        <select value={t} onChange={e=>setT(e.target.value)} className="px-3 py-2 rounded-xl border border-[#e0ece6] bg-surface2">
          {['10:00 AM','11:30 AM','2:00 PM'].map(opt => <option key={opt}>{opt}</option>)}
        </select>
      </label>
      <button onClick={()=>onConfirm(t)} className="btn-primary">Confirmar reserva</button>
    </div>
  )
}
