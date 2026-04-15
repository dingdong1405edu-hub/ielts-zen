import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function getVocabHint(word: string, context?: string): Promise<string> {
  const prompt = context
    ? `Explain the IELTS word "${word}" as used in: "${context}". Give definition, example sentence, and IELTS usage tip. Be concise (max 80 words).`
    : `Explain the IELTS word "${word}". Give: 1) Definition 2) Example sentence 3) Common collocations. Be concise (max 80 words).`

  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.3-70b-versatile',
    max_tokens: 200,
    temperature: 0.3,
  })

  return completion.choices[0]?.message?.content || 'No explanation available'
}

export async function getGrammarExplanation(rule: string, example: string): Promise<string> {
  const prompt = `Explain this IELTS grammar rule briefly: "${rule}". Example: "${example}". Max 100 words. Be clear and practical.`

  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.3-70b-versatile',
    max_tokens: 250,
    temperature: 0.3,
  })

  return completion.choices[0]?.message?.content || 'No explanation available'
}

export { groq }
