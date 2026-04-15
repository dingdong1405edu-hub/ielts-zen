import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export const geminiPro = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' })
export const geminiFlash = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

export async function gradeWriting(taskType: string, prompt: string, response: string) {
  const model = geminiPro
  const systemPrompt = `You are an expert IELTS examiner with 10+ years of experience.
Grade this IELTS Writing ${taskType === 'task1' ? 'Task 1' : 'Task 2'} response strictly according to official IELTS band descriptors.

Task Prompt: ${prompt}

Student Response: ${response}

Return ONLY valid JSON (no markdown, no explanation outside JSON):
{
  "overall": <band score 1.0-9.0 in 0.5 increments>,
  "ta": { "score": <number>, "feedback": "<specific feedback>", "strengths": ["..."], "improvements": ["..."] },
  "cc": { "score": <number>, "feedback": "<specific feedback>", "strengths": ["..."], "improvements": ["..."] },
  "lr": { "score": <number>, "feedback": "<specific feedback>", "strengths": ["..."], "improvements": ["..."] },
  "gra": { "score": <number>, "feedback": "<specific feedback>", "strengths": ["..."], "improvements": ["..."] },
  "overallFeedback": "<2-3 sentences summary>",
  "keyImprovements": ["<top 3 actionable improvements>"],
  "improvedSample": "<improved version of first paragraph only>"
}`

  const result = await model.generateContent(systemPrompt)
  const text = result.response.text()
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Invalid AI response')
  return JSON.parse(jsonMatch[0])
}

export async function gradeSpeaking(part: number, question: string, transcript: string) {
  const model = geminiPro
  const systemPrompt = `You are an expert IELTS Speaking examiner.
Grade this IELTS Speaking Part ${part} response.

Question: ${question}
Transcript: ${transcript}

Return ONLY valid JSON:
{
  "overall": <band 1.0-9.0>,
  "fc": { "score": <number>, "feedback": "<feedback>", "strengths": ["..."], "improvements": ["..."] },
  "pronunciation": { "score": <number>, "feedback": "<feedback>", "strengths": ["..."], "improvements": ["..."] },
  "lr": { "score": <number>, "feedback": "<feedback>", "strengths": ["..."], "improvements": ["..."] },
  "gra": { "score": <number>, "feedback": "<feedback>", "strengths": ["..."], "improvements": ["..."] },
  "overallFeedback": "<summary>",
  "keyImprovements": ["<top 3 improvements>"],
  "sampleAnswer": "<model answer for this question>"
}`

  const result = await model.generateContent(systemPrompt)
  const text = result.response.text()
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Invalid AI response')
  return JSON.parse(jsonMatch[0])
}

export async function analyzePlacementTest(answers: Record<string, string>, correct: Record<string, string>) {
  const model = geminiFlash
  const correct_count = Object.keys(correct).filter(k => answers[k] === correct[k]).length
  const total = Object.keys(correct).length
  const percentage = (correct_count / total) * 100

  let band = 4.0
  if (percentage >= 95) band = 9.0
  else if (percentage >= 87) band = 8.0
  else if (percentage >= 80) band = 7.5
  else if (percentage >= 73) band = 7.0
  else if (percentage >= 65) band = 6.5
  else if (percentage >= 57) band = 6.0
  else if (percentage >= 50) band = 5.5
  else if (percentage >= 43) band = 5.0
  else if (percentage >= 35) band = 4.5

  return {
    band,
    correct: correct_count,
    total,
    percentage: Math.round(percentage),
    recommendation: band < 6.0
      ? 'Tập trung vào từ vựng và ngữ pháp cơ bản'
      : band < 7.0
      ? 'Luyện tập reading và listening nhiều hơn'
      : 'Tập trung vào speaking và writing để tăng band',
  }
}
