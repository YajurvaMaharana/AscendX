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

    let frameworkInjection = '';
    if (jdData) {
      const topTech: string[] = Array.isArray(jdData.top_technical_skills) && jdData.top_technical_skills.length > 0
        ? jdData.top_technical_skills.slice(0, 5)
        : Array.isArray(jdData.required_skills) && jdData.required_skills.length > 0
        ? jdData.required_skills.slice(0, 5)
        : ['Core System Architecture', 'Concurrency & Performance', 'Data Structures & Algorithms', 'Database Internals', 'API & Integration'];

      const topSoft: string[] = Array.isArray(jdData.top_soft_skills) && jdData.top_soft_skills.length > 0
        ? jdData.top_soft_skills.slice(0, 3)
        : ['Cross-Functional Alignment', 'Technical Conflict Resolution', 'Ownership Under Ambiguity'];

      frameworkInjection = `
═══════════════════════════════════════════════════════════════════════════════
TARGET JOB DESCRIPTION (JD) EXTRACTED SKILLS FRAMEWORK
═══════════════════════════════════════════════════════════════════════════════
Target Role: ${jdData.job_title || jdData.title || targetRole} ${jdData.company_name || jdData.company ? `at ${jdData.company_name || jdData.company}` : ''}
Calibrated Seniority: ${jdData.seniority_level || targetSeniority}
${jdData.calibration_summary ? `Interviewer Calibration Directive: "${jdData.calibration_summary}"` : ''}

EXTRACTED TOP 5 TECHNICAL COMPETENCIES:
[T1] ${topTech[0] || 'Core Mechanics & Languages'}
[T2] ${topTech[1] || 'Algorithms & Data Structures'}
[T3] ${topTech[2] || 'System Architecture & Scaling'}
[T4] ${topTech[3] || 'Reliability, Concurrency & Fault Tolerance'}
[T5] ${topTech[4] || 'Domain Stack & Optimization'}

EXTRACTED TOP 3 SOFT & BEHAVIORAL COMPETENCIES:
[S1] ${topSoft[0] || 'Cross-Functional Collaboration'}
[S2] ${topSoft[1] || 'Technical Conflict Resolution'}
[S3] ${topSoft[2] || 'Ownership, Ambiguity & Execution'}

SEQUENTIAL SKILL TESTING PROTOCOL:
Throughout the conversation turns, systematically probe and test the candidate across the extracted framework list in order:
1. Turn Phase 1-2: Probe Technical Skills [T1] & [T2] (Code/algorithm depth, trade-offs, internal mechanics).
2. Turn Phase 3-4: Probe Technical Skills [T3] & [T4] (High-concurrency scaling, database locking, failure recovery).
3. Turn Phase 5: Probe Technical Skill [T5] (Domain-specific optimizations & edge cases).
4. Turn Phase 6-7: Probe Soft Skills [S1] & [S2] via STAR method (Situation, Task, Action, Result).
5. Turn Phase 8+: Probe Soft Skill [S3] (Ambiguity, engineering trade-offs, candidate questions).

CRITICAL RULE:
Every question MUST directly evaluate a specific competency ([T1]-[T5] or [S1]-[S3]) from the framework list. Never ask generic, uncalibrated questions.
`;
    }

    const systemPrompt = `You are an expert AI Technical and Behavioral Interviewer named "${activePersona}" conducting a high-standard mock interview session (Session ID: ${sessionId}).
Target Candidate Profile: ${targetSeniority} ${targetRole}.
Interview Mode: ${type.toUpperCase()}.${contextSupplement}
${frameworkInjection}

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
