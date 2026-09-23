"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  Clock,
  Target,
  Zap,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Play,
  HelpCircle,
  ChevronDown,
  BarChart2,
  Sliders,
  Layers,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface RecommendationDrill {
  id: string;
  title: string; // e.g. Handling "Tell me about a challenge"
  category: string; // e.g. Behavioral & STAR Technique
  focusArea: string;
  targetMetric: string;
  durationMinutes: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  persona: string;
  personaName: string;
  interviewType: string;
  tailoredReason: string; // e.g. "Action score is 58% while Situation and Result are above 80%..."
  promptText: string;
  expectedOutcome: string;
  readinessDelta: string;
  rubricBreakdown: {
    situation: number;
    task: number;
    action: number;
    result: number;
  };
}

const RECOMMENDED_DRILLS: RecommendationDrill[] = [
  {
    id: "star-challenge-action",
    title: 'Handling "Tell me about a challenge"',
    category: "Behavioral & STAR Technique",
    focusArea: "Action Score & Individual Ownership",
    targetMetric: "Action Score Focus (Target: +22 pts)",
    durationMinutes: 8,
    difficulty: "Beginner",
    persona: "hr-partner",
    personaName: "Sarah Jenkins (HR Director)",
    interviewType: "Behavioral",
    tailoredReason:
      "Action score is 58% while Situation (84%) and Result (82%) are above 80%. In past sessions, answers described the problem context and final outcome well, but diluted the critical 'Action' step with passive team voice ('we did') instead of stating your exact engineering decisions.",
    promptText:
      "Tell me about a significant technical challenge or unexpected roadblock you faced on a critical project. Walk me through the exact actions you personally took to resolve it.",
    expectedOutcome:
      "Isolate your individual contributions, articulate 2-3 specific technical interventions taken under pressure, and bridge smoothly into measurable results.",
    readinessDelta: "+14% Behavioral Readiness",
    rubricBreakdown: {
      situation: 84,
      task: 82,
      action: 58,
      result: 81,
    },
  },
  {
    id: "distributed-locking-concurrency",
    title: 'Designing High-Throughput Distributed Locks',
    category: "System Design & Architecture",
    focusArea: "Race Conditions & Deadlock Prevention",
    targetMetric: "Concurrency Depth (Target: +18 pts)",
    durationMinutes: 10,
    difficulty: "Intermediate",
    persona: "tech-grinder",
    personaName: "Alex Vance (Lead Architect)",
    interviewType: "Technical",
    tailoredReason:
      "Concurrency Depth score is 62% while High-Level Architecture is 88%. Previous designs omitted distributed deadlock prevention, lock TTL renewal, and network partition failovers.",
    promptText:
      "Walk me through how you would implement distributed locking for a ticketing system handling 50k RPS to prevent double-booking without introducing cascading latency.",
    expectedOutcome:
      "Evaluate Redlock vs optimistic DB versioning, handle split-brain edge cases, and maintain strict consistency guarantees.",
    readinessDelta: "+15% Architecture Readiness",
    rubricBreakdown: {
      situation: 88,
      task: 85,
      action: 62,
      result: 79,
    },
  },
  {
    id: "star-metric-impact",
    title: 'Quantifying Business & Engineering Impact',
    category: "Leadership & Impact",
    focusArea: "Result Score & Metric Articulation",
    targetMetric: "Impact Score Focus (Target: +20 pts)",
    durationMinutes: 8,
    difficulty: "Beginner",
    persona: "simulation-boss",
    personaName: "Marcus Sterling (VP of Engineering)",
    interviewType: "Behavioral",
    tailoredReason:
      "Result Score is 60% while Communication is 89%. Answers effectively convey interpersonal conflict resolution but leave out quantifiable ROI, latency reductions, or SLA improvements.",
    promptText:
      "Describe a legacy refactoring or infrastructure overhaul you led. What baseline metrics did you track before starting, and what were the exact measured outcomes post-launch?",
    expectedOutcome:
      "Quantify metrics (% latency reduction, $ cost savings, MTTR drop), communicate trade-offs, and align technical wins with executive goals.",
    readinessDelta: "+12% Leadership Readiness",
    rubricBreakdown: {
      situation: 86,
      task: 84,
      action: 78,
      result: 60,
    },
  },
];

export default function ProminentRecommendationCard() {
  const router = useRouter();
  const [selectedDrillId, setSelectedDrillId] = useState<string>("star-challenge-action");
  const [isStarting, setIsStarting] = useState(false);
  const [showViewWhyModal, setShowViewWhyModal] = useState(false);

  const activeDrill =
    RECOMMENDED_DRILLS.find((d) => d.id === selectedDrillId) || RECOMMENDED_DRILLS[0];

  const handleStartPractice = () => {
    setIsStarting(true);
    // Route directly into new interview session calibrated with drill parameters
    const params = new URLSearchParams({
      persona: activeDrill.persona,
      type: activeDrill.interviewType.toLowerCase(),
      focus: activeDrill.id,
      topic: activeDrill.title,
      duration: activeDrill.durationMinutes.toString(),
      difficulty: activeDrill.difficulty.toLowerCase(),
    });
    router.push(`/interview/new?${params.toString()}`);
  };

  return (
    <div className="w-full relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[#E8602E]/40 dark:border-[#E8602E]/30 bg-gradient-to-br from-white via-[#FFF9F6] to-[#FFF2EB] dark:from-[#181F2C] dark:via-[#151A24] dark:to-[#1A1820] p-4 sm:p-6 lg:p-7 shadow-[0_10px_35px_rgba(232,96,46,0.12)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)] transition-all">
      {/* Background Ambient Accents */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#E8602E]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Row */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8602E]/15 dark:border-slate-800">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#E8602E] to-[#F17E45] text-white flex items-center justify-center shadow-[0_4px_16px_rgba(232,96,46,0.35)] shrink-0">
            <Zap className="w-5 h-5 fill-current text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#E8602E]">
                Recommended Practice Drill
              </span>
              <span className="text-slate-400 dark:text-slate-500 text-xs">·</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Category: {activeDrill.category}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {activeDrill.title}
            </h2>
          </div>
        </div>

        {/* Drill Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-white/80 dark:bg-[#121620] rounded-xl border border-slate-200/80 dark:border-slate-700/80 self-start sm:self-auto">
          {RECOMMENDED_DRILLS.map((drill) => (
            <button
              key={drill.id}
              type="button"
              onClick={() => setSelectedDrillId(drill.id)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                selectedDrillId === drill.id
                  ? "bg-[#E8602E] text-white shadow-2xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {drill.id === "star-challenge-action"
                ? "Challenge Prompt"
                : drill.id === "distributed-locking-concurrency"
                ? "Concurrency"
                : "Metrics & ROI"}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Body */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 pt-4 sm:pt-5 items-center">
        {/* Left / Center: Specific Reason, Metadata, and Practice Prompt (Col 1-8) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Metadata Specs (Clean typography with unboxed separators) */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            <span className="font-bold text-[#E8602E]">{activeDrill.focusArea}</span>
            <span className="text-slate-400">·</span>
            <span className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-300">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{activeDrill.durationMinutes} min estimated duration</span>
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-700 dark:text-slate-300 font-medium">
              Difficulty: <strong className="text-slate-900 dark:text-white">{activeDrill.difficulty}</strong>
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{activeDrill.readinessDelta}</span>
          </div>

          {/* Tailored Reason for Recommendation */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 text-xs text-slate-800 dark:text-slate-200 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-amber-700 dark:text-amber-400">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Tailored Reason Based on Recent Performance Data:</span>
            </div>
            <p className="leading-relaxed pl-6 text-slate-700 dark:text-slate-300">
              {activeDrill.tailoredReason}
            </p>
          </div>

          {/* Practice Prompt Preview */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white/90 dark:bg-[#121620] border border-slate-200/80 dark:border-slate-800 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
              <span>Simulation Practice Prompt</span>
              <span>Interviewer Persona: {activeDrill.personaName}</span>
            </div>
            <p className="text-sm sm:text-[15px] font-medium text-slate-900 dark:text-slate-100 leading-relaxed italic">
              &ldquo;{activeDrill.promptText}&rdquo;
            </p>
          </div>
        </div>

        {/* Right: Primary ([Start practice]) & Secondary ([View why]) Action Box (Col 9-12) */}
        <div className="lg:col-span-4 flex flex-col justify-center items-stretch p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-white/95 to-slate-50/95 dark:from-[#131722] dark:to-[#0F131C] border border-[#E8602E]/25 dark:border-slate-700/80 shadow-md space-y-3.5">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Target Impact
            </span>
            <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
              {activeDrill.targetMetric}
            </p>
          </div>

          {/* Action Buttons: Primary + Secondary */}
          <div className="space-y-2">
            {/* Primary Action Button: [Start practice] */}
            <Button
              type="button"
              onClick={handleStartPractice}
              disabled={isStarting}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-[#E8602E] to-[#F17E45] hover:from-[#d85322] hover:to-[#e07038] text-white font-bold text-sm shadow-[0_6px_22px_rgba(232,96,46,0.4)] transition-all transform active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current text-white" />
              <span>{isStarting ? "Launching Drill..." : "Start practice"}</span>
              <ArrowRight className="w-4 h-4 text-white/90 ml-0.5 group-hover:translate-x-1 transition-transform" />
            </Button>

            {/* Secondary Action Button: [View why] */}
            <button
              type="button"
              onClick={() => setShowViewWhyModal(true)}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>View why</span>
            </button>
          </div>

          <p className="text-[10px] text-center text-slate-500 dark:text-slate-400 font-medium">
            Adaptive AI Probing · Real-time Voice / Text
          </p>
        </div>
      </div>

      {/* ── View Why Detailed Breakdown Modal ── */}
      {showViewWhyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#181F2C] border border-slate-700/80 rounded-3xl p-6 shadow-2xl text-white space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#E8602E]/20 text-[#E8602E] flex items-center justify-center">
                  <BarChart2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Why This Practice is Recommended</h3>
                  <p className="text-xs text-slate-400">Diagnostic telemetry from your recent mock sessions</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowViewWhyModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Performance Rubric Comparison Bar */}
            <div className="space-y-3 p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                STAR Framework Breakdown Across Recent Sessions
              </span>

              <div className="space-y-2.5 text-xs">
                {/* Situation */}
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-300">Situation (Context Setting)</span>
                    <span className="text-emerald-400">{activeDrill.rubricBreakdown.situation}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${activeDrill.rubricBreakdown.situation}%` }}
                    />
                  </div>
                </div>

                {/* Task */}
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-300">Task (Objective Clarity)</span>
                    <span className="text-emerald-400">{activeDrill.rubricBreakdown.task}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${activeDrill.rubricBreakdown.task}%` }}
                    />
                  </div>
                </div>

                {/* Action (Weakness Highlight) */}
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-[#E8602E] font-bold">Action (Individual Technical Ownership)</span>
                    <span className="text-[#E8602E] font-bold">{activeDrill.rubricBreakdown.action}% (Gap)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#E8602E] rounded-full"
                      style={{ width: `${activeDrill.rubricBreakdown.action}%` }}
                    />
                  </div>
                </div>

                {/* Result */}
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-300">Result (Impact & Metric Quantification)</span>
                    <span className="text-emerald-400">{activeDrill.rubricBreakdown.result}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${activeDrill.rubricBreakdown.result}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Specific AI Assessment Text */}
            <div className="space-y-1.5 text-xs text-slate-300">
              <span className="font-bold text-white block">AI Evaluator Diagnosis:</span>
              <p className="leading-relaxed text-slate-400">
                {activeDrill.tailoredReason}
              </p>
            </div>

            {/* Expected Readiness Lift */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
              <span className="text-slate-300">Target Score Lift After Drill:</span>
              <span className="font-bold text-emerald-400">{activeDrill.readinessDelta}</span>
            </div>

            {/* Modal Footer CTA */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-700/60">
              <button
                type="button"
                onClick={() => setShowViewWhyModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                Close
              </button>
              <Button
                type="button"
                onClick={() => {
                  setShowViewWhyModal(false);
                  handleStartPractice();
                }}
                className="px-5 py-2 rounded-xl bg-[#E8602E] hover:bg-[#d85322] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Start Practice Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
