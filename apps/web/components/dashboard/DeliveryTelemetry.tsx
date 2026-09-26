"use client";

import React, { useState } from "react";
import {
  Mic,
  MicOff,
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
  Loader2,
  RefreshCw,
} from "lucide-react";

export interface TelemetryMetric {
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

export interface DeliveryTelemetryProps {
  totalSessions?: number;
  isVoiceInactive?: boolean;
  isSyncing?: boolean;
  onEnableVoice?: () => void;
}

export default function DeliveryTelemetry({
  totalSessions = 0,
  isVoiceInactive = false,
  isSyncing = false,
  onEnableVoice,
}: DeliveryTelemetryProps) {
  const [expandedMetric, setExpandedMetric] = useState<string | null>("filler");
  const [activeModal, setActiveModal] = useState<"filler_examples" | "thinking_aloud" | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedMetric(expandedMetric === id ? null : id);
  };

  if (totalSessions === 0) {
    return (
      <div
        role="region"
        aria-label="No speech telemetry recorded"
        className="w-full p-6 sm:p-8 bg-white dark:bg-[#181E29] rounded-2xl border border-slate-200/80 dark:border-[#242C3B] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-[#E87A42] flex items-center justify-center shrink-0 border border-orange-500/20">
            <Mic className="w-6 h-6" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              No speech telemetry recorded yet
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-md">
              Complete your first live or voice simulation session to unlock acoustic telemetry tracking speech pace, filler word frequency, and phonetic clarity.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-mono font-bold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
            0 Voice Mocks
          </span>
        </div>
      </div>
    );
  }

  if (isSyncing) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="w-full p-6 bg-white dark:bg-[#181E29] rounded-2xl border border-slate-200/80 dark:border-[#242C3B] shadow-sm flex flex-col items-center justify-center space-y-3 text-center"
      >
        <Loader2 className="w-6 h-6 text-[#E87A42] animate-spin" aria-hidden="true" />
        <div className="space-y-1">
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
            Syncing acoustic speech telemetry...
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Analyzing audio waveforms for cadence, volume variance, and transition latency.
          </p>
        </div>
      </div>
    );
  }

  if (isVoiceInactive) {
    return (
      <div
        role="region"
        aria-label="Voice analysis unavailable"
        className="w-full p-6 bg-slate-50 dark:bg-[#141A24] rounded-2xl border border-slate-200/70 dark:border-[#222C3C] shadow-sm flex flex-col items-center justify-center space-y-3 text-center"
      >
        <div className="w-10 h-10 rounded-xl bg-slate-200/70 dark:bg-slate-800 text-slate-500 flex items-center justify-center">
          <MicOff className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="max-w-md space-y-1">
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
            Voice analysis inactive for text sessions
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Speaking metrics (Filler words, Response time, Speech pace, and Clarity) are recorded during voice-enabled practice sessions.
          </p>
        </div>
        {onEnableVoice && (
          <button
            type="button"
            onClick={onEnableVoice}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#E87A42] hover:bg-[#d85322] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#E87A42]"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Enable voice practice</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full space-y-3" role="region" aria-label="Speaking analysis & delivery insights">
      {/* Section Header with Context Note and Reassuring Privacy Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Mic className="w-4 h-4 text-[#E87A42]" aria-hidden="true" />
            <span>Speaking Analysis &amp; Delivery Insights</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time acoustic analysis breaking down delivery metrics, evaluation benchmarks, and targeted practice actions.
          </p>
        </div>
        <div className="flex flex-col sm:items-end gap-1 self-start sm:self-auto">
          <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/60 px-2.5 py-1 rounded-full">
            All 4 Metrics in Target Range
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
            🔒 Your recordings are private &amp; can be deleted at any time
          </span>
        </div>
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
              className={`rounded-2xl border transition-all ${
                isFiller
                  ? "bg-[#252822] text-slate-100 border-[#3B4135] shadow-xs"
                  : isLatency
                  ? "bg-[#2D241E] text-slate-100 border-[#473427] shadow-xs"
                  : "bg-white dark:bg-[#181E29] border-slate-200/80 dark:border-[#242C3B] shadow-xs"
              }`}
            >
              {/* Card Header Top Row */}
              <div className="p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold ${
                      isFiller || isLatency ? "text-slate-200" : "text-slate-900 dark:text-white"
                    }`}
                  >
                    {metric.label}
                  </span>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      metric.evaluationTone === "positive"
                        ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60"
                        : "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60"
                    }`}
                  >
                    {metric.evaluationBadge}
                  </span>
                </div>

                {/* Main Metric Value & Waveform Indicator */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xl font-black tracking-tight ${
                      isFiller || isLatency ? "text-white" : "text-slate-900 dark:text-white"
                    }`}
                  >
                    {metric.value}
                  </span>

                  {/* Equalizer Waveform bars */}
                  <div className="flex items-end gap-1 h-6" aria-hidden="true">
                    {metric.barHeights.map((h, i) => (
                      <div
                        key={i}
                        className={`w-1 rounded-full transition-all duration-300 ${
                          metric.barColor === "green"
                            ? "bg-emerald-500"
                            : "bg-[#E87A42]"
                        }`}
                        style={{ height: `${h * 4}px` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Primary Evaluation One-Liner */}
                <p
                  className={`text-xs font-semibold flex items-center gap-1.5 ${
                    isFiller || isLatency ? "text-slate-300" : "text-slate-700 dark:text-slate-200"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" aria-hidden="true" />
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
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E87A42] hover:text-[#d85322] dark:text-[#FB923C] hover:underline cursor-pointer group focus-visible:ring-2 focus-visible:ring-[#E87A42]"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#E87A42] group-hover:scale-110 transition-transform" aria-hidden="true" />
                      <span>[{metric.actionButtonText}]</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleExpand(metric.id)}
                      className="text-[11px] font-semibold text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer focus-visible:ring-2 focus-visible:ring-slate-400"
                      aria-expanded={isExpanded}
                      aria-label={`${isExpanded ? "Hide" : "Show"} breakdown for ${metric.label}`}
                    >
                      <span>{isExpanded ? "Hide breakdown" : "What & Why"}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                )}

                {!metric.actionButtonText && (
                  <div className="pt-1 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => toggleExpand(metric.id)}
                      className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer focus-visible:ring-2 focus-visible:ring-slate-400"
                      aria-expanded={isExpanded}
                      aria-label={`${isExpanded ? "Hide" : "Show"} breakdown for ${metric.label}`}
                    >
                      <span>{isExpanded ? "Hide breakdown" : "What & Why"}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Collapsible 4-Question Detailed Breakdown */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-slate-100/10 dark:border-slate-800 bg-black/15 dark:bg-[#131822]/40 rounded-b-2xl space-y-2.5 text-xs">
                  {/* 1. What it measures */}
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-200 flex items-center gap-1.5 text-[11px]">
                      <Info className="w-3 h-3 text-[#E87A42]" aria-hidden="true" />
                      What it measures:
                    </span>
                    <p className="text-slate-300 pl-4.5 text-[11.5px] leading-relaxed">
                      {metric.whatItMeasures}
                    </p>
                  </div>

                  {/* 2. Why it matters */}
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-200 flex items-center gap-1.5 text-[11px]">
                      <Sparkles className="w-3 h-3 text-emerald-400" aria-hidden="true" />
                      Why it matters:
                    </span>
                    <p className="text-slate-300 pl-4.5 text-[11.5px] leading-relaxed">
                      {metric.whyItMatters}
                    </p>
                  </div>

                  {/* 3. Performance evaluation */}
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-200 flex items-center gap-1.5 text-[11px]">
                      <CheckCircle2 className="w-3 h-3 text-blue-400" aria-hidden="true" />
                      Performance evaluation:
                    </span>
                    <p className="text-slate-300 pl-4.5 text-[11.5px] leading-relaxed">
                      {metric.evaluationSummary}
                    </p>
                  </div>

                  {/* 4. Actionable next steps */}
                  <div className="space-y-0.5 pt-1 border-t border-slate-200/10">
                    <span className="font-bold text-[#FB923C] flex items-center gap-1.5 text-[11px]">
                      <ArrowRight className="w-3 h-3" aria-hidden="true" />
                      Actionable next step:
                    </span>
                    <p className="text-slate-200 pl-4.5 text-[11.5px] font-medium leading-relaxed">
                      {metric.actionableStep}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* MODAL 1: Filler Words Breakdown & Examples */}
      {activeModal === "filler_examples" && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="filler-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="w-full max-w-lg bg-white dark:bg-[#181E29] rounded-2xl border border-slate-200 dark:border-[#283244] p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <h4 id="filler-modal-title" className="text-sm font-bold text-slate-900 dark:text-white">
                    Filler Words Breakdown &amp; Context
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Targeted transcript excerpts from your recent session
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                aria-label="Close modal"
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-[#E87A42]"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1 text-xs">
              {SPEAKING_METRICS[0].detectedItems?.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 dark:bg-[#131822] rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white text-xs">
                      &quot;{item.word}&quot; ({item.count}x detected)
                    </span>
                    <span className="text-[10px] text-amber-700 dark:text-amber-300 font-semibold bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-900">
                      Context Replacement
                    </span>
                  </div>

                  <p className="text-slate-600 dark:text-slate-300 text-[11.5px] italic bg-white dark:bg-[#181E29] p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                    {item.context}
                  </p>

                  <div className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>{item.suggestion}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-[#E87A42] hover:bg-[#d85322] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#E87A42]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Response Pacing & Thinking Aloud Guide */}
      {activeModal === "thinking_aloud" && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="pacing-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="w-full max-w-lg bg-white dark:bg-[#181E29] rounded-2xl border border-slate-200 dark:border-[#283244] p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FFF0E6] dark:bg-[#341F14] text-[#E87A42] flex items-center justify-center">
                  <Clock className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <h4 id="pacing-modal-title" className="text-sm font-bold text-slate-900 dark:text-white">
                    Mastering Response Pacing &amp; Thinking Aloud
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    How to eliminate awkward silence without speaking impulsively
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                aria-label="Close modal"
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-[#E87A42]"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1 text-xs">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/40 rounded-xl text-blue-950 dark:text-blue-200">
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
                className="px-4 py-2 bg-[#E87A42] hover:bg-[#d85322] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#E87A42]"
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
