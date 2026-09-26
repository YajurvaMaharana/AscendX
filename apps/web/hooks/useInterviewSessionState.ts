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
  status: "in_progress" | "completed" | "terminated";
  sessionStatus?: "active" | "completed" | "terminated";
  isCompleted?: boolean;
  lastUpdated: number;
}

export const ACTIVE_SESSION_STORAGE_KEY = "ascendx_active_session_id";
export const SESSION_STATE_PREFIX = "ascendx_interview_state_";

/**
 * Explicitly clears the active session key from localStorage so normal dashboard navigation is not hijacked.
 */
export function clearActiveSession(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(ACTIVE_SESSION_STORAGE_KEY);
  } catch (e) {
    console.warn("[useInterviewSessionState] Failed to clear active session key:", e);
  }
}

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
 * Returns the currently active session ID ONLY IF it passes strict state validation:
 * - Active ID is non-empty and non-null
 * - A matching valid snapshot exists in localStorage
 * - isCompleted is strictly false (or not completed)
 * - status === 'in_progress' or sessionStatus === 'active'
 * 
 * If any check fails, the active session key is immediately purged to prevent false-positive redirects.
 */
export function getActiveSessionId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const activeId = localStorage.getItem(ACTIVE_SESSION_STORAGE_KEY);
    if (!activeId || activeId.trim().length === 0 || activeId === "null" || activeId === "undefined") {
      clearActiveSession();
      return null;
    }

    const rawState = localStorage.getItem(`${SESSION_STATE_PREFIX}${activeId}`);
    if (!rawState) {
      // Stale or non-existent snapshot; purge active key to prevent unwanted redirection
      clearActiveSession();
      return null;
    }

    const parsed = JSON.parse(rawState) as Partial<StoredInterviewState>;
    if (!parsed || typeof parsed !== "object" || parsed.sessionId !== activeId) {
      clearActiveSession();
      return null;
    }

    // Strict state verification: ensure session is strictly active and NOT completed
    const isCompleted =
      parsed.isCompleted === true ||
      parsed.status === "completed" ||
      parsed.sessionStatus === "completed";

    const isTerminated =
      parsed.status === "terminated" ||
      parsed.sessionStatus === "terminated";

    const isActive =
      (parsed.sessionStatus === "active" || parsed.status === "in_progress") &&
      !isCompleted &&
      !isTerminated;

    if (isCompleted || isTerminated || !isActive) {
      clearActiveSession();
      return null;
    }

    return activeId;
  } catch (e) {
    console.warn("[useInterviewSessionState] Failed to validate active session state:", e);
    clearActiveSession();
    return null;
  }
}

/**
 * Marks session as completed and explicitly removes the active session pointer from localStorage.
 */
export function markSessionCompleted(sessionId: string): void {
  if (typeof window === "undefined" || !sessionId) return;
  try {
    // 1. Explicitly remove active session key to unblock dashboard navigation
    clearActiveSession();

    // 2. Persist completion flags in the session snapshot
    const rawState = localStorage.getItem(`${SESSION_STATE_PREFIX}${sessionId}`);
    if (rawState) {
      const parsed = JSON.parse(rawState) as StoredInterviewState;
      parsed.status = "completed";
      parsed.sessionStatus = "completed";
      parsed.isCompleted = true;
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

  // Statefully track and manage question index, initialized from storage or assistant messages
  const [questionIndex, setQuestionIndex] = useState<number>(() => {
    const saved = getStoredSessionState(sessionId);
    if (saved?.questionIndex && saved.questionIndex >= 1) {
      return saved.questionIndex;
    }
    const aiCount = messages.filter(
      (m) => m.role === "assistant" || m.role === "interviewer"
    ).length;
    return Math.max(1, aiCount);
  });

  // Automatically sync questionIndex if more AI question messages arrive
  useEffect(() => {
    const aiCount = messages.filter(
      (m) => m.role === "assistant" || m.role === "interviewer"
    ).length;
    if (aiCount > questionIndex) {
      setQuestionIndex(aiCount);
    }
  }, [messages, questionIndex]);

  const advanceQuestion = useCallback(() => {
    setQuestionIndex((prev) => prev + 1);
  }, []);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Mark as active session immediately upon mount only if not already completed
  useEffect(() => {
    if (typeof window === "undefined" || !sessionId) return;
    try {
      const current = getStoredSessionState(sessionId);
      if (current?.isCompleted || current?.status === "completed") {
        clearActiveSession();
        return;
      }
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
      const current = getStoredSessionState(sessionId);
      // Do not overwrite completed sessions
      if (current?.isCompleted || current?.status === "completed") {
        clearActiveSession();
        return;
      }

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
        sessionStatus: "active",
        isCompleted: false,
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
    setQuestionIndex,
    advanceQuestion,
    setElapsedSeconds,
  };
}
