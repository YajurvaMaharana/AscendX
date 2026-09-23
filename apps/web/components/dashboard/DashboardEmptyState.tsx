"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Target,
  Calendar,
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
  HelpCircle,
  RotateCcw,
  PlusCircle,
  Briefcase,
} from "lucide-react";

export type EmptyStateType =
  | "no_sessions"
  | "no_role"
  | "no_time_data"
  | "insufficient_sessions";

interface DashboardEmptyStateProps {
  type: EmptyStateType;
  onSelectRole?: (role: string) => void;
  onResetFilter?: () => void;
  onStartSession?: () => void;
}

export default function DashboardEmptyState({
  type,
  onSelectRole,
  onResetFilter,
  onStartSession,
}: DashboardEmptyStateProps) {
  const router = useRouter();

  const handleStartPractice = () => {
    if (onStartSession) {
      onStartSession();
    } else {
      router.push("/interview/new");
    }
  };

  if (type === "no_sessions") {
    return (
      <div
        role="region"
        aria-label="No practice sessions completed"
        className="w-full p-8 sm:p-12 bg-white dark:bg-[#181E29] rounded-2xl border-2 border-dashed border-slate-300 dark:border-[#2A3447] text-center flex flex-col items-center justify-center space-y-5 shadow-xs"
      >
        <div className="w-16 h-16 rounded-2xl bg-[#FFF0E6] dark:bg-[#2D1F17] text-[#E87A42] flex items-center justify-center shadow-inner">
          <Sparkles className="w-8 h-8" aria-hidden="true" />
        </div>

        <div className="max-w-md space-y-2">
          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Complete your first practice session
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Your readiness dashboard, STAR storytelling analysis, and speaking telemetry will appear here right after your first simulated interview.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleStartPractice}
            className="w-full sm:w-auto px-6 py-3 bg-[#E87A42] hover:bg-[#d85322] active:scale-[0.98] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#E87A42] focus-visible:ring-offset-2"
          >
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            <span>Start a practice session</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
          <Link
            href="/interview/preflight"
            className="w-full sm:w-auto px-5 py-3 bg-slate-100 dark:bg-[#202736] hover:bg-slate-200 dark:hover:bg-[#283144] text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-1.5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            <span>Run readiness check</span>
          </Link>
        </div>
      </div>
    );
  }

  if (type === "no_role") {
    const popularRoles = [
      "Frontend Developer",
      "Backend Engineer (Distributed Systems)",
      "Full-Stack Engineer (Senior / Staff)",
      "DevOps & Cloud Architect",
    ];

    return (
      <div
        role="region"
        aria-label="No target role selected"
        className="w-full p-6 sm:p-8 bg-amber-50/60 dark:bg-[#201A15] rounded-2xl border border-amber-200/80 dark:border-amber-900/40 space-y-4"
      >
        <div className="flex items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF0E6] dark:bg-[#341F14] text-[#E87A42] flex items-center justify-center shrink-0">
              <Target className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Choose a target role to personalize your interview practice
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Selecting your role calibrates competency benchmarks, L5 Senior rubrics, and recommended drills.
              </p>
            </div>
          </div>
        </div>

        {/* Quick-select Role Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
          {popularRoles.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => onSelectRole && onSelectRole(role)}
              className="p-3 rounded-xl bg-white dark:bg-[#181E29] border border-amber-200/60 dark:border-amber-900/60 hover:border-[#E87A42] hover:bg-[#FFF0E6]/30 dark:hover:bg-[#2C1D15] text-left transition-all group cursor-pointer focus-visible:ring-2 focus-visible:ring-[#E87A42]"
            >
              <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-[#E87A42]">
                {role}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-1">
                <Briefcase className="w-3 h-3" />
                Select track
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (type === "no_time_data") {
    return (
      <div
        role="region"
        aria-label="No data for selected time range"
        className="w-full p-8 bg-white dark:bg-[#181E29] rounded-2xl border border-slate-200/80 dark:border-[#242C3B] text-center flex flex-col items-center justify-center space-y-3"
      >
        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-[#131822] text-slate-500 flex items-center justify-center">
          <Calendar className="w-6 h-6" aria-hidden="true" />
        </div>
        <div className="space-y-1 max-w-sm">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            No sessions in this time window
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            You have no recorded practice sessions during this specific date range.
          </p>
        </div>
        {onResetFilter && (
          <button
            type="button"
            onClick={onResetFilter}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FFF0E6] dark:bg-[#2C1D15] text-[#E87A42] text-xs font-bold rounded-xl border border-[#E87A42]/30 hover:bg-[#E87A42] hover:text-white transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#E87A42]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to All Sessions</span>
          </button>
        )}
      </div>
    );
  }

  // Insufficient sessions (e.g. needs 2+ for velocity)
  return (
    <div
      role="region"
      aria-label="Insufficient sessions for trend analysis"
      className="w-full p-6 bg-slate-50 dark:bg-[#131822] rounded-2xl border border-slate-200/70 dark:border-slate-800 text-center flex flex-col items-center justify-center space-y-2.5"
    >
      <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
        <TrendingUp className="w-5 h-5" aria-hidden="true" />
      </div>
      <div className="max-w-md space-y-1">
        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
          Complete at least 2 sessions to unlock velocity trends
        </h4>
        <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
          Comparative growth, session-by-session deltas, and weakness heatmaps become available once you have more historical data.
        </p>
      </div>
      <button
        type="button"
        onClick={handleStartPractice}
        className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-[#E87A42] text-white text-xs font-bold rounded-lg shadow-2xs hover:bg-[#d85322] transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#E87A42]"
      >
        <span>Start next session</span>
        <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
}
