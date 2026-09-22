"use client";

import React from "react";
import { Activity, Clock, Volume2, ShieldCheck, Zap } from "lucide-react";

export default function ActiveTelemetryStreamCard() {
  return (
    <div className="w-full border border-slate-100 dark:border-[#242C3B] bg-white dark:bg-[#181E29] rounded-2xl p-3.5 shadow-sm space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-[#E87A42]" />
          <h3 className="text-xs font-bold text-slate-900 dark:text-white tracking-tight">
            Active Audio & Behavioral Telemetry
          </h3>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Live Stream</span>
        </div>
      </div>

      {/* Talk-to-Listen Ratio Visualizer */}
      <div className="p-2.5 rounded-xl bg-slate-50/90 dark:bg-[#131822] border border-slate-100 dark:border-slate-800 space-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Talk / Listen Balance</span>
          <span className="font-bold text-slate-900 dark:text-white">68% Candidate : 32% AI</span>
        </div>
        {/* Dual Color Progress Bar */}
        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex">
          <div className="h-full bg-[#E87A42] rounded-l-full" style={{ width: "68%" }} />
          <div className="h-full bg-emerald-500 rounded-r-full" style={{ width: "32%" }} />
        </div>
        <div className="flex justify-between text-[9.5px] text-slate-400 dark:text-slate-500">
          <span>Candidate Speaking</span>
          <span>Interviewer Probing</span>
        </div>
      </div>

      {/* 3-Pill Telemetry Metrics Grid */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#131822] border border-slate-100 dark:border-slate-800 text-center space-y-0.5">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">Pause Latency</span>
          <span className="text-xs font-bold text-slate-900 dark:text-white block">1.2s</span>
          <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold block truncate">Composed</span>
        </div>
        <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#131822] border border-slate-100 dark:border-slate-800 text-center space-y-0.5">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">Monologue Avg</span>
          <span className="text-xs font-bold text-slate-900 dark:text-white block">46s</span>
          <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold block truncate">Optimal &lt;90s</span>
        </div>
        <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#131822] border border-slate-100 dark:border-slate-800 text-center space-y-0.5">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">Tone Confidence</span>
          <span className="text-xs font-bold text-slate-900 dark:text-white block">93%</span>
          <span className="text-[9px] text-[#E87A42] font-semibold block truncate">High Assertive</span>
        </div>
      </div>
    </div>
  );
}
