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
export const DEFAULT_MOCK_SESSIONS: SessionRecord[] = [
  {
    id: "sess-fullstack-01",
    role: "Senior Full-Stack Engineer",
    difficulty: "senior",
    status: "completed",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    score: 92,
    persona: "tech-grinder",
  },
  {
    id: "sess-distrib-02",
    role: "Backend & Distributed Systems",
    difficulty: "staff",
    status: "completed",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    score: 88,
    persona: "skeptical-interrogator",
  },
  {
    id: "sess-star-03",
    role: "Leadership & STAR Behavioral",
    difficulty: "senior",
    status: "completed",
    created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
    score: 85,
    persona: "hr-partner",
  },
  {
    id: "sess-arch-04",
    role: "Frontend & UI Architecture",
    difficulty: "senior",
    status: "completed",
    created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
    score: 91,
    persona: "supportive-mentor",
  },
  {
    id: "sess-sys-05",
    role: "System Design & Scalability",
    difficulty: "staff",
    status: "completed",
    created_at: new Date(Date.now() - 86400000 * 16).toISOString(),
    score: 84,
    persona: "simulation-boss",
  },
];

export function useSessionArchive(initialSessions: SessionRecord[] = []) {
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

  // Hydrate from localStorage on client mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const localMap = new Map<string, SessionRecord>();

      // 1. Add initialSessions from props/Supabase if provided
      if (Array.isArray(initialSessions) && initialSessions.length > 0) {
        initialSessions.forEach((s) => {
          if (s && s.id) localMap.set(s.id, s);
        });
      }

      // 2. Scan localStorage for any saved interview state snapshots
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(SESSION_STATE_PREFIX)) {
          try {
            const raw = localStorage.getItem(key);
            if (raw) {
              const parsed = JSON.parse(raw);
              if (parsed && parsed.sessionId) {
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
                  score: parsed.score || 88,
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

      let combined = Array.from(localMap.values());

      // 3. Fallback to default mock sessions if 0 sessions found so far
      if (combined.length === 0) {
        combined = DEFAULT_MOCK_SESSIONS;
      }

      // Sort by newest created_at date
      combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setSessions(combined);
    } catch (err) {
      console.warn("[useSessionArchive] Hydration error:", err);
      if (initialSessions.length === 0) {
        setSessions(DEFAULT_MOCK_SESSIONS);
      }
    } finally {
      setIsHydrated(true);
    }
  }, [initialSessions]);

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
