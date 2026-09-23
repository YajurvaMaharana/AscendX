import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

export const runtime = 'edge';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || '',
});

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const sessionId = params.id;
    const body = await req.json();
    const { messages, role, seniority, interviewType, persona, jdData } = body;

    const targetRole = role || 'Software Engineer';
    const targetSeniority = seniority || 'Senior';
    const type = interviewType || 'technical';
    const activePersona = persona || 'Alex Vance (Lead Interviewer)';

    let contextSupplement = '';
    if (jdData?.title || jdData?.company) {
      contextSupplement = `\nContext: Interviewing for ${jdData.title || targetRole} at ${jdData.company || 'Tech Corp'}.`;
    }

    const systemPrompt = `You are an expert AI Technical and Behavioral Interviewer named "${activePersona}" conducting a high-standard mock interview session (Session ID: ${sessionId}).
Target Candidate Profile: ${targetSeniority} ${targetRole}.
Interview Mode: ${type.toUpperCase()}.${contextSupplement}

Core Interview Principles:
1. One Question at a Time: Ask exactly one focused question or probe. Wait for the candidate's response before drilling down or pivoting.
2. Adaptive Flow:
   - For strong responses: Challenge on architectural trade-offs, edge-cases, high concurrency, or deeper internals.
   - If candidate hesitates or is unsure: Offer a gentle, constructive nudge or clarifying hint.
3. Behavioral Questions: Probe past experiences using the STAR method (Situation, Task, Action, Result).
4. Tone: Concise, professional, conversational, and direct. Keep character at all times.`;

    const result = streamText({
      model: google('gemini-2.5-flash'),
      system: systemPrompt,
      messages: Array.isArray(messages) ? messages : [],
      temperature: 0.7,
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error(`Error in interview ${params.id} Edge chat stream:`, error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Streaming failure' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
