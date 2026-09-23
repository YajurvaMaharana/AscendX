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
import ProminentRecommendationCard from "@/components/dashboard/ProminentRecommendationCard";
import OverallReadinessSummaryBlock from "@/components/dashboard/OverallReadinessSummaryBlock";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState";
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

  // Simplified interactive local states
  const [selectedLevel, setSelectedLevel] = useState("L5 Senior (Staff)");
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);

  const userDisplayName = user?.email ? user.email.split("@")[0] : "Candidate";

  const handleLaunchInterview = () => {
    setIsLaunching(true);
    router.push("/interview/new");
  };

  const levelOptions = [
    { value: "L4 Mid-Level", label: "L4 · Mid-Level Engineer" },
    { value: "L5 Senior (Staff)", label: "L5 · Senior / Staff Benchmark" },
    { value: "L6 Principal / Lead", label: "L6 · Principal / Tech Lead" },
  ];

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] bg-[#ECEEF2] dark:bg-[#0B0F15] py-3 sm:py-6 px-2 sm:px-4 lg:px-6 transition-colors duration-300">
      {/* Outer Shell Container */}
      <div className="max-w-[1380px] mx-auto bg-[#F9FAFC] dark:bg-[#151922] border border-slate-200/80 dark:border-[#222B3A] rounded-[28px] p-4 sm:p-6 lg:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.6)] space-y-8 transition-colors duration-300">
        
        {/* ========================================================================= */}
        {/* 1. WELCOME & READINESS SUMMARY (Top Visual Anchor)                        */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          {/* Central Summary Metric Display (Prominent Headline Readiness Score & Key Indicators) */}
          <OverallReadinessSummaryBlock
            score={74}
            monthlyDelta={12}
            strongestSkill={{ name: "STAR Storytelling & Framing", score: 92 }}
            focusArea={{ name: "Action Score & Concurrency Depth", score: 68 }}
            nextMilestone={{ name: "Staff / L5 Benchmark (85/100)", targetScore: 85 }}
            userDisplayName={userDisplayName}
          />
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

            {/* Streamlined Interview Level Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">
                Interview Level:
              </span>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-3 py-1.5 bg-white dark:bg-[#1C2230] border border-slate-200/80 dark:border-slate-700/80 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-[#E87A42] transition-colors cursor-pointer"
              >
                {levelOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Left: Skill Comparison Horizontal Bars / Radar Profile (Col 1-5) */}
            <div className="lg:col-span-5 p-5 bg-white dark:bg-[#181E29] rounded-2xl border border-slate-200/80 dark:border-[#242C3B] shadow-sm flex flex-col justify-between">
              <SkillReadinessRadar
                communication={78}
                techDepth={72}
                starStructure={61}
                confidence={84}
                title="Core Competency Scores"
                subtitle="Performance breakdown across core interview dimensions"
                defaultView="bars"
              />
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
            <div className="lg:col-span-7 p-5 bg-white dark:bg-[#181E29] rounded-2xl border border-slate-200/80 dark:border-[#242C3B] shadow-sm">
              <CompetencyGrowthLineChart
                title="Progress Over Time"
                subtitle="Session-by-session score trajectory & competency growth"
                initialFilter="30d"
              />
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
              <StarRubricFeedbackCard
                onPracticeAction={() => router.push("/interview/new?type=behavioral&focus=action")}
              />
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
    </div>
  );
}
