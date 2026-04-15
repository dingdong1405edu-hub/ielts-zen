import { DeepgramClient } from '@deepgram/sdk'

const deepgram = new DeepgramClient({ apiKey: process.env.DEEPGRAM_API_KEY! })

export async function transcribeAudio(audioBuffer: Buffer, _mimeType = 'audio/webm'): Promise<string> {
  const response = await deepgram.listen.v1.media.transcribeFile(audioBuffer, {
    model: 'nova-2',
    smart_format: true,
    language: 'en',
    punctuate: true,
    diarize: false,
  })

  // SDK v5: response is the transcription object directly; throws on error
  const transcript = (response as any)?.results?.channels?.[0]?.alternatives?.[0]?.transcript
  if (!transcript) throw new Error('No transcript received from Deepgram')

  return transcript
}
