
'use client'
import { useState } from 'react'
import pros from '@/data/professionals.json'
import Calendar from '@/components/Calendar'
import TimePicker from '@/components/TimePicker'

export default function Sesiones(){
  const [msg,setMsg] = useState<string>('')
  const [pro,setPro] = useState(pros[0].id)

  async function confirm(hora:string){
    setMsg('')
    const res = await fetch('/api/booking', {method:'POST', body: JSON.stringify({pro, hora})})
    if(res.ok){ setMsg('✅ Reserva creada'); }
    else { setMsg('❌ Error al reservar'); }
  }

  return (
    <section className="grid gap-4 md:grid-cols-[1.2fr_.8fr]">
      <div className="card">
        <h3 className="card-title">Elige un profesional</h3>
        <ul className="list">
          {pros.map(p => (
            <li key={p.id} className={`grid grid-cols-[40px,1fr,auto] items-center gap-3 p-2 border border-[#e9f0eb] rounded-xl bg-surface2 ${pro===p.id?'ring-2 ring-primary':''}`}>
              <div className="w-10 h-10 rounded-full bg-[#c0e5dc] grid place-items-center font-semibold">{p.id}</div>
              <div><strong>{p.name}</strong><div className="muted text-sm">{p.bio}</div></div>
              <button onClick={()=>setPro(p.id)} className="px-3 py-2 rounded-full bg-white">Elegir</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="card grid gap-3">
        <h3 className="card-title">Selecciona fecha y hora</h3>
        <Calendar/>
        <TimePicker onConfirm={confirm}/>
        {msg && <p>{msg}</p>}
      </div>
    </section>
  )
}
