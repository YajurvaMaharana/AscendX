"use client";

import React from "react";
import {
  Award,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  Layers,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export interface InterviewConsensusCardProps {
  totalSessions?: number;
}

export default function InterviewConsensusCard({
  totalSessions = 0,
}: InterviewConsensusCardProps) {
  const hasData = totalSessions > 0;

  return (
    <div
      role="region"
      aria-label="Interview Consensus Signals"
      className="w-full border border-slate-200/80 dark:border-[#242C3B] bg-white dark:bg-[#181E29] rounded-2xl p-5 shadow-xs space-y-4 flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
            <Award className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 dark:text-white tracking-tight">
              Interview Consensus
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Aggregated hire signals across all evaluator panels
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
          <span>{hasData ? "Strong Hire Trajectory" : "Awaiting First Session"}</span>
        </span>
      </div>

      {/* Consensus Metrics & Strengths Breakdown */}
      <div className="space-y-3">
        {/* Hire Signal Bar */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#131822] border border-slate-200/60 dark:border-slate-800/80 space-y-1.5">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-slate-700 dark:text-slate-300">Hire Signal Probability</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-mono">
              {hasData ? "88% (L5 Staff Target)" : "0% (Pending Evaluation)"}
            </span>
          </div>
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: hasData ? "88%" : "0%" }}
            />
          </div>
        </div>

        {/* Demonstrated Strengths */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#131822] border border-slate-200/60 dark:border-slate-800/80 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
            <Zap className="w-3.5 h-3.5 text-[#E87A42]" aria-hidden="true" />
            <span>Demonstrated Strengths</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-5">
            {hasData
              ? "Decisive distributed consensus reasoning, clean data modeling trade-offs, and STAR structured delivery under pressure."
              : "Complete your first practice mock to establish consensus signals across evaluator styles."}
          </p>
        </div>

        {/* Key Alignment Flags */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#131822] border border-slate-200/60 dark:border-slate-800/80 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            <span>Alignment Flags</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-5">
            {hasData
              ? "High technical depth, clear architectural ownership, and proactive edge-case error boundary handling."
              : "No evaluator panel notes recorded yet. Launch your first session to calibrate interviewer impressions."}
          </p>
        </div>
      </div>

      {/* Footer Link */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
        <span className="text-slate-500 dark:text-slate-400">
          Panel Confidence: <strong className="text-slate-900 dark:text-white">{hasData ? "94%" : "0%"}</strong>
        </span>
        <Link
          href="/feedback-hub"
          className="font-bold text-[#E87A42] hover:underline flex items-center gap-1 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#E87A42]"
        >
          <span>View Consensus Details</span>
          <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
