import { NextResponse } from 'next/server';
import { getSessionById, getMessagesBySessionId } from '@/lib/services/db.service';
import { evaluateAndGenerateDynamicFollowUp } from '@/lib/services/ai-engine/follow-up.service';
import type { ChatMessage } from '@/lib/services/ai-engine/context.service';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const sessionId = params.id;
    const body = await req.json().catch(() => ({}));
    const { messages: incomingMessages, role, seniority, interviewType, persona, topic } = body;

    let chatHistory: ChatMessage[] = [];

    if (Array.isArray(incomingMessages) && incomingMessages.length > 0) {
      chatHistory = incomingMessages.map((m: any) => ({
        role: m.role === 'assistant' || m.role === 'model' || m.role === 'ai' ? 'assistant' : 'user',
        content: m.content || '',
      }));
    } else {
      // Load history from database if not explicitly provided in body
      const dbMessages = await getMessagesBySessionId(sessionId);
      chatHistory = dbMessages.map((m) => ({
        role: m.sender_role === 'ai' ? 'assistant' : 'user',
        content: m.content,
      }));
    }

    const session = await getSessionById(sessionId).catch(() => null);

    const evaluationResult = await evaluateAndGenerateDynamicFollowUp(chatHistory, {
      role: role || session?.role || 'Software Engineer',
      seniority: seniority || session?.jd_data?.seniority_level || 'Senior',
      interviewType: interviewType || session?.type || 'technical',
      persona: persona || session?.persona || 'Alex Vance (Lead Technical Interviewer)',
      targetTopic: topic,
      jdContext: session?.jd_data?.title ? `${session.jd_data.title} at ${session.jd_data.company || 'Tech Corp'}` : undefined,
    });

    return NextResponse.json(evaluationResult, { status: 200 });
  } catch (error: any) {
    console.error(`[api/interviews/${params.id}/follow-up] Error:`, error);
    return NextResponse.json(
      {
        error: 'Failed to evaluate follow-up',
        message: error?.message || 'Internal Server Error',
        is_answer_sufficient: false,
        next_response: 'Could you walk me through the key architectural trade-offs and edge cases for your proposed solution?',
      },
      { status: 500 }
    );
  }
}
