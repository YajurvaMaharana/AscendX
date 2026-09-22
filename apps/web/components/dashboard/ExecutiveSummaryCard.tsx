"use client";

import React from "react";
import { CheckCircle2, TrendingUp, AlertCircle, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function ExecutiveSummaryCard() {
  return (
    <div className="w-full border border-slate-100 dark:border-[#242C3B] bg-white dark:bg-[#181E29] rounded-2xl p-3.5 shadow-sm space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-[#E87A42]" />
          <h3 className="text-xs font-bold text-slate-900 dark:text-white tracking-tight">
            Interview Consensus & Executive Summary
          </h3>
        </div>
        <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-[#FFF0E6] dark:bg-[#2F2119] text-[#E87A42]">
          Strong Hire Trajectory
        </span>
      </div>

      {/* Quick Summary Highlights */}
      <div className="space-y-2">
        {/* Key Strengths */}
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#131822] border border-slate-100 dark:border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800 dark:text-slate-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Demonstrated Strengths</span>
          </div>
          <p className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-relaxed pl-5">
            Decisive distributed consensus reasoning, clean data modeling trade-offs, and STAR structured delivery.
          </p>
        </div>

        {/* Priority Focus Area */}
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#131822] border border-slate-100 dark:border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800 dark:text-slate-200">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>High-Impact Action Item</span>
          </div>
          <p className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-relaxed pl-5">
            Explicitly state SLA & p99 throughput boundaries before proposing cache invalidation topologies.
          </p>
        </div>
      </div>

      {/* Quick Link Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-[11px]">
        <span className="text-slate-500 dark:text-slate-400 text-[10.5px]">Overall Session Grade:</span>
        <Link
          href="/feedback-hub"
          className="font-bold text-[#E87A42] hover:underline flex items-center gap-0.5"
        >
          <span>View Full Rubric Analysis</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
