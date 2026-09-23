"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface UseAutoSaveDraftOptions {
  sessionId?: string;
  debounceMs?: number;
  initialValue?: string;
}

export interface UseAutoSaveDraftReturn {
  draftText: string;
  setDraftText: (value: string | ((prev: string) => string)) => void;
  clearDraft: () => void;
  isDraftSaved: boolean;
  isAutoSaving: boolean;
  lastSavedAt: Date | null;
  hasRestoredDraft: boolean;
}

export function useAutoSaveDraft({
  sessionId,
  debounceMs = 1000,
  initialValue = "",
}: UseAutoSaveDraftOptions = {}): UseAutoSaveDraftReturn {
  const storageKey = sessionId ? `ascendx_interview_draft_${sessionId}` : "ascendx_interview_draft_active";
  
  const [draftText, setDraftTextState] = useState<string>(initialValue);
  const [isDraftSaved, setIsDraftSaved] = useState<boolean>(false);
  const [isAutoSaving, setIsAutoSaving] = useState<boolean>(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [hasRestoredDraft, setHasRestoredDraft] = useState<boolean>(false);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef<boolean>(true);

  // 1. Session Restoration: On mount, retrieve any cached draft from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const cached = localStorage.getItem(storageKey);
      if (cached && cached.trim().length > 0) {
        setDraftTextState(cached);
        setIsDraftSaved(true);
        setHasRestoredDraft(true);
        setLastSavedAt(new Date());
      } else if (initialValue) {
        setDraftTextState(initialValue);
      }
    } catch (err) {
      console.warn("[useAutoSaveDraft] Could not read localStorage:", err);
    }
    isInitialMount.current = false;
  }, [storageKey, initialValue]);

  // 2. Debounced caching: Save to localStorage 1000ms after user stops typing
  const saveToLocalStorage = useCallback((textToSave: string) => {
    if (typeof window === "undefined") return;

    try {
      if (textToSave.trim().length > 0) {
        localStorage.setItem(storageKey, textToSave);
        setIsDraftSaved(true);
        setLastSavedAt(new Date());
      } else {
        localStorage.removeItem(storageKey);
        setIsDraftSaved(false);
      }
      setIsAutoSaving(false);
    } catch (err) {
      console.warn("[useAutoSaveDraft] Could not write to localStorage:", err);
      setIsAutoSaving(false);
    }
  }, [storageKey]);

  const setDraftText = useCallback((value: string | ((prev: string) => string)) => {
    setDraftTextState((prev) => {
      const resolved = typeof value === 'function' ? value(prev) : value;
      setIsAutoSaving(true);
      setIsDraftSaved(false);

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        saveToLocalStorage(resolved);
      }, debounceMs);

      return resolved;
    });
  }, [debounceMs, saveToLocalStorage]);

  // 3. Clear draft utility (invoked when candidate sends message)
  const clearDraft = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    setDraftTextState("");
    setIsDraftSaved(false);
    setIsAutoSaving(false);
    setHasRestoredDraft(false);

    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(storageKey);
      } catch (err) {
        console.warn("[useAutoSaveDraft] Could not clear localStorage:", err);
      }
    }
  }, [storageKey]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    draftText,
    setDraftText,
    clearDraft,
    isDraftSaved,
    isAutoSaving,
    lastSavedAt,
    hasRestoredDraft,
  };
}
