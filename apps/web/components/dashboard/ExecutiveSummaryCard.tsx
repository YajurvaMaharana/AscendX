"use client";

import React from "react";
import { TrendingUp, AlertCircle, ArrowUpRight, CheckCircle2, Sparkles, Target } from "lucide-react";
import Link from "next/link";

export default function ExecutiveSummaryCard() {
  return (
    <div
      role="region"
      aria-label="Executive Summary & Action Items"
      className="w-full border border-slate-200/80 dark:border-[#242C3B] bg-white dark:bg-[#181E29] rounded-2xl p-5 shadow-xs space-y-4 flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#E87A42]/10 text-[#E87A42] flex items-center justify-center border border-[#E87A42]/30">
            <TrendingUp className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 dark:text-white tracking-tight">
              Executive Summary
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              High-impact action items &amp; overall session grading
            </p>
          </div>
        </div>

        {/* Grade Badge */}
        <span className="text-xs font-mono font-extrabold px-2.5 py-1 rounded-full bg-[#FFF0E6] dark:bg-[#2F2119] text-[#E87A42] border border-[#E87A42]/30">
          Grade: A- (86/100)
        </span>
      </div>

      {/* Summary Action Items */}
      <div className="space-y-3">
        {/* High-Impact Action Item 1 */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#131822] border border-slate-200/60 dark:border-slate-800/80 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" aria-hidden="true" />
            <span>Priority Action Item #1</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-5">
            Explicitly state SLA &amp; p99 throughput boundaries before proposing cache invalidation topologies.
          </p>
        </div>

        {/* High-Impact Action Item 2 */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#131822] border border-slate-200/60 dark:border-slate-800/80 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
            <Target className="w-3.5 h-3.5 text-[#E87A42] shrink-0" aria-hidden="true" />
            <span>Priority Action Item #2</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-5">
            Structure sequential Action steps with signposts (&quot;First... then... finally...&quot;) to prevent diluting personal ownership.
          </p>
        </div>
      </div>

      {/* Quick Link Footer */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
        <span className="text-slate-500 dark:text-slate-400">Readiness Score: <strong className="text-slate-900 dark:text-white">74/100</strong></span>
        <Link
          href="/feedback-hub"
          className="font-bold text-[#E87A42] hover:underline flex items-center gap-1 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#E87A42]"
        >
          <span>View Full Rubric Analysis</span>
          <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
