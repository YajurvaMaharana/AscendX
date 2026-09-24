"use client";

import React, { useState } from "react";
import { Grid, Sparkles, ArrowRight, X, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { useRouter } from "next/navigation";

interface HeatmapCell {
  competency: string;
  sessionIndex: number;
  sessionName: string;
  score: number; // 0 - 100
  feedbackSnippet: string;
  questionPrompt: string;
}

export default function WeaknessHeatmapCard() {
  const router = useRouter();
  const [selectedCell, setSelectedCell] = useState<HeatmapCell | null>(null);

  const competencies = [
    "Technical Correctness",
    "Architectural Trade-offs",
    "STAR Impact Metrics",
    "Conceptual Depth",
    "Communication Clarity",
  ];

  const sessions = ["Session #1", "Session #2", "Session #3", "Session #4", "Latest"];

  // Mock matrix data combining historical sessions & competencies
  const matrixData: HeatmapCell[][] = [
    // Technical Correctness
    [
      { competency: "Technical Correctness", sessionIndex: 0, sessionName: "Session #1", score: 68, feedbackSnippet: "Initial syntax confusion on async promise chaining.", questionPrompt: "Explain JavaScript event loop and microtask queue." },
      { competency: "Technical Correctness", sessionIndex: 1, sessionName: "Session #2", score: 75, feedbackSnippet: "Better handling of concurrency locks.", questionPrompt: "Design a thread-safe LRU cache in TypeScript." },
      { competency: "Technical Correctness", sessionIndex: 2, sessionName: "Session #3", score: 82, feedbackSnippet: "Solid Big-O complexity breakdown.", questionPrompt: "Optimize graph traversal with memoization." },
      { competency: "Technical Correctness", sessionIndex: 3, sessionName: "Session #4", score: 88, feedbackSnippet: "Clean error handling implementation.", questionPrompt: "Implement resilient retry-with-backoff logic." },
      { competency: "Technical Correctness", sessionIndex: 4, sessionName: "Latest", score: 92, feedbackSnippet: "Flawless technical execution and syntax accuracy.", questionPrompt: "Distributed consensus & Raft heartbeat protocol." },
    ],
    // Architectural Trade-offs
    [
      { competency: "Architectural Trade-offs", sessionIndex: 0, sessionName: "Session #1", score: 58, feedbackSnippet: "Missed consistency vs availability trade-offs.", questionPrompt: "Design a real-time messaging notification pipeline." },
      { competency: "Architectural Trade-offs", sessionIndex: 1, sessionName: "Session #2", score: 64, feedbackSnippet: "Briefly mentioned caching but omitted invalidation.", questionPrompt: "Scale a high-throughput read-heavy database." },
      { competency: "Architectural Trade-offs", sessionIndex: 2, sessionName: "Session #3", score: 70, feedbackSnippet: "Improved discussion of sharding strategies.", questionPrompt: "Partitioning user tables across multi-region clusters." },
      { competency: "Architectural Trade-offs", sessionIndex: 3, sessionName: "Session #4", score: 78, feedbackSnippet: "Good latency vs throughput analysis.", questionPrompt: "Design an IoT telemetry ingestion service." },
      { competency: "Architectural Trade-offs", sessionIndex: 4, sessionName: "Latest", score: 85, feedbackSnippet: "Comprehensive evaluation of CAP theorem constraints.", questionPrompt: "Multi-master database replication & conflict resolution." },
    ],
    // STAR Impact Metrics
    [
      { competency: "STAR Impact Metrics", sessionIndex: 0, sessionName: "Session #1", score: 52, feedbackSnippet: "Omitted quantified revenue or latency metrics entirely.", questionPrompt: "Describe a time you resolved a major production incident." },
      { competency: "STAR Impact Metrics", sessionIndex: 1, sessionName: "Session #2", score: 60, feedbackSnippet: "Added timeline duration but lacked % reduction.", questionPrompt: "Tell me about a difficult architectural disagreement." },
      { competency: "STAR Impact Metrics", sessionIndex: 2, sessionName: "Session #3", score: 72, feedbackSnippet: "Included 30% speedup metric; STAR structure improving.", questionPrompt: "Lead a cross-functional migration project." },
      { competency: "STAR Impact Metrics", sessionIndex: 3, sessionName: "Session #4", score: 79, feedbackSnippet: "Strong Result component with robust business ROI.", questionPrompt: "Scale an engineering team velocity." },
      { competency: "STAR Impact Metrics", sessionIndex: 4, sessionName: "Latest", score: 90, feedbackSnippet: "Excellent STAR framing with concrete SLA reduction figures.", questionPrompt: "Deliver a high-visibility platform migration." },
    ],
    // Conceptual Depth
    [
      { competency: "Conceptual Depth", sessionIndex: 0, sessionName: "Session #1", score: 65, feedbackSnippet: "Surface-level explanation of memory primitives.", questionPrompt: "Explain garbage collection algorithms." },
      { competency: "Conceptual Depth", sessionIndex: 1, sessionName: "Session #2", score: 70, feedbackSnippet: "Moderate depth on thread pooling.", questionPrompt: "Compare process vs thread memory models." },
      { competency: "Conceptual Depth", sessionIndex: 2, sessionName: "Session #3", score: 76, feedbackSnippet: "Good explanation of lock-free data structures.", questionPrompt: "Compare optimistic vs pessimistic concurrency." },
      { competency: "Conceptual Depth", sessionIndex: 3, sessionName: "Session #4", score: 84, feedbackSnippet: "Rigorous exploration of kernel primitives.", questionPrompt: "Explain Linux epoll vs select I/O multiplexing." },
      { competency: "Conceptual Depth", sessionIndex: 4, sessionName: "Latest", score: 89, feedbackSnippet: "Deep domain mastery across distributed protocols.", questionPrompt: "Explain vector clock synchronization in distributed storage." },
    ],
    // Communication Clarity
    [
      { competency: "Communication Clarity", sessionIndex: 0, sessionName: "Session #1", score: 75, feedbackSnippet: "Clear cadence with slight pacing acceleration.", questionPrompt: "Introduction and past experience overview." },
      { competency: "Communication Clarity", sessionIndex: 1, sessionName: "Session #2", score: 80, feedbackSnippet: "Professional tone and articulate delivery.", questionPrompt: "System design rationale." },
      { competency: "Communication Clarity", sessionIndex: 2, sessionName: "Session #3", score: 85, feedbackSnippet: "Strong structural signposting during answers.", questionPrompt: "Behavioral conflict resolution." },
      { competency: "Communication Clarity", sessionIndex: 3, sessionName: "Session #4", score: 90, feedbackSnippet: "Exceptional executive presence.", questionPrompt: "Technical roadmap presentation." },
      { competency: "Communication Clarity", sessionIndex: 4, sessionName: "Latest", score: 95, feedbackSnippet: "Masterclass in articulate, concise executive delivery.", questionPrompt: "Closing defense and team vision." },
    ],
  ];

  const getCellColor = (score: number) => {
    if (score >= 85) return "bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800";
    if (score >= 70) return "bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-800";
    return "bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-200 border-rose-300 dark:border-rose-800";
  };

  return (
    <div
      role="region"
      aria-label="Longitudinal Weakness Heatmap & Skill Matrix"
      className="w-full border border-slate-200/80 dark:border-[#242C3B] bg-white dark:bg-[#181E29] rounded-2xl p-4 shadow-xs space-y-3.5"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Grid className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white tracking-tight">
              Longitudinal Weakness Heatmap &amp; Skill Matrix
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Cross-reference historical session scores with competencies across chronological timeline
            </p>
          </div>
        </div>

        {/* Color + Icon Independent Legend */}
        <div className="flex items-center gap-2.5 text-xs font-medium self-start sm:self-auto">
          <span className="flex items-center gap-1 text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-900">
            <AlertTriangle className="w-3 h-3 text-rose-600 dark:text-rose-400" aria-hidden="true" />
            <span>&lt;70 Needs Focus</span>
          </span>
          <span className="flex items-center gap-1 text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-900">
            <Info className="w-3 h-3 text-amber-600 dark:text-amber-400" aria-hidden="true" />
            <span>70-84 Developing</span>
          </span>
          <span className="flex items-center gap-1 text-emerald-800 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-900">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            <span>85+ Strong</span>
          </span>
        </div>
      </div>

      {/* Heatmap Matrix Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs" aria-label="Competency history matrix table">
          <thead>
            <tr className="border-b border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-bold">
              <th scope="col" className="py-2 px-3">Competency / Skill</th>
              {sessions.map((s) => (
                <th key={s} scope="col" className="py-2 px-2 text-center font-mono">{s}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {matrixData.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-slate-50/70 dark:hover:bg-[#1C2230]/70 transition-colors">
                <th scope="row" className="py-2 px-3 font-bold text-slate-900 dark:text-white whitespace-nowrap text-xs">
                  {competencies[rIdx]}
                </th>
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="py-1.5 px-1.5 text-center">
                    <button
                      type="button"
                      onClick={() => setSelectedCell(cell)}
                      aria-label={`${cell.competency} in ${cell.sessionName}: score ${cell.score} out of 100`}
                      className={`min-w-[44px] min-h-[44px] mx-auto rounded-xl font-mono font-extrabold text-xs border flex items-center justify-center transition-transform hover:scale-105 cursor-pointer shadow-2xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#E87A42] focus-visible:ring-offset-1 ${getCellColor(
                        cell.score
                      )}`}
                    >
                      {cell.score}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Drilldown Modal / Detail Drawer */}
      {selectedCell && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cell-modal-title"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in-50"
        >
          <div className="bg-white dark:bg-[#1A212D] border border-slate-200 dark:border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="space-y-0.5">
                <span className="text-xs font-mono text-[#E87A42] uppercase tracking-wider font-extrabold">
                  {selectedCell.sessionName} • Drilldown Inspection
                </span>
                <h4 id="cell-modal-title" className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedCell.competency} ({selectedCell.score}/100)
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCell(null)}
                aria-label="Close modal"
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#E87A42]"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#131822] border border-slate-200 dark:border-slate-800 space-y-1.5">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">Question Prompt:</span>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  &ldquo;{selectedCell.questionPrompt}&rdquo;
                </p>
              </div>

              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 space-y-1.5">
                <span className="text-xs font-bold text-rose-700 dark:text-rose-300 uppercase flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" aria-hidden="true" />
                  <span>Recorded Feedback &amp; Mistake Analysis:</span>
                </span>
                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                  {selectedCell.feedbackSnippet}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedCell(null)}
                className="min-h-[44px] px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const comp = encodeURIComponent(selectedCell.competency);
                  setSelectedCell(null);
                  router.push(`/interview/new?drill=${comp}`);
                }}
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#E87A42] hover:bg-[#d85322] text-white text-xs font-bold shadow-xs flex items-center gap-2 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#E87A42] focus-visible:ring-offset-2"
              >
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                <span>Launch Targeted Remediation Drill</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
