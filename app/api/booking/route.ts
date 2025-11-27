
let BOOKINGS: {pro:string, hora:string, created:string}[] = []

export async function POST(request: Request){
  const body = await request.text()
  try{
    const data = JSON.parse(body)
    if(!data?.pro || !data?.hora) return new Response('Missing fields', {status: 400})
    BOOKINGS.push({pro: data.pro, hora: data.hora, created: new Date().toISOString()})
    return new Response(JSON.stringify({ok:true, count: BOOKINGS.length}), {status:200})
  }catch{
    return new Response('Bad JSON', {status:400})
  }
}

export async function GET(){
  return new Response(JSON.stringify(BOOKINGS), {status:200})
}
