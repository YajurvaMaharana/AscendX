"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import type { ChatMessage } from "@/components/interview/ChatBubble";
import type { SessionAdaptiveTelemetry } from "@/lib/services/ai-engine/adaptive-engine.service";

export interface StoredInterviewState {
  sessionId: string;
  elapsedSeconds: number;
  persona?: string;
  personaDisplayName?: string;
  questionIndex: number;
  messages: ChatMessage[];
  codeDraft?: string;
  telemetry?: SessionAdaptiveTelemetry | null;
  activeLayout?: "dual-pane" | "stream";
  isImmersiveMode?: boolean;
  isVoiceMode?: boolean;
  status: "in_progress" | "completed";
  lastUpdated: number;
}

export const ACTIVE_SESSION_STORAGE_KEY = "ascendx_active_session_id";
export const SESSION_STATE_PREFIX = "ascendx_interview_state_";

/**
 * Synchronously retrieves stored interview state from localStorage on initial mount
 */
export function getStoredSessionState(sessionId: string): StoredInterviewState | null {
  if (typeof window === "undefined" || !sessionId) return null;
  try {
    const raw = localStorage.getItem(`${SESSION_STATE_PREFIX}${sessionId}`);
    if (raw) {
      const parsed = JSON.parse(raw) as StoredInterviewState;
      if (parsed && parsed.sessionId === sessionId) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("[useInterviewSessionState] Failed to read stored session:", e);
  }
  return null;
}

/**
 * Returns the currently active session ID if one exists and is marked as in-progress
 */
export function getActiveSessionId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const activeId = localStorage.getItem(ACTIVE_SESSION_STORAGE_KEY);
    if (!activeId || activeId.trim().length === 0) return null;
    
    // Validate if the session is not completed
    const rawState = localStorage.getItem(`${SESSION_STATE_PREFIX}${activeId}`);
    if (rawState) {
      const parsed = JSON.parse(rawState);
      if (parsed && parsed.status === "completed") {
        return null;
      }
    }
    return activeId;
  } catch {
    return null;
  }
}

/**
 * Marks session as completed and clears the active session pointer
 */
export function markSessionCompleted(sessionId: string): void {
  if (typeof window === "undefined" || !sessionId) return;
  try {
    const activeId = localStorage.getItem(ACTIVE_SESSION_STORAGE_KEY);
    if (activeId === sessionId) {
      localStorage.removeItem(ACTIVE_SESSION_STORAGE_KEY);
    }
    const rawState = localStorage.getItem(`${SESSION_STATE_PREFIX}${sessionId}`);
    if (rawState) {
      const parsed = JSON.parse(rawState);
      parsed.status = "completed";
      parsed.lastUpdated = Date.now();
      localStorage.setItem(`${SESSION_STATE_PREFIX}${sessionId}`, JSON.stringify(parsed));
    }
  } catch (e) {
    console.warn("[useInterviewSessionState] Failed to mark session completed:", e);
  }
}

/**
 * Hook to manage persistent session state, synchronous hydration on mount,
 * and high-frequency background sync to localStorage.
 */
export function useInterviewSessionPersistence({
  sessionId,
  messages,
  telemetry,
  persona,
  personaDisplayName,
  activeLayout,
  isImmersiveMode,
  isVoiceMode,
}: {
  sessionId: string;
  messages: ChatMessage[];
  telemetry?: SessionAdaptiveTelemetry | null;
  persona?: string;
  personaDisplayName?: string;
  activeLayout?: "dual-pane" | "stream";
  isImmersiveMode?: boolean;
  isVoiceMode?: boolean;
}) {
  // Synchronously hydrate initial elapsed seconds from storage or start at 0
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(() => {
    const saved = getStoredSessionState(sessionId);
    return saved?.elapsedSeconds ?? 0;
  });

  // Calculate current question index from AI messages
  const questionIndex = Math.max(
    1,
    messages.filter((m) => m.role === "assistant" || m.role === "interviewer").length
  );

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Mark as active session immediately upon mount
  useEffect(() => {
    if (typeof window === "undefined" || !sessionId) return;
    try {
      localStorage.setItem(ACTIVE_SESSION_STORAGE_KEY, sessionId);
    } catch {}
  }, [sessionId]);

  // 2. Continuous timer tick that runs and accumulates elapsed time
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // 3. Persist state snapshot to localStorage periodically and whenever critical variables change
  useEffect(() => {
    if (typeof window === "undefined" || !sessionId) return;

    try {
      const draftKey = `ascendx_interview_draft_${sessionId}`;
      const codeDraft = localStorage.getItem(draftKey) || "";

      const stateSnapshot: StoredInterviewState = {
        sessionId,
        elapsedSeconds,
        persona,
        personaDisplayName,
        questionIndex,
        messages,
        codeDraft,
        telemetry: telemetry || null,
        activeLayout,
        isImmersiveMode,
        isVoiceMode,
        status: "in_progress",
        lastUpdated: Date.now(),
      };

      localStorage.setItem(`${SESSION_STATE_PREFIX}${sessionId}`, JSON.stringify(stateSnapshot));
      localStorage.setItem(ACTIVE_SESSION_STORAGE_KEY, sessionId);
    } catch (e) {
      console.warn("[useInterviewSessionPersistence] Failed to persist session state:", e);
    }
  }, [
    sessionId,
    elapsedSeconds,
    persona,
    personaDisplayName,
    questionIndex,
    messages,
    telemetry,
    activeLayout,
    isImmersiveMode,
    isVoiceMode,
  ]);

  return {
    elapsedSeconds,
    questionIndex,
    setElapsedSeconds,
  };
}
