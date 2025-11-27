
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  {href:'/', label:'Inicio'},
  {href:'/recursos', label:'Recursos'},
  {href:'/sesiones', label:'Sesiones'},
  { href:'/journal', label: 'Diario' },  
  {href:'/comunidad', label:'Comunidad'},
  {href:'/emergencia', label:'Emergencia'},
]

export default function Header(){
  const pathname = usePathname()
  return (
    <header className="sticky top-0 z-50 flex items-center gap-6 px-6 py-3 bg-white/75 backdrop-blur border-b border-[#e8efe9]">
      <div className="flex items-center gap-2 font-semibold">
        <span className="inline-grid place-items-center w-7 h-7 rounded-lg bg-accent">✦</span>
        <span>Mindful Campus</span>
      </div>
      <nav className="flex gap-2 flex-1">
        {tabs.map(t => (
          <Link key={t.href} href={t.href} className={`px-3 py-2 rounded-full ${pathname===t.href ? 'bg-white shadow-soft text-text' : 'text-muted hover:bg-white shadow-soft'}`}>{t.label}</Link>
        ))}
      </nav>
      <div className="flex gap-2">
        <button className="bg-white rounded-xl px-3 py-2 shadow-soft">🔔</button>
        <button className="bg-primary text-white rounded-full w-9 h-9 font-semibold">HC</button>
      </div>
    </header>
  )
}
