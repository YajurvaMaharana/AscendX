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
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface RecommendationDrill {
  id: string;
  topic: string;
  focusArea: string;
  targetMetric: string;
  durationMinutes: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  persona: string;
  personaName: string;
  interviewType: string;
  weaknessIdentified: string;
  promptText: string;
  expectedOutcome: string;
  readinessDelta: string;
}

const RECOMMENDED_DRILLS: RecommendationDrill[] = [
  {
    id: "star-action",
    topic: "STAR Structure Behavioral Practice",
    focusArea: "Action & Ownership Focus",
    targetMetric: "Action Score Focus (Target: +18 pts)",
    durationMinutes: 8,
    difficulty: "Beginner",
    persona: "hr-partner",
    personaName: "Sarah Jenkins (HR Director)",
    interviewType: "Behavioral",
    weaknessIdentified: "Action step frequently diluted into passive team phrasing ('we did') instead of specific individual engineering decisions and technical ownership.",
    promptText: "Describe a critical production incident or technical disagreement where you took decisive individual action to resolve the impasse and mitigate downtime.",
    expectedOutcome: "Master the 'I' vs 'We' boundary, articulate exact technical steps taken, and tie results to concrete latency or recovery metrics.",
    readinessDelta: "+12% Behavioral Readiness",
  },
  {
    id: "system-design-concurrency",
    topic: "Distributed Locking & Concurrency",
    focusArea: "Race Conditions & Deadlock Prevention",
    targetMetric: "Concurrency Depth (Target: +15 pts)",
    durationMinutes: 10,
    difficulty: "Intermediate",
    persona: "tech-grinder",
    personaName: "Alex Vance (Lead Architect)",
    interviewType: "Technical",
    weaknessIdentified: "Proactive isolation strategies and distributed locking trade-offs (e.g., Redis Redlock vs DB optimistic locking) were unaddressed under heavy write load.",
    promptText: "Walk me through how you would prevent double-booking or double-charging in a high-concurrency seat reservation system handling 50k RPS.",
    expectedOutcome: "Demonstrate idempotent API design, database isolation levels, and graceful degradation during network partitions.",
    readinessDelta: "+15% Architecture Readiness",
  },
  {
    id: "star-result-quantification",
    topic: "STAR Metric Quantification Drill",
    focusArea: "Result & Business Impact",
    targetMetric: "Impact Score Focus (Target: +20 pts)",
    durationMinutes: 8,
    difficulty: "Beginner",
    persona: "simulation-boss",
    personaName: "Marcus Sterling (VP of Engineering)",
    interviewType: "Behavioral",
    weaknessIdentified: "Past project summaries lacked concrete statistical outcomes (e.g., % latency drop, $ cloud cost saved, or SLA adherence).",
    promptText: "Tell me about a legacy refactoring or migration project you led. What baseline metrics did you establish and what was the measured final result?",
    expectedOutcome: "Quantify engineering ROI, SLA improvements, and communicate business value to senior leadership.",
    readinessDelta: "+10% Leadership Readiness",
  },
];

export default function ProminentRecommendationCard() {
  const router = useRouter();
  const [selectedDrillId, setSelectedDrillId] = useState<string>("star-action");
  const [isStarting, setIsStarting] = useState(false);

  const activeDrill =
    RECOMMENDED_DRILLS.find((d) => d.id === selectedDrillId) || RECOMMENDED_DRILLS[0];

  const handleStartPractice = () => {
    setIsStarting(true);
    // Route directly into new interview session calibrated with drill parameters
    const params = new URLSearchParams({
      persona: activeDrill.persona,
      type: activeDrill.interviewType.toLowerCase(),
      focus: activeDrill.id,
      topic: activeDrill.topic,
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
                Targeted AI Recommendation
              </span>
              <span className="text-slate-400 dark:text-slate-500 text-xs">·</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Highest ROI Next Step
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {activeDrill.topic}
            </h2>
          </div>
        </div>

        {/* Drill Mode Switcher Tabs */}
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
              {drill.id === "star-action" ? "STAR Action Drill" : drill.id === "system-design-concurrency" ? "Concurrency Drill" : "STAR Metrics"}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Body */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 pt-4 sm:pt-5 items-center">
        {/* Left / Center: Prompt Details & Identified Weakness (Col 1-8) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Metadata Specs (Clean typography without pills) */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            <span className="font-bold text-[#E8602E]">{activeDrill.focusArea}</span>
            <span className="text-slate-400">·</span>
            <span className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-300">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{activeDrill.durationMinutes} min duration</span>
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-700 dark:text-slate-300">Difficulty: {activeDrill.difficulty}</span>
            <span className="text-slate-400">·</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{activeDrill.readinessDelta}</span>
          </div>

          {/* Prompt Quote Box */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white/90 dark:bg-[#121620] border border-slate-200/80 dark:border-slate-800 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
              <span>Curated Practice Prompt</span>
              <span>Interviewer: {activeDrill.personaName}</span>
            </div>
            <p className="text-sm sm:text-[15px] font-medium text-slate-900 dark:text-slate-100 leading-relaxed italic">
              &ldquo;{activeDrill.promptText}&rdquo;
            </p>
          </div>

          {/* Diagnostic Context: Top Identified Weakness */}
          <div className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 mr-1">
                Identified Gap:
              </span>
              <span>{activeDrill.weaknessIdentified}</span>
            </div>
          </div>
        </div>

        {/* Right: Primary Conversion Action Box (Col 9-12) */}
        <div className="lg:col-span-4 flex flex-col justify-center items-stretch p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-white/95 to-slate-50/95 dark:from-[#131722] dark:to-[#0F131C] border border-[#E8602E]/25 dark:border-slate-700/80 shadow-md space-y-3.5">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Session Goal
            </span>
            <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
              {activeDrill.targetMetric}
            </p>
          </div>

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

          <p className="text-[10px] text-center text-slate-500 dark:text-slate-400 font-medium">
            Instant start · Text & Full Voice · AI Adaptive Probing
          </p>
        </div>
      </div>
    </div>
  );
}
