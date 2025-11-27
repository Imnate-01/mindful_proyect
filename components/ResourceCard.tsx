
export default function ResourceCard({title, desc, duration, level}:{title:string, desc:string, duration:number, level:string}){
  return (
    <div className="card grid gap-2">
      <div className="thumb h-28 w-full" aria-hidden="true"></div>
      <div>
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="muted text-sm">{desc}</p>
        <div className="flex gap-3 text-sm text-muted mt-1">
          <span>⌛ {duration} min</span>
          <span>😊 {level}</span>
        </div>
      </div>
    </div>
  )
}
