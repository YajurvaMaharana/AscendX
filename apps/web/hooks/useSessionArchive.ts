"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { SESSION_STATE_PREFIX } from "./useInterviewSessionState";

export interface SessionRecord {
  id: string;
  role: string;
  difficulty: string;
  status: string;
  created_at: string;
  score?: number;
  persona?: string;
}

// Curated default sessions if no records exist in DB or localStorage
export const DEFAULT_MOCK_SESSIONS: SessionRecord[] = [];

export function useSessionArchive(initialSessions: SessionRecord[] = [], userId?: string) {
  const [sessions, setSessions] = useState<SessionRecord[]>(initialSessions);
  const [isHydrated, setIsHydrated] = useState(false);

  // Filters - EXPLICITLY default search filter to empty string ("")
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "in_progress">("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");

  const resetFilters = useCallback(() => {
    setSearchFilter("");
    setStatusFilter("all");
    setDifficultyFilter("all");
  }, []);

  // Hydrate from localStorage and API on client mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    let isMounted = true;

    async function loadSessions() {
      try {
        const localMap = new Map<string, SessionRecord>();

        // 1. Add initialSessions from props/Supabase if provided
        if (Array.isArray(initialSessions) && initialSessions.length > 0) {
          initialSessions.forEach((s) => {
            if (s && s.id) localMap.set(s.id, s);
          });
        }

        // 2. Scan localStorage for any saved interview state snapshots for this user
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(SESSION_STATE_PREFIX)) {
            try {
              const raw = localStorage.getItem(key);
              if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && parsed.sessionId) {
                  // If userId is known, filter out sessions belonging to other users
                  if (userId && parsed.userId && parsed.userId !== userId) {
                    continue;
                  }
                  const sessionRecord: SessionRecord = {
                    id: parsed.sessionId,
                    role: parsed.personaDisplayName || parsed.role || "Software Engineering Mock",
                    difficulty: parsed.difficulty || "senior",
                    status:
                      parsed.isCompleted || parsed.status === "completed" || parsed.sessionStatus === "completed"
                        ? "completed"
                        : "in_progress",
                    created_at: parsed.lastUpdated
                      ? new Date(parsed.lastUpdated).toISOString()
                      : new Date().toISOString(),
                    score: parsed.score || 0,
                    persona: parsed.persona,
                  };
                  localMap.set(parsed.sessionId, sessionRecord);
                }
              }
            } catch (e) {
              console.warn("[useSessionArchive] Error parsing localStorage key:", key, e);
            }
          }
        }

        // 3. If no sessions in initial or local, fetch dynamically from /api/interviews
        if (localMap.size === 0 && userId) {
          try {
            const res = await fetch("/api/interviews");
            if (res.ok) {
              const data = await res.json();
              if (Array.isArray(data.sessions)) {
                data.sessions.forEach((s: any) => {
                  if (s && s.id) {
                    localMap.set(s.id, {
                      id: s.id,
                      role: s.role || "Software Engineer",
                      difficulty: s.difficulty || "medium",
                      status: s.status || "completed",
                      created_at: s.created_at || new Date().toISOString(),
                      score: s.score || 0,
                      persona: s.persona,
                    });
                  }
                });
              }
            }
          } catch (fetchErr) {
            console.warn("[useSessionArchive] Dynamic fetch notice:", fetchErr);
          }
        }

        const combined = Array.from(localMap.values());
        // Sort by newest created_at date
        combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        if (isMounted) {
          setSessions(combined);
        }
      } catch (err) {
        console.warn("[useSessionArchive] Hydration error:", err);
        if (isMounted) {
          setSessions(initialSessions || []);
        }
      } finally {
        if (isMounted) {
          setIsHydrated(true);
        }
      }
    }

    loadSessions();

    return () => {
      isMounted = false;
    };
  }, [initialSessions, userId]);

  // Derived filtered sessions state
  const filteredSessions = useMemo(() => {
    const query = searchFilter.trim().toLowerCase();
    return sessions.filter((sess) => {
      const matchesSearch =
        !query ||
        sess.role.toLowerCase().includes(query) ||
        sess.difficulty.toLowerCase().includes(query) ||
        (sess.persona && sess.persona.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "completed" && sess.status === "completed") ||
        (statusFilter === "in_progress" && sess.status !== "completed");

      const matchesDiff =
        difficultyFilter === "all" ||
        sess.difficulty.toLowerCase() === difficultyFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesDiff;
    });
  }, [sessions, searchFilter, statusFilter, difficultyFilter]);

  return {
    sessions,
    filteredSessions,
    isHydrated,
    searchFilter,
    setSearchFilter,
    statusFilter,
    setStatusFilter,
    difficultyFilter,
    setDifficultyFilter,
    resetFilters,
  };
}
