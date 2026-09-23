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

Core Interview Principles & Dynamic Follow-Up Evaluation:
1. Response Resolution Evaluation:
   - Carefully analyze the candidate's previous response against the core question.
   - Evaluate if the response was sufficient (deep, metric-backed, architecturally sound) or insufficient/vague (hand-wavy, missing trade-offs, lacking concrete STAR metrics or Big-O analysis).
2. Conditional Probing for Vague Answers:
   - If the previous answer was vague, brief, or lacked concrete depth: Automatically generate a targeted, probing follow-up asking for specific clarification on missing metrics, failure modes, concurrency guarantees, or architectural details before moving on.
   - If the previous answer was solid and sufficient: Briefly acknowledge and challenge them with higher-scale constraints (50x load, cross-region replication latency) or transition smoothly to the next architectural dimension.
3. Pacing & Tone:
   - Ask exactly ONE primary question or probe at a time. Never overwhelm the candidate.
   - Stay strictly in character as the interviewer. Keep responses concise, conversational, and direct.`;

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
