"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  HelpCircle,
  Lightbulb,
} from "lucide-react";

export interface StarCategoryItem {
  stage: "Situation" | "Task" | "Action" | "Result";
  letter: "S" | "T" | "A" | "R";
  score: number;
  status: "Strong" | "Needs practice" | "Exceptional";
  statusColor: string;
  badgeBg: string;
  badgeBorder: string;
  barColor: string;
  explanation: string;
  suggestion: string;
}

interface StarRubricFeedbackCardProps {
  totalSessions?: number;
  onPracticeAction?: () => void;
}

export default function StarRubricFeedbackCard({
  totalSessions = 0,
  onPracticeAction,
}: StarRubricFeedbackCardProps) {
  const router = useRouter();

  const handleStartPractice = () => {
    if (onPracticeAction) {
      onPracticeAction();
    } else {
      router.push("/interview/new?type=behavioral&focus=action");
    }
  };

  if (totalSessions === 0) {
    return (
      <div
        role="region"
        aria-label="STAR Rubric Behavioral Feedback"
        className="w-full border border-slate-200/80 dark:border-[#242C3B] bg-white dark:bg-[#181E29] rounded-2xl p-5 shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#FFF0E6] dark:bg-[#2F2119] text-[#E87A42] flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white tracking-tight">
                AI STAR Rubric Feedback
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Evaluation across Situation, Task, Action, and Result
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
            0 Evaluated Answers
          </span>
        </div>

        <div className="p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              No STAR evaluations recorded yet
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Start a behavioral interview to evaluate your Situation context, Task scope, Action ownership, and Result metrics.
            </p>
          </div>
          <button
            type="button"
            onClick={handleStartPractice}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#E87A42] hover:bg-[#d85322] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <span>Start Behavioral Session</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  const categories: StarCategoryItem[] = [
    {
      stage: "Situation",
      letter: "S",
      score: 92,
      status: "Strong",
      statusColor: "text-emerald-700 dark:text-emerald-300",
      badgeBg: "bg-emerald-50 dark:bg-emerald-950/50",
      badgeBorder: "border-emerald-200/80 dark:border-emerald-800/60",
      barColor: "bg-emerald-500",
      explanation: "Provided concise background context and articulated technical scale constraints effectively.",
      suggestion: "Maintain this level of conciseness without adding unnecessary company backstory.",
    },
    {
      stage: "Task",
      letter: "T",
      score: 88,
      status: "Strong",
      statusColor: "text-emerald-700 dark:text-emerald-300",
      badgeBg: "bg-emerald-50 dark:bg-emerald-950/50",
      badgeBorder: "border-emerald-200/80 dark:border-emerald-800/60",
      barColor: "bg-emerald-500",
      explanation: "Clearly separated individual ownership from general team responsibilities and stated the core objective.",
      suggestion: "Continue emphasizing your direct decision-making role in defining project scope.",
    },
    {
      stage: "Action",
      letter: "A",
      score: 62,
      status: "Needs practice",
      statusColor: "text-[#A24419] dark:text-[#FFAC82]",
      badgeBg: "bg-[#FFF0E6] dark:bg-[#321F16]",
      badgeBorder: "border-[#E87A42]/50 dark:border-[#E87A42]/50",
      barColor: "bg-[#E87A42]",
      explanation: "You explained what you did, but the steps were not ordered clearly and jumped between architecture and debugging.",
      suggestion: "Try structuring sequential execution with signposts: “First, I profiled the slow query... then I introduced Redis caching... finally, I load-tested with 10k RPS.”",
    },
    {
      stage: "Result",
      letter: "R",
      score: 86,
      status: "Strong",
      statusColor: "text-emerald-700 dark:text-emerald-300",
      badgeBg: "bg-emerald-50 dark:bg-emerald-950/50",
      badgeBorder: "border-emerald-200/80 dark:border-emerald-800/60",
      barColor: "bg-emerald-500",
      explanation: "Shared tangible outcomes including a 35% latency drop and positive customer feedback.",
      suggestion: "Link engineering gains to business impact (e.g. customer retention or infrastructure cost savings).",
    },
  ];

  return (
    <div
      role="region"
      aria-label="Answer structure feedback (STAR Rubric)"
      className="w-full bg-white dark:bg-[#181E29] rounded-2xl border border-slate-200/80 dark:border-[#242C3B] p-5 shadow-sm space-y-4"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FFF0E6] dark:bg-[#2F2119] text-[#E87A42] flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
              Answer structure feedback (STAR Rubric)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Detailed breakdown of behavioral storytelling precision and sequencing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#131822] text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800">
            Overall STAR: <strong className="text-slate-900 dark:text-white font-extrabold">82%</strong>
          </span>
        </div>
      </div>

      {/* Screen reader text summary */}
      <div className="sr-only">
        STAR Rubric evaluation: Situation 92 percent Strong; Task 88 percent Strong; Action 62 percent Needs practice; Result 86 percent Strong.
      </div>

      {/* Expanded Category Layout: Dedicated vertical space for each STAR component */}
      <div className="space-y-3.5">
        {categories.map((cat) => {
          const isNeedsPractice = cat.status === "Needs practice";

          return (
            <div
              key={cat.stage}
              className={`p-4 rounded-xl border transition-all ${
                isNeedsPractice
                  ? "bg-amber-50/50 dark:bg-[#201A15] border-amber-300/80 dark:border-amber-900/60 ring-1 ring-amber-400/20"
                  : "bg-slate-50/70 dark:bg-[#131822]/70 border-slate-200/70 dark:border-slate-800/80"
              }`}
            >
              {/* Category Header: Stage Name, Score, and Icon-Paired Status Badge */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-[#E87A42] text-white text-xs font-black flex items-center justify-center shadow-2xs">
                    {cat.letter}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {cat.stage}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                    {cat.score}%
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${cat.badgeBg} ${cat.statusColor} ${cat.badgeBorder}`}
                  >
                    {isNeedsPractice ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-[#E87A42]" aria-hidden="true" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                    )}
                    <span>{cat.status}</span>
                  </span>
                </div>
              </div>

              {/* Progress Track with Accessible Progressbar Role */}
              <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700/80 rounded-full overflow-hidden mb-2.5">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${cat.barColor}`}
                  style={{ width: `${cat.score}%` }}
                  role="progressbar"
                  aria-valuenow={cat.score}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${cat.stage} score ${cat.score}%`}
                />
              </div>

              {/* One-sentence Explanation */}
              <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed mb-2">
                {cat.explanation}
              </p>

              {/* Concrete Improvement Suggestion */}
              <div
                className={`p-3 rounded-lg text-xs leading-relaxed flex items-start gap-2 ${
                  isNeedsPractice
                    ? "bg-[#FFF0E6] dark:bg-[#2C1D15] text-[#A24419] dark:text-[#FFAC82] border border-[#E87A42]/30"
                    : "bg-white dark:bg-[#1A212E] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800"
                }`}
              >
                <Lightbulb className={`w-4 h-4 shrink-0 mt-0.5 ${isNeedsPractice ? "text-[#E87A42]" : "text-amber-500"}`} aria-hidden="true" />
                <div>
                  <strong className="font-bold">Suggestion: </strong>
                  {cat.suggestion}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Targeted Primary Action Button with Accessible Min Sizing */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-slate-600 dark:text-slate-300 text-center sm:text-left">
          Focus next on structuring chronological actions with clear signposts.
        </p>
        <button
          type="button"
          onClick={handleStartPractice}
          className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 bg-[#E87A42] hover:bg-[#d85322] active:scale-[0.98] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#E87A42] focus-visible:ring-offset-2"
        >
          <span>Practise Action responses</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
