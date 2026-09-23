import { NextResponse } from 'next/server';
import { getSessionById, getMessagesBySessionId, createMessage } from '@/lib/services/db.service';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const sessionId = params.id;
    const session = await getSessionById(sessionId);

    if (!session) {
      return NextResponse.json(
        { error: 'Not Found', message: `Session "${sessionId}" not found.` },
        { status: 404 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { draftMessage } = body;

    if (draftMessage && typeof draftMessage === 'string' && draftMessage.trim().length > 0) {
      const existingMessages = await getMessagesBySessionId(sessionId);
      const nextOrder = existingMessages.length + 1;

      // Persist immediate record with "pending AI response"
      const messageRecord = await createMessage({
        session_id: sessionId,
        sender_role: 'user',
        content: draftMessage.trim(),
        sequence_order: nextOrder,
        status: 'pending AI response',
      });

      return NextResponse.json({ success: true, messageRecord }, { status: 200 });
    }

    const messages = await getMessagesBySessionId(sessionId);
    const lastMessage = messages[messages.length - 1];
    const isPending = lastMessage?.sender_role === 'user' && lastMessage?.status === 'pending AI response';

    return NextResponse.json(
      {
        success: true,
        session,
        isPending,
        lastMessage: lastMessage || null,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Internal Server Error', message: err?.message || 'Sync failed' },
      { status: 500 }
    );
  }
}
