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
  onPracticeAction?: () => void;
}

export default function StarRubricFeedbackCard({
  onPracticeAction,
}: StarRubricFeedbackCardProps) {
  const router = useRouter();

  const categories: StarCategoryItem[] = [
    {
      stage: "Situation",
      letter: "S",
      score: 92,
      status: "Strong",
      statusColor: "text-emerald-700 dark:text-emerald-300",
      badgeBg: "bg-emerald-50 dark:bg-emerald-950/50",
      badgeBorder: "border-emerald-200/80 dark:border-emerald-800/50",
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
      badgeBorder: "border-emerald-200/80 dark:border-emerald-800/50",
      barColor: "bg-emerald-500",
      explanation: "Clearly separated individual ownership from general team responsibilities and stated the core objective.",
      suggestion: "Continue emphasizing your direct decision-making role in defining project scope.",
    },
    {
      stage: "Action",
      letter: "A",
      score: 62,
      status: "Needs practice",
      statusColor: "text-[#E87A42] dark:text-[#F29D6E]",
      badgeBg: "bg-[#FFF0E6] dark:bg-[#321F16]",
      badgeBorder: "border-[#E87A42]/40 dark:border-[#E87A42]/40",
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
      badgeBorder: "border-emerald-200/80 dark:border-emerald-800/50",
      barColor: "bg-emerald-500",
      explanation: "Shared tangible outcomes including a 35% latency drop and positive customer feedback.",
      suggestion: "Link engineering gains to business impact (e.g. customer retention or infrastructure cost savings).",
    },
  ];

  const handleStartPractice = () => {
    if (onPracticeAction) {
      onPracticeAction();
    } else {
      router.push("/interview/new?type=behavioral&focus=action");
    }
  };

  return (
    <div className="w-full bg-white dark:bg-[#181E29] rounded-2xl border border-slate-200/80 dark:border-[#242C3B] p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FFF0E6] dark:bg-[#2F2119] text-[#E87A42] flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
              Answer structure feedback (STAR Rubric)
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Detailed breakdown of behavioral storytelling precision and sequencing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#131822] text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800">
            Overall STAR: <strong className="text-slate-900 dark:text-white font-extrabold">82%</strong>
          </span>
        </div>
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
                  ? "bg-amber-50/40 dark:bg-[#201A15] border-amber-200/80 dark:border-amber-900/50 ring-1 ring-amber-400/20"
                  : "bg-slate-50/70 dark:bg-[#131822]/70 border-slate-100 dark:border-slate-800/80"
              }`}
            >
              {/* Category Header: Stage Name, Score, and Status Badge */}
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
                    className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${cat.badgeBg} ${cat.statusColor} ${cat.badgeBorder}`}
                  >
                    {isNeedsPractice ? (
                      <AlertTriangle className="w-3 h-3 text-[#E87A42]" />
                    ) : (
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    )}
                    {cat.status}
                  </span>
                </div>
              </div>

              {/* Progress Track */}
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-700/70 rounded-full overflow-hidden mb-2.5">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${cat.barColor}`}
                  style={{ width: `${cat.score}%` }}
                />
              </div>

              {/* One-sentence Explanation */}
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-2">
                {cat.explanation}
              </p>

              {/* Concrete Improvement Suggestion */}
              <div
                className={`p-2.5 rounded-lg text-[11.5px] leading-relaxed flex items-start gap-2 ${
                  isNeedsPractice
                    ? "bg-[#FFF0E6] dark:bg-[#2C1D15] text-[#A24419] dark:text-[#FFAC82] border border-[#E87A42]/20"
                    : "bg-white dark:bg-[#1A212E] text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-800"
                }`}
              >
                <Lightbulb className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isNeedsPractice ? "text-[#E87A42]" : "text-amber-500"}`} />
                <div>
                  <strong className="font-bold">Suggestion: </strong>
                  {cat.suggestion}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Targeted Primary Action Button */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
          Focus next on structuring chronological actions with clear signposts.
        </p>
        <button
          type="button"
          onClick={handleStartPractice}
          className="w-full sm:w-auto px-5 py-2.5 bg-[#E87A42] hover:bg-[#d85322] active:scale-[0.98] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <span>Practise Action responses</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
