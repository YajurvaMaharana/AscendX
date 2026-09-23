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

Core Rules & Dynamic Follow-Up Logic:
1. Role Adaptation: Dynamically tailor your tone, technical depth, and questions to a ${targetSeniority} ${targetRole}.
2. Response Evaluation: Analyze whether the candidate's previous response fully resolved the core question with concrete specifics.
3. Conditional Probing for Vague Answers:
   - If the candidate's answer is vague, lacks metrics, or skips architectural trade-offs: Immediately ask a sharp follow-up probe demanding specific clarification on missing metrics, Big-O bounds, or failure edge cases.
   - If the answer was thorough and sufficient: Acknowledge the strong point and introduce a higher-scale constraint or advance to the next topic.
4. One Question at a Time: Ask a single clear question or prompt, then pause and allow them to drive the answer.
5. Tone: Concise, natural, professional, and supportive. Avoid long monolithic text blocks.
6. Guardrails: Stay in character as the interviewer throughout the entire active session.`;

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
