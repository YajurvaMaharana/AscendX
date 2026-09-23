import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

export const runtime = 'edge';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || '',
});

export async function POST(req: Request) {
  try {
    const { messages, sessionId, role, seniority, interviewType, persona } = await req.json();

    const targetRole = role || 'Full-Stack Software Engineer';
    const targetSeniority = seniority || 'Senior';
    const type = interviewType || 'technical';
    const activePersona = persona || 'Alex Vance (Lead Interviewer)';

    const systemPrompt = `You are an expert AI Technical and Behavioral Interviewer named "${activePersona}" conducting a live, high-standard mock interview for a ${targetSeniority} ${targetRole} candidate.

Session Format: ${type.toUpperCase()} Interview.

Core Rules & Behavior:
1. Role Adaptation: Dynamically tailor your tone, technical depth, and questions to a ${targetSeniority} ${targetRole}.
2. One Question at a Time: NEVER overwhelm the candidate with multiple questions at once. Present a single clear question or prompt, then pause and allow them to drive the answer.
3. Adaptive Difficulty & Probing:
   - If they provide a solid, clean answer, challenge them on scalability, edge cases, distributed concurrency, or architectural trade-offs.
   - If they struggle, offer a subtle, encouraging, professional hint without giving away the full solution.
4. For behavioral queries, guide them toward the STAR framework (Situation, Task, Action, Result) with measurable impact.
5. Tone & Style: Keep your conversational text concise, natural, professional, and supportive. Avoid robotic boilerplate.
6. Guardrails: Stay in character as the interviewer throughout the entire active interview session.`;

    const result = streamText({
      model: google('gemini-2.5-flash'),
      system: systemPrompt,
      messages: Array.isArray(messages) ? messages : [],
      temperature: 0.7,
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error('Error in Edge chat stream route:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Streaming failure' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
