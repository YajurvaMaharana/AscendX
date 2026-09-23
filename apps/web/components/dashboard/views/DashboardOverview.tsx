"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mic,
  Search,
  ChevronDown,
  Info,
  ArrowDown,
  History,
  Sparkles,
  ShieldCheck,
  Target,
  TrendingUp,
  Activity,
  Award,
  Layers,
  ArrowRight,
  Flame,
  CheckCircle2,
  SlidersHorizontal,
} from "lucide-react";
import ResumeJDCard from "@/components/dashboard/ResumeJDCard";
import SkillReadinessRadar from "@/components/dashboard/SkillReadinessRadar";
import CompetencyGrowthLineChart from "@/components/dashboard/CompetencyGrowthLineChart";
import DeliveryTelemetry from "@/components/dashboard/DeliveryTelemetry";
import StarRubricFeedbackCard from "@/components/dashboard/StarRubricFeedbackCard";
import ActiveTelemetryStreamCard from "@/components/dashboard/ActiveTelemetryStreamCard";
import ExecutiveSummaryCard from "@/components/dashboard/ExecutiveSummaryCard";
import AnswerRewriteCard from "@/components/dashboard/AnswerRewriteCard";
import WeaknessHeatmapCard from "@/components/dashboard/WeaknessHeatmapCard";
import ReadinessScoreWidget from "@/components/dashboard/ReadinessScoreWidget";
import DailyDrillWidget from "@/components/dashboard/DailyDrillWidget";
import AsyncCoachNotesCard from "@/components/dashboard/AsyncCoachNotesCard";
import PreFlightModal from "@/components/interview/PreFlightModal";
import ProminentRecommendationCard from "@/components/dashboard/ProminentRecommendationCard";
import { useAuth } from "@/context/AuthContext";

export interface DashboardOverviewProps {
  initialSessions?: Array<{
    id: string;
    role: string;
    difficulty: string;
    status: string;
    created_at: string;
  }>;
  onSwitchTab?: (tab: any) => void;
}

export default function DashboardOverview({
  initialSessions = [],
  onSwitchTab,
}: DashboardOverviewProps) {
  const router = useRouter();
  const { user } = useAuth();

  // Interactive local states
  const [isVoiceActive, setIsVoiceActive] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGraduation, setSelectedGraduation] = useState("All graduations");
  const [isGraduationOpen, setIsGraduationOpen] = useState(false);
  const [isAdaptiveOn, setIsAdaptiveOn] = useState(true);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [showPreFlightModal, setShowPreFlightModal] = useState(false);

  const userDisplayName = user?.email ? user.email.split("@")[0] : "Candidate";

  const handleLaunchInterview = () => {
    setIsLaunching(true);
    router.push("/interview/new");
  };

  const graduationOptions = [
    "All graduations",
    "Senior Full-Stack (L5/Staff)",
    "Backend & Distributed Systems",
    "Frontend & UI Architecture",
    "System Design & Scale",
    "Behavioral (STAR Method)",
  ];

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] bg-[#ECEEF2] dark:bg-[#0B0F15] py-3 sm:py-6 px-2 sm:px-4 lg:px-6 transition-colors duration-300">
      {/* Outer Shell Container */}
      <div className="max-w-[1380px] mx-auto bg-[#F9FAFC] dark:bg-[#151922] border border-slate-200/80 dark:border-[#222B3A] rounded-[28px] p-4 sm:p-6 lg:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.6)] space-y-8 transition-colors duration-300">
        
        {/* ========================================================================= */}
        {/* 1. WELCOME & READINESS SUMMARY (Top Visual Anchor)                        */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          {/* Top Bar Utilities */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Adaptive Telemetry Active</span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span>Model: Gemini 3.8 Flash</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Pre-Flight Diagnostic Button */}
              <button
                type="button"
                onClick={() => setShowPreFlightModal(true)}
                className="flex items-center gap-1.5 bg-white dark:bg-[#1C2230] px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-[#E87A42] hover:border-[#E87A42]/50 transition-colors shadow-2xs cursor-pointer"
                title="Verify camera, microphone, and network speed"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#E87A42]" />
                <span>Pre-Flight Diagnostic</span>
              </button>

              {/* Voice Active Switch */}
              <div className="flex items-center gap-2 bg-white dark:bg-[#1C2230] px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Voice
                </span>
                <button
                  type="button"
                  onClick={() => setIsVoiceActive(!isVoiceActive)}
                  className={`w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-hidden cursor-pointer ${
                    isVoiceActive ? "bg-[#E87A42]" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                  aria-label="Toggle Voice Active"
                >
                  <div
                    className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                      isVoiceActive ? "translate-x-3.5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Hero Welcome Banner with High-Impact Metrics */}
          <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-slate-900 via-[#1A2232] to-[#121620] text-white shadow-lg space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-6 border border-slate-800">
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2 text-xs font-mono text-[#E87A42] uppercase tracking-wider font-semibold">
                <Target className="w-3.5 h-3.5" />
                <span>Active Target Track: Senior Full-Stack (L5/Staff)</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome Back, {userDisplayName}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Your interview readiness benchmark is calibrated at <strong className="text-emerald-400">88%</strong>. Address your identified behavioral & concurrency gaps below to unlock Staff-level certification.
              </p>
            </div>

            {/* Quick Readiness Metrics Cluster */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3 shrink-0 pt-2 sm:pt-0">
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 text-center min-w-[90px]">
                <span className="block text-[10px] text-slate-400 font-medium">Readiness</span>
                <span className="text-xl sm:text-2xl font-black text-white">88%</span>
                <span className="block text-[9px] text-emerald-400 font-semibold mt-0.5">+4.2% wk</span>
              </div>

              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 text-center min-w-[90px]">
                <span className="block text-[10px] text-slate-400 font-medium">Streak</span>
                <span className="text-xl sm:text-2xl font-black text-amber-400 flex items-center justify-center gap-0.5">
                  <Flame className="w-4 h-4 fill-current" />
                  <span>4d</span>
                </span>
                <span className="block text-[9px] text-slate-400 font-semibold mt-0.5">Consistent</span>
              </div>

              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 text-center min-w-[90px]">
                <span className="block text-[10px] text-slate-400 font-medium">Completed</span>
                <span className="text-xl sm:text-2xl font-black text-white">{initialSessions.length || 8}</span>
                <span className="block text-[9px] text-slate-400 font-semibold mt-0.5">Mock Loops</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. RECOMMENDED NEXT ACTION (Highest Actionable Prominence)                */}
        {/* ========================================================================= */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#E87A42]" />
                <span>1. Recommended Next Action</span>
              </h2>
              <span className="text-slate-400 text-xs">·</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Primary focus for today</span>
            </div>
            <button
              type="button"
              onClick={handleLaunchInterview}
              className="text-xs font-bold text-[#E87A42] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Custom Setup</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* High-Visibility Tailored Practice Recommendation Card */}
          <ProminentRecommendationCard />
        </div>

        {/* ========================================================================= */}
        {/* 3. SKILL PERFORMANCE & READINESS MATRIX                                   */}
        {/* ========================================================================= */}
        <div className="space-y-3.5 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#E87A42]" />
                <span>2. Skill Performance & Evaluation Rubrics</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Multi-dimensional competence breakdown across algorithms, architecture, and STAR storytelling
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex items-center gap-2">
              <div className="relative w-40 sm:w-48">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter skills..."
                  className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-[#1C2230] border border-slate-200/80 dark:border-slate-700/80 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-hidden focus:border-[#E87A42] transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Left: Skill Radar Profile (Col 1-5) */}
            <div className="lg:col-span-5 p-5 bg-white dark:bg-[#181E29] rounded-2xl border border-slate-200/80 dark:border-[#242C3B] shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Competency Radar (L5 Benchmark)
                </span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  3 of 4 Domains on Target
                </span>
              </div>
              <div className="py-4 flex items-center justify-center">
                <SkillReadinessRadar
                  communication={88}
                  techDepth={78}
                  deliveryPace={84}
                  starStorytelling={92}
                />
              </div>
              <div className="grid grid-cols-2 gap-2 text-center text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#131822]">
                  <span className="text-slate-400 block text-[10px]">Top Strength</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">STAR Framing (92%)</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#131822]">
                  <span className="text-slate-400 block text-[10px]">Primary Gap</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">Tech Depth (78%)</span>
                </div>
              </div>
            </div>

            {/* Right: Multi-Axis Readiness Breakdown (Col 6-12) */}
            <div className="lg:col-span-7">
              <ReadinessScoreWidget />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. RECENT IMPROVEMENT & COMPETENCY GROWTH                                 */}
        {/* ========================================================================= */}
        <div className="space-y-3.5 pt-2">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span>3. Recent Improvement & Longitudinal Trajectory</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track progress trends over the last 10 mock sessions and monitor weakness mitigation
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Competency Growth Trajectory Chart (Col 1-7) */}
            <div className="lg:col-span-7 p-5 bg-white dark:bg-[#181E29] rounded-2xl border border-slate-200/80 dark:border-[#242C3B] shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Session-by-Session Growth Velocity
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Comparing System Design vs Behavioral Scores
                  </span>
                </div>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  +14% 30-Day Lift
                </span>
              </div>
              <CompetencyGrowthLineChart />
            </div>

            {/* Longitudinal Weakness Heatmap (Col 8-12) */}
            <div className="lg:col-span-5">
              <WeaknessHeatmapCard />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. DETAILED SPEAKING ANALYTICS & AI FEEDBACK                              */}
        {/* ========================================================================= */}
        <div className="space-y-3.5 pt-2">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Mic className="w-4 h-4 text-[#E87A42]" />
              <span>4. Detailed Speaking & Delivery Analytics</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Vocal cadence, speech pacing, filler words, and AI STAR rubric breakdown
            </p>
          </div>

          {/* Delivery Telemetry 4-Metric Grid */}
          <DeliveryTelemetry />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch pt-1">
            {/* AI STAR Rubric Feedback Card (Col 1-6) */}
            <div className="lg:col-span-6">
              <StarRubricFeedbackCard />
            </div>

            {/* Executive Consensus & Answer Rewrite (Col 7-12) */}
            <div className="lg:col-span-6 space-y-4">
              <AnswerRewriteCard
                onPracticeAgain={() => router.push("/interview/new?type=behavioral")}
              />
              <ExecutiveSummaryCard />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 6. INTERVIEWER PERSONA SELECTION RELOCATION BANNER                        */}
        {/* Persona selector moved directly into /interview/new setup workflow         */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#181F2C] border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E8602E]/10 text-[#E8602E] flex items-center justify-center shrink-0">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Interviewer Persona & Evaluator Styles
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Configure your interviewer persona (e.g. Alex Vance, Sarah Jenkins, or Marcus Sterling) directly in the Interview Setup Studio.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLaunchInterview}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>Configure Persona in Setup</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 7. SECONDARY CONTROLS & UTILITIES                                        */}
        {/* ========================================================================= */}
        <div className="space-y-3.5 pt-2 border-t border-slate-200/70 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span>5. Secondary Controls & Grounding Utilities</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Resume / JD Grounding */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                Resume & Job Description
              </span>
              <ResumeJDCard />
            </div>

            {/* 2. Daily 5-Minute Drill */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                Micro-Practice
              </span>
              <DailyDrillWidget />
            </div>

            {/* 3. Async Coach Notes */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                Asynchronous Feedback
              </span>
              <AsyncCoachNotesCard />
            </div>
          </div>
        </div>

        {/* Past Sessions Drawer Toggle */}
        {initialSessions.length > 0 && (
          <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setShowHistoryDrawer(!showHistoryDrawer)}
              className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
            >
              <History className="w-4 h-4 text-[#E87A42]" />
              <span>
                {showHistoryDrawer ? "Hide" : "View"} Recent Practice Sessions ({initialSessions.length})
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${
                  showHistoryDrawer ? "rotate-180" : ""
                }`}
              />
            </button>

            {showHistoryDrawer && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-3">
                {initialSessions.slice(0, 6).map((sess) => (
                  <div
                    key={sess.id}
                    className="p-3 bg-white dark:bg-[#1C2230] rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs shadow-2xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{sess.role}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">
                        {sess.difficulty} • {sess.status}
                      </div>
                    </div>
                    <Link
                      href={`/interview/${sess.id}`}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-[#FFF6F0] dark:hover:bg-[#2C1E18] hover:text-[#E87A42] font-semibold transition-colors"
                    >
                      Resume
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Pre-Flight Diagnostic Modal ── */}
      <PreFlightModal
        isOpen={showPreFlightModal}
        sessionRole="Senior Full-Stack (L5/Staff)"
        interviewType="Technical & Behavioral"
        defaultAudioOnly={!isVoiceActive}
        onProceed={(results) => {
          setShowPreFlightModal(false);
          handleLaunchInterview();
        }}
        onClose={() => setShowPreFlightModal(false)}
      />
    </div>
  );
}
