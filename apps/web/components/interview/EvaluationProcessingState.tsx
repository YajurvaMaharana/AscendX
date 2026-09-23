"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Download,
  FileText,
  ShieldCheck,
  BrainCircuit,
  Volume2,
} from "lucide-react";

export interface EvaluationProcessingStateProps {
  currentStage?: "transcribing" | "evaluating" | "synthesizing" | "failed";
  onRetry?: () => void;
  onExportTranscript?: () => void;
  errorMessage?: string;
}

export default function EvaluationProcessingState({
  currentStage = "evaluating",
  onRetry,
  onExportTranscript,
  errorMessage = "The AI evaluation service timed out while scoring STAR telemetry.",
}: EvaluationProcessingStateProps) {
  const [activeStep, setActiveStep] = useState<number>(() => {
    if (currentStage === "transcribing") return 1;
    if (currentStage === "evaluating") return 2;
    if (currentStage === "synthesizing") return 3;
    return 2;
  });

  const stages = [
    {
      id: 1,
      title: "Transcribing audio & acoustic speech metrics",
      description: "Extracting speech pace (WPM), pause durations, and filler word patterns...",
      icon: Volume2,
    },
    {
      id: 2,
      title: "Evaluating STAR rubric & technical depth",
      description: "Benchmarking architecture choices, trade-offs, and result framing against L5 senior standards...",
      icon: BrainCircuit,
    },
    {
      id: 3,
      title: "Synthesizing coach debrief & actionable drills",
      description: "Generating tailored next practice steps, answer rewrites, and executive consensus...",
      icon: Sparkles,
    },
  ];

  if (currentStage === "failed") {
    return (
      <div
        role="alert"
        aria-live="assertive"
        className="w-full max-w-xl mx-auto p-6 sm:p-8 bg-white dark:bg-[#181E29] rounded-2xl border border-red-200 dark:border-red-900/50 shadow-md space-y-5 text-center"
      >
        <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-7 h-7" aria-hidden="true" />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Evaluation analysis encountered an issue
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            {errorMessage} Don&apos;t worry — your full interview transcript and recording are safely preserved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#E87A42] hover:bg-[#d85322] active:scale-[0.98] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#E87A42]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry evaluation</span>
            </button>
          )}

          {onExportTranscript && (
            <button
              type="button"
              onClick={onExportTranscript}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 dark:bg-[#202736] hover:bg-slate-200 dark:hover:bg-[#283144] text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              <Download className="w-4 h-4" />
              <span>Export raw transcript</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Processing interview evaluation"
      className="w-full max-w-2xl mx-auto p-6 sm:p-8 bg-white dark:bg-[#181E29] rounded-2xl border border-slate-200/80 dark:border-[#242C3B] shadow-lg space-y-6"
    >
      {/* Top Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="w-10 h-10 rounded-xl bg-[#FFF0E6] dark:bg-[#341F14] text-[#E87A42] flex items-center justify-center shrink-0 animate-pulse">
          <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Analyzing your interview session
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Evaluating multi-modal speech, code modularity, and behavioral rubric alignment...
          </p>
        </div>
      </div>

      {/* Processing Stages */}
      <div className="space-y-4">
        {stages.map((stage) => {
          const isDone = stage.id < activeStep;
          const isCurrent = stage.id === activeStep;
          const isPending = stage.id > activeStep;
          const StageIcon = stage.icon;

          return (
            <div
              key={stage.id}
              className={`p-3.5 rounded-xl border transition-all flex items-start gap-3.5 ${
                isCurrent
                  ? "bg-[#FFF0E6]/50 dark:bg-[#2A1D16] border-[#E87A42]/40 ring-1 ring-[#E87A42]/20"
                  : isDone
                  ? "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-900/40"
                  : "bg-slate-50/60 dark:bg-[#131822]/40 border-slate-100 dark:border-slate-800/80 opacity-60"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  isDone
                    ? "bg-emerald-500 text-white"
                    : isCurrent
                    ? "bg-[#E87A42] text-white animate-spin"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-500"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4" />
                ) : (
                  <StageIcon className="w-3.5 h-3.5" />
                )}
              </div>

              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {stage.title}
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] font-bold text-[#E87A42] uppercase tracking-wider animate-pulse">
                      In Progress
                    </span>
                  )}
                  {isDone && (
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      Completed
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                  {stage.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Skeleton Loading Card Simulator */}
      <div className="space-y-2.5 pt-2">
        <div className="h-3 w-3/4 bg-slate-200 dark:bg-slate-700/60 rounded-full animate-pulse" />
        <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-700/60 rounded-full animate-pulse" />
        <div className="h-10 w-full bg-slate-100 dark:bg-[#131822] rounded-xl animate-pulse" />
      </div>
    </div>
  );
}
