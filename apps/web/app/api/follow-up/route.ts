import { NextResponse } from 'next/server';
import { evaluateAndGenerateDynamicFollowUp } from '@/lib/services/ai-engine/follow-up.service';
import type { ChatMessage } from '@/lib/services/ai-engine/context.service';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { messages: incomingMessages, role, seniority, interviewType, persona, topic } = body;

    const chatHistory: ChatMessage[] = Array.isArray(incomingMessages)
      ? incomingMessages.map((m: any) => ({
          role: m.role === 'assistant' || m.role === 'model' || m.role === 'ai' ? 'assistant' : 'user',
          content: m.content || '',
        }))
      : [];

    const evaluationResult = await evaluateAndGenerateDynamicFollowUp(chatHistory, {
      role: role || 'Software Engineer',
      seniority: seniority || 'Senior',
      interviewType: interviewType || 'technical',
      persona: persona || 'Alex Vance (Lead Technical Interviewer)',
      targetTopic: topic,
    });

    return NextResponse.json(evaluationResult, { status: 200 });
  } catch (error: any) {
    console.error('[api/follow-up] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to evaluate follow-up',
        message: error?.message || 'Internal Server Error',
        is_answer_sufficient: false,
        next_response: 'Could you elaborate on the specific metrics and architectural trade-offs involved in your approach?',
      },
      { status: 500 }
    );
  }
}
