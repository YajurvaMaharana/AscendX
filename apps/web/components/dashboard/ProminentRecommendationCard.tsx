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
    title: "Quantifying Business & Engineering Impact",
    category: "Executive Communication & Behavioral",
    focusArea: "Result Score & ROI Framing",
    targetMetric: "Result Score Focus (Target: +20 pts)",
    durationMinutes: 7,
    difficulty: "Advanced",
    persona: "executive-dir",
    personaName: "Marcus Sterling (VP of Engineering)",
    interviewType: "Behavioral",
    tailoredReason:
      "Result score is 64% while Technical Correctness is 90%. Recent responses lacked quantifiable business metrics (e.g. latency drop, infrastructure cost savings, SLA compliance).",
    promptText:
      "Describe a major project where your engineering work drove a noticeable business or user outcome. What specific metrics prove the success of your solution?",
    expectedOutcome:
      "Frame technical accomplishments through high-level ROI, quantify latency/throughput metrics, and articulate team velocity gains.",
    readinessDelta: "+12% Executive Framing",
    rubricBreakdown: {
      situation: 90,
      task: 88,
      action: 82,
      result: 64,
    },
  },
];

export interface ProminentRecommendationCardProps {
  totalSessions?: number;
}

const FIRST_SESSION_DRILL: RecommendationDrill = {
  id: "first-session-diagnostic",
  title: "Diagnostic Baseline Assessment",
  category: "Full-Stack Core & System Fundamentals",
  focusArea: "Baseline Technical & Delivery Calibration",
  targetMetric: "Establish First Readiness Score",
  durationMinutes: 15,
  difficulty: "Beginner",
  persona: "tech-grinder",
  personaName: "Alex Vance (Lead Architect)",
  interviewType: "Technical",
  tailoredReason:
    "You have not completed any mock sessions yet. Complete this initial diagnostic session to establish your baseline readiness score, evaluate your problem-solving approach, and generate personalized drill recommendations.",
  promptText:
    "Welcome to your initial diagnostic interview. Let's start with your core engineering foundation: Walk me through a challenging technical problem you solved recently, your architectural trade-offs, and how you verified correctness.",
  expectedOutcome:
    "Establish your baseline across Technical Depth, Communication Clarity, and Problem-Solving approach.",
  readinessDelta: "Calibrates Initial Score",
  rubricBreakdown: {
    situation: 0,
    task: 0,
    action: 0,
    result: 0,
  },
};

export default function ProminentRecommendationCard({
  totalSessions = 0,
}: ProminentRecommendationCardProps = {}) {
  const router = useRouter();
  const [selectedDrillId, setSelectedDrillId] = useState<string>(
    totalSessions === 0 ? "first-session-diagnostic" : "star-challenge-action"
  );
  const [showViewWhyModal, setShowViewWhyModal] = useState<boolean>(false);
  const [isStarting, setIsStarting] = useState<boolean>(false);

  const availableDrills = totalSessions === 0 ? [FIRST_SESSION_DRILL, ...RECOMMENDED_DRILLS] : RECOMMENDED_DRILLS;

  const activeDrill =
    availableDrills.find((d) => d.id === selectedDrillId) || availableDrills[0];

  const handleStartPractice = () => {
    setIsStarting(true);
    const targetUrl = `/interview/new?drill=${activeDrill.id}&persona=${activeDrill.persona}&type=${activeDrill.interviewType.toLowerCase()}`;
    router.push(targetUrl);
  };

  return (
    <div
      role="region"
      aria-label="Recommended Practice Area"
      className="relative overflow-hidden rounded-[24px] border border-[#E8602E]/30 dark:border-[#E8602E]/40 bg-gradient-to-br from-[#FFF8F3] via-white to-[#FFF0E6] dark:from-[#1E1714] dark:via-[#161B26] dark:to-[#131722] p-5 sm:p-7 shadow-[0_8px_32px_rgba(232,96,46,0.08)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)] transition-all"
    >
      {/* Decorative Subtle Accent Gradient Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#E8602E]/15 via-[#F17E45]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8602E]/20 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#E8602E] text-white flex items-center justify-center shadow-md shrink-0">
            <Sparkles className="w-5 h-5 text-white" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#A24419] dark:text-[#FFAC82] bg-[#FFF0E6] dark:bg-[#341F14] px-2.5 py-0.5 rounded-full border border-[#E8602E]/30">
                Highest Impact Practice Area
              </span>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/60 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                <span>Diagnostic Recommended</span>
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Recommended practice: {activeDrill.title}
            </h2>
          </div>
        </div>

        {/* Drill Switching Dropdown */}
        <div className="inline-flex items-center gap-2 self-start sm:self-auto">
          <label htmlFor="drill-select" className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Select Drill:
          </label>
          <select
            id="drill-select"
            value={selectedDrillId}
            onChange={(e) => setSelectedDrillId(e.target.value)}
            className="min-h-[44px] px-3 py-2 bg-white dark:bg-[#1C2230] text-slate-900 dark:text-white text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 shadow-2xs cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#E8602E]"
          >
            {RECOMMENDED_DRILLS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.title} ({d.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 pt-4 sm:pt-5 items-center">
        {/* Left / Center: Specific Reason, Metadata, and Practice Prompt */}
        <div className="lg:col-span-8 space-y-4">
          {/* Metadata Specs */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-700 dark:text-slate-300">
            <span className="font-extrabold text-[#A24419] dark:text-[#FFAC82]">{activeDrill.focusArea}</span>
            <span className="text-slate-400" aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1 text-slate-800 dark:text-slate-200">
              <Clock className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
              <span>{activeDrill.durationMinutes} min estimated duration</span>
            </span>
            <span className="text-slate-400" aria-hidden="true">·</span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">
              Difficulty: <strong className="text-slate-900 dark:text-white font-extrabold">{activeDrill.difficulty}</strong>
            </span>
            <span className="text-slate-400" aria-hidden="true">·</span>
            <span className="text-emerald-700 dark:text-emerald-300 font-bold">{activeDrill.readinessDelta}</span>
          </div>

          {/* Tailored Reason for Recommendation */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/30 text-xs text-slate-800 dark:text-slate-200 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" aria-hidden="true" />
              <span>Tailored Reason Based on Recent Performance Data:</span>
            </div>
            <p className="leading-relaxed pl-6 text-slate-800 dark:text-slate-200">
              {activeDrill.tailoredReason}
            </p>
          </div>

          {/* Practice Prompt Preview */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white/95 dark:bg-[#121620] border border-slate-200 dark:border-slate-800 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
              <span>Simulation Practice Prompt</span>
              <span>Interviewer Persona: {activeDrill.personaName}</span>
            </div>
            <p className="text-sm sm:text-base font-medium text-slate-900 dark:text-slate-100 leading-relaxed italic">
              &ldquo;{activeDrill.promptText}&rdquo;
            </p>
          </div>
        </div>

        {/* Right: Primary ([Start practice]) & Secondary ([View why]) Action Box */}
        <div className="lg:col-span-4 flex flex-col justify-center items-stretch p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-white/95 to-slate-50/95 dark:from-[#131722] dark:to-[#0F131C] border border-[#E8602E]/30 dark:border-slate-700 shadow-md space-y-3.5">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
              Target Impact
            </span>
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {activeDrill.targetMetric}
            </p>
          </div>

          {/* Action Buttons: Primary + Secondary */}
          <div className="space-y-2.5">
            {/* Primary Action Button: [Start practice] */}
            <Button
              type="button"
              onClick={handleStartPractice}
              disabled={isStarting}
              className="w-full min-h-[44px] h-12 rounded-xl bg-[#E87A42] hover:bg-[#d85322] active:scale-[0.98] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#E87A42] focus-visible:ring-offset-2"
            >
              <Play className="w-4 h-4 fill-current text-white" aria-hidden="true" />
              <span>{isStarting ? "Launching Drill..." : "Start practice"}</span>
              <ArrowRight className="w-4 h-4 text-white/90 ml-0.5" aria-hidden="true" />
            </Button>

            {/* Secondary Action Button: [View why] */}
            <button
              type="button"
              onClick={() => setShowViewWhyModal(true)}
              className="w-full min-h-[44px] py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              <HelpCircle className="w-4 h-4 text-slate-600 dark:text-slate-400" aria-hidden="true" />
              <span>View why</span>
            </button>
          </div>

          <p className="text-xs text-center text-slate-600 dark:text-slate-400 font-medium">
            Adaptive AI Probing · Real-time Voice / Text
          </p>
        </div>
      </div>

      {/* View Why Detailed Breakdown Modal */}
      {showViewWhyModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="view-why-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-lg bg-[#181F2C] border border-slate-700 rounded-3xl p-6 shadow-2xl text-white space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#E8602E]/20 text-[#E8602E] flex items-center justify-center">
                  <BarChart2 className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <h3 id="view-why-title" className="text-base font-bold text-white">Why This Practice is Recommended</h3>
                  <p className="text-xs text-slate-300">Diagnostic telemetry from your recent mock sessions</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowViewWhyModal(false)}
                aria-label="Close modal"
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#E8602E]"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* Performance Rubric Comparison Bar */}
            <div className="space-y-3 p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                STAR Framework Breakdown Across Recent Sessions
              </span>

              <div className="space-y-2.5 text-xs">
                {/* Situation */}
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-200">Situation (Context Setting)</span>
                    <span className="text-emerald-300">{activeDrill.rubricBreakdown.situation}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${activeDrill.rubricBreakdown.situation}%` }}
                    />
                  </div>
                </div>

                {/* Task */}
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-200">Task (Objective)</span>
                    <span className="text-emerald-300">{activeDrill.rubricBreakdown.task}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${activeDrill.rubricBreakdown.task}%` }}
                    />
                  </div>
                </div>

                {/* Action */}
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-200">Action (Individual Contributions)</span>
                    <span className="text-[#FFAC82] font-extrabold">{activeDrill.rubricBreakdown.action}% (Bottleneck)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#E87A42] rounded-full"
                      style={{ width: `${activeDrill.rubricBreakdown.action}%` }}
                    />
                  </div>
                </div>

                {/* Result */}
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-200">Result (Impact &amp; Metrics)</span>
                    <span className="text-emerald-300">{activeDrill.rubricBreakdown.result}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${activeDrill.rubricBreakdown.result}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowViewWhyModal(false)}
                className="min-h-[44px] px-5 py-2.5 rounded-xl border border-slate-700 text-xs font-bold text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowViewWhyModal(false);
                  handleStartPractice();
                }}
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#E87A42] hover:bg-[#d85322] text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#E87A42]"
              >
                <span>Start Practice Drill Now</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
