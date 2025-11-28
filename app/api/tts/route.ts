import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!process.env.ELEVENLABS_API_KEY) {
      console.error("❌ Falta ELEVENLABS_API_KEY");
      return NextResponse.json({ error: 'Server config error' }, { status: 500 });
    }

    // ID de la voz (Ejemplo: 'CwhRBWXzGAHq8TQ4Fs17' es Roger, una voz calmada. 
    // Puedes buscar otros IDs en la librería de voces de ElevenLabs)
    const VOICE_ID = 'CwhRBWXzGAHq8TQ4Fs17'; 

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2", // El mejor para español
          voice_settings: {
            stability: 0.5,       // +Estable = más monótono, -Estable = más expresivo
            similarity_boost: 0.75 // Qué tanto se parece a la voz original
          }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error ElevenLabs:', errorData);
      throw new Error('Error en ElevenLabs API');
    }

    // Convertir el stream de respuesta a un Buffer para enviarlo al frontend
    const audioBuffer = await response.arrayBuffer();
    const buffer = new Uint8Array(audioBuffer);

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length.toString(),
      },
    });

  } catch (error: any) {
    console.error('❌ Error TTS:', error);
    return NextResponse.json({ error: 'Error generando audio' }, { status: 500 });
  }
}