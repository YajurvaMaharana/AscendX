"use client";

import React, { useState } from "react";
import {
  Mic,
  Volume2,
  Clock,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Play,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  X,
  ArrowRight,
  BookOpen,
  VolumeX,
} from "lucide-react";

interface TelemetryMetric {
  id: "filler" | "latency" | "pace" | "clarity";
  label: string;
  value: string;
  evaluation: string;
  evaluationBadge: string;
  evaluationTone: "positive" | "warning" | "neutral";
  barColor: "green" | "orange";
  bgColor: "olive" | "bronze" | "navy" | "slate";
  barHeights: number[];
  whatItMeasures: string;
  whyItMatters: string;
  evaluationSummary: string;
  actionableStep: string;
  actionButtonText?: string;
  actionType?: "view_filler_examples" | "practice_thinking_aloud" | "pacing_guide" | "clarity_guide";
  detectedItems?: { word: string; count: number; context: string; suggestion: string }[];
}

const SPEAKING_METRICS: TelemetryMetric[] = [
  {
    id: "filler",
    label: "Filler words",
    value: "1.8%",
    evaluation: "Low — this is helping your answers sound confident",
    evaluationBadge: "Low (Target <3%)",
    evaluationTone: "positive",
    barColor: "green",
    bgColor: "olive",
    barHeights: [1, 2, 3, 2, 1],
    whatItMeasures: "Percentage of spoken words that are verbal crutches (e.g., 'like', 'um', 'uh', 'you know') relative to total answer volume.",
    whyItMatters: "Minimizing filler words projects executive presence, boosts clarity, and keeps the interviewer focused on your architectural insights.",
    evaluationSummary: "At 1.8%, your filler frequency is exceptionally low. Your responses sound structured, deliberate, and self-assured.",
    actionableStep: "Occasional 'like' used when transitioning between system components. Replace trailing connectors with deliberate 1-second pauses.",
    actionButtonText: "View examples",
    actionType: "view_filler_examples",
    detectedItems: [
      {
        word: "like",
        count: 3,
        context: "...we would use Redis as, like, an in-memory cache layer to reduce database load...",
        suggestion: "Replace 'like' with a pause: '...we would use Redis as an in-memory cache layer...'",
      },
      {
        word: "um",
        count: 2,
        context: "Um, so for the partitioning key, I chose userId to guarantee data locality...",
        suggestion: "Start directly with the conclusion: 'For the partitioning key, I selected userId...'",
      },
      {
        word: "you know",
        count: 1,
        context: "...because when traffic spikes, you know, horizontal scaling kicks in automatically.",
        suggestion: "Remove conversational assumption: '...because horizontal auto-scaling triggers immediately.'",
      },
    ],
  },
  {
    id: "latency",
    label: "Response time",
    value: "0.8 seconds",
    evaluation: "Good — you begin answering without long pauses",
    evaluationBadge: "Good (0.5s – 1.5s)",
    evaluationTone: "positive",
    barColor: "orange",
    bgColor: "bronze",
    barHeights: [2, 3, 5, 4, 3],
    whatItMeasures: "The transition gap between the interviewer finishing their prompt and the candidate initiating their reply or framing statement.",
    whyItMatters: "A 0.5s–1.5s window conveys confidence without impulsiveness. Thinking aloud buys structural time without creating awkward silence.",
    evaluationSummary: "0.8s shows immediate cognitive engagement without hesitation. You quickly take ownership of the discussion.",
    actionableStep: "For complex distributed system prompts, practice signaling your framing upfront ('Let me break this into requirements, scale, and API contracts') before diving in.",
    actionButtonText: "Practise thinking aloud",
    actionType: "practice_thinking_aloud",
  },
  {
    id: "pace",
    label: "Speech pace",
    value: "138 WPM",
    evaluation: "Optimal — steady, easy-to-follow conversational cadence",
    evaluationBadge: "Optimal (130-150 WPM)",
    evaluationTone: "positive",
    barColor: "green",
    bgColor: "olive",
    barHeights: [2, 3, 4, 5, 3],
    whatItMeasures: "Words spoken per minute across technical explanations and STAR storytelling answers.",
    whyItMatters: "Pacing between 130–150 WPM ensures technical interviewers can digest architectural trade-offs without cognitive fatigue.",
    evaluationSummary: "138 WPM hits the industry sweet spot. You maintain steady cadence even when explaining high-concurrency race conditions.",
    actionableStep: "Slow down slightly by 5 WPM when quoting critical quantitative metrics (e.g., 'p99 latency 15ms at 50,000 QPS').",
  },
  {
    id: "clarity",
    label: "Speech clarity",
    value: "95%",
    evaluation: "High — crisp phonetic enunciation and microphone capture",
    evaluationBadge: "High (95%)",
    evaluationTone: "positive",
    barColor: "green",
    bgColor: "olive",
    barHeights: [3, 4, 5, 4, 5],
    whatItMeasures: "Audio signal-to-noise ratio, consonant precision, and lack of sentence trailing/mumbling.",
    whyItMatters: "High acoustic clarity prevents misunderstood algorithmic terms and keeps remote interview loops running seamlessly.",
    evaluationSummary: "95% clarity indicates clean vocal projection and strong enunciation of technical jargon.",
    actionableStep: "Maintain breath support toward the tail end of longer 90-second system design monologues.",
  },
];

export default function DeliveryTelemetry() {
  const [expandedMetric, setExpandedMetric] = useState<string | null>("filler");
  const [activeModal, setActiveModal] = useState<"filler_examples" | "thinking_aloud" | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedMetric(expandedMetric === id ? null : id);
  };

  return (
    <div className="w-full space-y-3">
      {/* Section Header with Context Note */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Mic className="w-4 h-4 text-[#E87A42]" />
            <span>Speaking Analysis & Delivery Insights</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time acoustic analysis breaking down delivery metrics, evaluation benchmarks, and targeted practice actions.
          </p>
        </div>
        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/50 px-2.5 py-1 rounded-full self-start sm:self-auto">
          All 4 Metrics in Target Range
        </span>
      </div>

      {/* 4-Metric Responsive Interactive Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {SPEAKING_METRICS.map((metric) => {
          const isExpanded = expandedMetric === metric.id;
          const isFiller = metric.id === "filler";
          const isLatency = metric.id === "latency";

          return (
            <div
              key={metric.id}
              className={`rounded-2xl border transition-all duration-200 bg-white dark:bg-[#181E29] shadow-xs hover:shadow-md ${
                isExpanded
                  ? "border-[#E87A42]/50 dark:border-[#E87A42]/40 ring-1 ring-[#E87A42]/20"
                  : "border-slate-200/80 dark:border-[#242C3B]"
              }`}
            >
              {/* Card Header & Primary Visualizer */}
              <div className="p-4 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      {metric.label}
                    </span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        {metric.value}
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                        {metric.evaluationBadge}
                      </span>
                    </div>
                  </div>

                  {/* Visualizer audio bars */}
                  <div className="flex items-end gap-[3px] h-6 px-2 py-1 rounded-lg bg-slate-100 dark:bg-[#131822] border border-slate-200/60 dark:border-slate-800">
                    {metric.barHeights.map((h, i) => (
                      <div
                        key={i}
                        className={`w-1 rounded-full transition-all duration-300 ${
                          metric.barColor === "green" ? "bg-emerald-500" : "bg-[#E87A42]"
                        }`}
                        style={{ height: `${Math.max(4, h * 4)}px` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Primary Evaluation One-Liner */}
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{metric.evaluation}</span>
                </p>

                {/* Quick Action Button row for top metrics */}
                {metric.actionButtonText && (
                  <div className="pt-1 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        if (metric.actionType === "view_filler_examples") {
                          setActiveModal("filler_examples");
                        } else if (metric.actionType === "practice_thinking_aloud") {
                          setActiveModal("thinking_aloud");
                        }
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E87A42] hover:text-[#d85322] dark:text-[#FB923C] hover:underline cursor-pointer group"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#E87A42] group-hover:scale-110 transition-transform" />
                      <span>[{metric.actionButtonText}]</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleExpand(metric.id)}
                      className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                      aria-expanded={isExpanded}
                    >
                      <span>{isExpanded ? "Hide breakdown" : "What & Why"}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                )}

                {!metric.actionButtonText && (
                  <div className="pt-1 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => toggleExpand(metric.id)}
                      className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                      aria-expanded={isExpanded}
                    >
                      <span>{isExpanded ? "Hide breakdown" : "What & Why"}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Collapsible 4-Question Detailed Breakdown */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#131822]/40 rounded-b-2xl space-y-2.5 text-xs">
                  {/* 1. What it measures */}
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-[11px]">
                      <Info className="w-3 h-3 text-[#E87A42]" />
                      What it measures:
                    </span>
                    <p className="text-slate-600 dark:text-slate-300 pl-4.5 text-[11.5px] leading-relaxed">
                      {metric.whatItMeasures}
                    </p>
                  </div>

                  {/* 2. Why it matters */}
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-[11px]">
                      <Sparkles className="w-3 h-3 text-emerald-500" />
                      Why it matters:
                    </span>
                    <p className="text-slate-600 dark:text-slate-300 pl-4.5 text-[11.5px] leading-relaxed">
                      {metric.whyItMatters}
                    </p>
                  </div>

                  {/* 3. Performance evaluation */}
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-[11px]">
                      <CheckCircle2 className="w-3 h-3 text-blue-500" />
                      Performance evaluation:
                    </span>
                    <p className="text-slate-600 dark:text-slate-300 pl-4.5 text-[11.5px] leading-relaxed">
                      {metric.evaluationSummary}
                    </p>
                  </div>

                  {/* 4. Actionable next step */}
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-[11px]">
                      <ArrowRight className="w-3 h-3 text-[#E87A42]" />
                      Actionable next step:
                    </span>
                    <p className="text-slate-600 dark:text-slate-300 pl-4.5 text-[11.5px] leading-relaxed">
                      {metric.actionableStep}
                    </p>
                  </div>

                  {/* Context preview for filler words */}
                  {isFiller && metric.detectedItems && (
                    <div className="pt-1">
                      <div className="p-2.5 bg-white dark:bg-[#1C2230] rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          <span>Detected Filler Occurrences:</span>
                          <span className="text-slate-400 font-normal">6 instances total</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {metric.detectedItems.map((item, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-[#FFF0E6] dark:bg-[#2C1E18] text-[#E87A42] font-mono text-[11px] font-bold border border-[#E87A42]/20"
                            >
                              &quot;{item.word}&quot; ({item.count}x)
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: FILLER WORDS EXAMPLES & TARGETED CORRECTION DRILLS               */}
      {/* ========================================================================= */}
      {activeModal === "filler_examples" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#181E29] rounded-2xl border border-slate-200/80 dark:border-slate-700 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FFF0E6] dark:bg-[#2C1E18] text-[#E87A42] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Filler Words Breakdown & Transcript Examples
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Current Rate: <strong className="text-emerald-600 dark:text-emerald-400">1.8%</strong> (Low — confident delivery)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 rounded-xl text-xs text-amber-900 dark:text-amber-200">
                <strong>Pro-Tip:</strong> The goal is not 0% absolute silence, but replacing conversational crutches with intentional, authoritative micro-pauses.
              </div>

              <div className="space-y-2.5">
                {SPEAKING_METRICS[0].detectedItems?.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 dark:bg-[#131822] rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#E87A42] font-mono text-xs">
                        Filler #{idx + 1}: &quot;{item.word}&quot; ({item.count} occurrences)
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                        Transcript Match
                      </span>
                    </div>

                    <div className="p-2 bg-white dark:bg-[#1A202C] rounded-lg border border-slate-100 dark:border-slate-700/60 font-sans text-slate-700 dark:text-slate-300 italic">
                      &quot;{item.context}&quot;
                    </div>

                    <div className="flex items-start gap-1.5 text-emerald-700 dark:text-emerald-300 font-medium text-[11.5px] pt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{item.suggestion}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-[#E87A42] hover:bg-[#d85322] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Got It, Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: PRACTISE THINKING ALOUD PACING GUIDE                             */}
      {/* ========================================================================= */}
      {activeModal === "thinking_aloud" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#181E29] rounded-2xl border border-slate-200/80 dark:border-slate-700 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-[#2C1E18] text-[#E87A42] flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Mastering Response Pacing & Thinking Aloud
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Current Response Time: <strong className="text-emerald-600 dark:text-emerald-400">0.8 seconds</strong> (Good — timely start)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1 text-xs">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/40 rounded-xl text-blue-900 dark:text-blue-200">
                <strong>Framework:</strong> Instead of jumping straight into code or freezing in silence, vocalize your mental roadmap immediately upon hearing the question.
              </div>

              <div className="space-y-2">
                <div className="p-3 bg-slate-50 dark:bg-[#131822] rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white text-xs block">
                    Step 1: The 1-Second Anchor
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 text-[11.5px]">
                    Echo the core constraint: <em>&quot;Great question. To design this for 50,000 writes per second, let me first clarify the consistency model...&quot;</em>
                  </p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-[#131822] rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white text-xs block">
                    Step 2: Signpost Your 3-Part Architecture
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 text-[11.5px]">
                    <em>&quot;I will walk through the API gateway, the ingestion queue with Kafka, and finally the read replica strategy.&quot;</em>
                  </p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-[#131822] rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white text-xs block">
                    Step 3: State Assumptions Explicitly
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 text-[11.5px]">
                    <em>&quot;Assuming we prioritize low latency over strict linearizability, I&apos;ll employ eventual consistency on the analytics pipeline.&quot;</em>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-[#E87A42] hover:bg-[#d85322] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Understood, Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
