"use client";

import React from "react";
import { CheckCircle2, TrendingUp, Sparkles } from "lucide-react";

interface StarCriterion {
  stage: "S" | "T" | "A" | "R";
  label: string;
  metric: string;
  score: number;
  status: "exceptional" | "strong" | "solid";
}

export default function StarRubricFeedbackCard() {
  const criteria: StarCriterion[] = [
    { stage: "S", label: "Situation & Constraints", metric: "Clear Context", score: 92, status: "exceptional" },
    { stage: "T", label: "Task & Ownership", metric: "Direct Scope", score: 88, status: "strong" },
    { stage: "A", label: "Action & Architecture", metric: "Deep Trade-offs", score: 94, status: "exceptional" },
    { stage: "R", label: "Result & Metrics", metric: "35% Latency Gain", score: 86, status: "solid" },
  ];

  return (
    <div className="w-full border border-slate-100 dark:border-[#242C3B] bg-white dark:bg-[#181E29] rounded-2xl p-3 shadow-sm space-y-2.5">
      {/* Header with compact badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#E87A42]" />
          <h3 className="text-xs font-bold text-slate-900 dark:text-white tracking-tight">
            AI Coaching: STAR Rubric Feedback
          </h3>
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/40">
          90% Benchmark
        </span>
      </div>

      {/* Compact 4-Stage STAR Grid */}
      <div className="grid grid-cols-2 gap-1.5">
        {criteria.map((item) => (
          <div
            key={item.stage}
            className="p-2 rounded-xl bg-slate-50/80 dark:bg-[#131822] border border-slate-100/80 dark:border-slate-800 flex items-center justify-between"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-5 h-5 rounded-lg bg-[#FFF0E6] dark:bg-[#2F2119] text-[#E87A42] text-[10px] font-bold flex items-center justify-center shrink-0">
                {item.stage}
              </span>
              <div className="min-w-0">
                <div className="text-[10.5px] font-bold text-slate-800 dark:text-slate-200 truncate">
                  {item.label}
                </div>
                <div className="text-[9.5px] text-slate-500 dark:text-slate-400 truncate">
                  {item.metric}
                </div>
              </div>
            </div>
            <span className="text-[11px] font-bold text-slate-900 dark:text-white shrink-0 ml-1.5">
              {item.score}%
            </span>
          </div>
        ))}
      </div>

      {/* Tightened Actionable Insight */}
      <p className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-normal pt-0.5 border-t border-slate-100 dark:border-slate-800">
        Tracking live response snippets converted to STAR standards with verified concrete metrics.
      </p>
    </div>
  );
}
