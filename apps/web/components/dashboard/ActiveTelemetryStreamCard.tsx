"use client";

import React from "react";
import { Activity, Clock, Volume2, ShieldCheck, Zap } from "lucide-react";

export interface ActiveTelemetryStreamCardProps {
  totalSessions?: number;
}

export default function ActiveTelemetryStreamCard({
  totalSessions = 0,
}: ActiveTelemetryStreamCardProps) {
  const hasData = totalSessions > 0;

  return (
    <div className="w-full border border-slate-100 dark:border-[#242C3B] bg-white dark:bg-[#181E29] rounded-2xl p-3.5 shadow-sm space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-[#E87A42]" />
          <h3 className="text-xs font-bold text-slate-900 dark:text-white tracking-tight">
            Active Audio &amp; Behavioral Telemetry
          </h3>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
          <span className={`w-1.5 h-1.5 rounded-full ${hasData ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
          <span>{hasData ? "Live Stream" : "Inactive"}</span>
        </div>
      </div>

      {/* Talk-to-Listen Ratio Visualizer */}
      <div className="p-2.5 rounded-xl bg-slate-50/90 dark:bg-[#131822] border border-slate-100 dark:border-slate-800 space-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Talk / Listen Balance</span>
          <span className="font-bold text-slate-900 dark:text-white">
            {hasData ? "68% Candidate : 32% AI" : "— (Pending session)"}
          </span>
        </div>
        {/* Dual Color Progress Bar */}
        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex">
          <div className="h-full bg-[#E87A42] rounded-l-full" style={{ width: hasData ? "68%" : "0%" }} />
          <div className="h-full bg-emerald-500 rounded-r-full" style={{ width: hasData ? "32%" : "0%" }} />
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
          <span className="text-xs font-bold text-slate-900 dark:text-white block">{hasData ? "1.2s" : "—"}</span>
          <span className="text-[9px] text-slate-400 font-semibold block truncate">{hasData ? "Composed" : "Pending"}</span>
        </div>
        <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#131822] border border-slate-100 dark:border-slate-800 text-center space-y-0.5">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">Monologue Avg</span>
          <span className="text-xs font-bold text-slate-900 dark:text-white block">{hasData ? "46s" : "—"}</span>
          <span className="text-[9px] text-slate-400 font-semibold block truncate">{hasData ? "Optimal <90s" : "Pending"}</span>
        </div>
        <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#131822] border border-slate-100 dark:border-slate-800 text-center space-y-0.5">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">Tone Confidence</span>
          <span className="text-xs font-bold text-slate-900 dark:text-white block">{hasData ? "93%" : "0%"}</span>
          <span className="text-[9px] text-slate-400 font-semibold block truncate">{hasData ? "High Assertive" : "Pending"}</span>
        </div>
      </div>
    </div>
  );
}
