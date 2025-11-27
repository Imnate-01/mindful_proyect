
import resources from '@/data/resources.json'
import ResourceCard from './ResourceCard'

export default function ResourceGrid({q='', type='Todos', max=45}:{q?:string, type?:string, max?:number}){
  const lower = q.toLowerCase()
  const list = resources.filter(r => 
    (type==='Todos' || r.type===type) &&
    r.duration <= max &&
    (r.title.toLowerCase().includes(lower) || r.desc.toLowerCase().includes(lower))
  )
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {list.map(r => <ResourceCard key={r.id} title={r.title} desc={r.desc} duration={r.duration} level={r.level} />)}
    </div>
  )
}
