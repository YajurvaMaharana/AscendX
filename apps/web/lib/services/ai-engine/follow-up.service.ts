// ---------------------------------------------------------------------------
// follow-up.service.ts — Dynamic Follow-Up Logic & Structured JSON Evaluation
// ---------------------------------------------------------------------------

import { GoogleGenAI, Type, type Schema } from '@google/genai';
import { resolveGeminiModel, generateWithModelFallback } from '@/lib/utils/gemini-model';
import type { ChatMessage } from './context.service';

export interface DynamicFollowUpResult {
  is_answer_sufficient: boolean;
  next_response: string;
  missing_aspects?: string[];
  evaluation_summary?: string;
}

const followUpSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    is_answer_sufficient: {
      type: Type.BOOLEAN,
      description:
        'true if the candidate provided a complete, technically sound/metric-backed answer that fully resolved the core question. false if the answer is vague, missing architectural specifics, lacking measurable STAR metrics, hand-wavy, or incomplete.',
    },
    next_response: {
      type: Type.STRING,
      description:
        'The interviewer response. If is_answer_sufficient is FALSE: generates a targeted, sharp probing follow-up asking for specific clarification on missing metrics, failure modes, or architectural details. If is_answer_sufficient is TRUE: provides brief constructive acknowledgment and advances the interview with a higher-level constraint, scale challenge, or next topic.',
    },
    missing_aspects: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description:
        'List of specific technical details, Big-O bounds, concurrency limits, or STAR metrics omitted by the candidate if insufficient.',
    },
    evaluation_summary: {
      type: Type.STRING,
      description:
        'A concise 1-sentence analytical assessment of the candidate response for session logging.',
    },
  },
  required: ['is_answer_sufficient', 'next_response'],
};

export interface FollowUpEvaluationOptions {
  role?: string;
  seniority?: string;
  interviewType?: string;
  persona?: string;
  targetTopic?: string;
  jdContext?: string;
  frameworkSkills?: {
    technical?: string[];
    soft?: string[];
  };
}

/**
 * Builds the strict system prompt for evaluating candidate responses and structuring follow-ups
 */
export function buildDynamicFollowUpSystemPrompt(options: FollowUpEvaluationOptions = {}): string {
  const role = options.role || 'Software Engineer';
  const seniority = options.seniority || 'Senior';
  const type = options.interviewType || 'technical';
  const persona = options.persona || 'Alex Vance (Lead Technical Interviewer)';
  const topic = options.targetTopic || 'System Architecture & Engineering Depth';
  const jdContext = options.jdContext ? `\nTarget Role Context: ${options.jdContext}` : '';

  let frameworkText = '';
  if (options.frameworkSkills?.technical?.length || options.frameworkSkills?.soft?.length) {
    const tech = options.frameworkSkills.technical || [];
    const soft = options.frameworkSkills.soft || [];
    frameworkText = `\nEXTRACTED SKILLS FRAMEWORK (Sequential testing order):
Technical Skills: ${tech.map((s, i) => `[T${i + 1}] ${s}`).join(', ') || 'N/A'}
Soft Skills: ${soft.map((s, i) => `[S${i + 1}] ${s}`).join(', ') || 'N/A'}
Always advance along this framework in sequence.`;
  }

  return `You are an expert AI Interviewer named "${persona}" evaluating a ${seniority} ${role} candidate in a real-time ${type.toUpperCase()} interview.${jdContext}${frameworkText}

ACTIVE FOCUS AREA: ${topic}

YOUR OBJECTIVES:
1. RESPONSE ANALYSIS:
   - Carefully review the entire conversation history and specifically analyze the candidate's MOST RECENT response.
   - Determine whether the candidate's answer FULLY and RIGOROUSLY resolved the core question asked previously.
   - Check for:
     • Technical precision (Big-O analysis, caching layers, schema design, concurrency handling, database indexing, failure boundaries).
     • Behavioral depth (STAR framework, specific quantifiable metrics, personal ownership, measurable impact, team dynamics).
     • Avoidance of vague buzzwords or hand-waving.

2. STRUCTURED JSON EVALUATION:
   - You MUST output a valid JSON object matching the requested schema with two mandatory fields:
     • "is_answer_sufficient": (boolean)
     • "next_response": (string)
     • "missing_aspects": (string[])
     • "evaluation_summary": (string)

3. CONDITIONAL PROBING FOR VAGUE OR INSUFFICIENT ANSWERS:
   - IF "is_answer_sufficient" is FALSE:
     Your "next_response" MUST immediately generate a targeted, probing follow-up that directly challenges the candidate on their missing metrics, concrete operational trade-offs, or architectural details. Never accept generic answers like "I would use a database" or "We scaled the service" without asking for the exact database type, indexing strategy, or quantified percentage improvement.
   - IF "is_answer_sufficient" is TRUE:
     Your "next_response" should acknowledge their strong response and transition smoothly to an advanced constraint (e.g., 50x traffic spike, cross-region replication delay) or pivot to the next core competency topic in the framework sequence.

4. CONSTRAINTS & TONE:
   - Stay strictly in character as the interviewer.
   - Ask exactly ONE primary question or probe at a time.
   - Keep your speech concise, professional, and conversational.`;
}

/**
 * Executes dynamic follow-up analysis using Gemini with structured JSON output
 */
export async function evaluateAndGenerateDynamicFollowUp(
  messages: ChatMessage[],
  options: FollowUpEvaluationOptions = {}
): Promise<DynamicFollowUpResult> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing GEMINI_API_KEY environment variable');
  }

  const client = new GoogleGenAI({ apiKey });
  const modelName = resolveGeminiModel();
  const systemPrompt = buildDynamicFollowUpSystemPrompt(options);

  // Format the full conversation history for context preservation
  const conversationMessages = messages.filter((m) => m.role !== 'system');
  const contents = conversationMessages.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  if (contents.length === 0) {
    contents.push({
      role: 'user',
      parts: [{ text: 'Hello, I am ready for the interview.' }],
    });
  }

  try {
    const result = await generateWithModelFallback(client, {
      preferredModel: modelName,
      contents,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: followUpSchema,
        temperature: 0.4,
      },
    });

    const responseText = result.text;
    if (!responseText) {
      throw new Error('Received empty response from Gemini');
    }

    const parsed = JSON.parse(responseText) as DynamicFollowUpResult;

    // Safety validation and fallback guarantee
    const isSufficient = Boolean(parsed.is_answer_sufficient);
    let nextResponse = (parsed.next_response || '').trim();

    if (!nextResponse) {
      if (!isSufficient) {
        nextResponse =
          options.interviewType === 'behavioral'
            ? 'Thank you for sharing that overview. Could you quantify the specific metrics or measurable outcome that resulted from your actions?'
            : 'That covers the high-level concept, but let us look closer at the implementation: what specific data structures and concurrency controls would you use to prevent race conditions here?';
      } else {
        nextResponse =
          'That is a solid, well-reasoned approach. Let us take this a step further: if the system load increases by 50x, where would the primary bottleneck emerge?';
      }
    }

    return {
      is_answer_sufficient: isSufficient,
      next_response: nextResponse,
      missing_aspects: Array.isArray(parsed.missing_aspects) ? parsed.missing_aspects : [],
      evaluation_summary: parsed.evaluation_summary || (isSufficient ? 'Candidate answer was sufficient.' : 'Candidate answer required deeper probing.'),
    };
  } catch (err: any) {
    console.warn('[follow-up.service] JSON Structured parsing fallback:', err?.message);

    // Fallback heuristic evaluation
    const lastUserMsg = conversationMessages.filter((m) => m.role === 'user').pop()?.content || '';
    const wordCount = lastUserMsg.trim().split(/\s+/).length;
    const isShort = wordCount < 25;

    return {
      is_answer_sufficient: !isShort,
      next_response: isShort
        ? `That gives us a starting point. To make sure we evaluate your technical depth thoroughly: could you walk me through the exact architectural trade-offs, latency implications, and edge cases for that solution?`
        : `That's a well-structured answer. Let's move to the next layer: how would you architect this solution for zero-downtime deployments under active write load?`,
      missing_aspects: isShort ? ['Architectural trade-offs', 'Concrete edge cases', 'Quantifiable metrics'] : [],
      evaluation_summary: isShort ? 'Response was brief; triggered targeted follow-up probe.' : 'Response was adequate; advancing interview.',
    };
  }
}
