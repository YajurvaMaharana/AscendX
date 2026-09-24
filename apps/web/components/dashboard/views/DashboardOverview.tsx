"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mic,
  ChevronDown,
  History,
  Sparkles,
  Activity,
  TrendingUp,
  ArrowRight,
  SlidersHorizontal,
} from "lucide-react";
import SkillReadinessRadar from "@/components/dashboard/SkillReadinessRadar";
import CompetencyGrowthLineChart from "@/components/dashboard/CompetencyGrowthLineChart";
import DeliveryTelemetry from "@/components/dashboard/DeliveryTelemetry";
import StarRubricFeedbackCard from "@/components/dashboard/StarRubricFeedbackCard";
import ExecutiveSummaryCard from "@/components/dashboard/ExecutiveSummaryCard";
import InterviewConsensusCard from "@/components/dashboard/InterviewConsensusCard";
import WeaknessHeatmapCard from "@/components/dashboard/WeaknessHeatmapCard";
import ReadinessScoreWidget from "@/components/dashboard/ReadinessScoreWidget";
import ProminentRecommendationCard from "@/components/dashboard/ProminentRecommendationCard";
import OverallReadinessSummaryBlock from "@/components/dashboard/OverallReadinessSummaryBlock";
import { useAuth } from "@/context/AuthContext";
import { useSessionArchive } from "@/hooks/useSessionArchive";

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

  // Hydrate session archive records
  const { sessions } = useSessionArchive(initialSessions);

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
    <div className="w-full min-h-[calc(100vh-5rem)] bg-[#ECEEF2] dark:bg-[#0B0F15] py-4 sm:py-6 px-3 sm:px-5 lg:px-8 transition-colors duration-300">
      {/* Outer Shell Container with Explicit Z-Index and Spacing */}
      <div className="max-w-[1380px] mx-auto bg-[#F9FAFC] dark:bg-[#151922] border border-slate-200/80 dark:border-[#222B3A] rounded-[28px] p-4 sm:p-6 lg:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.6)] space-y-8 transition-colors duration-300 relative z-10">
        
        {/* ========================================================================= */}
        {/* 1. WELCOME & READINESS SUMMARY (Top Visual Anchor)                        */}
        {/* ========================================================================= */}
        <div className="space-y-4">
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
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#E87A42]" aria-hidden="true" />
                <span>1. Recommended Next Action</span>
              </h2>
              <span className="text-slate-400 text-xs" aria-hidden="true">·</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Primary focus for today</span>
            </div>
            <button
              type="button"
              onClick={handleLaunchInterview}
              className="text-xs font-bold text-[#E87A42] hover:underline flex items-center gap-1 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#E87A42]"
            >
              <span>Custom Setup</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>

          {/* High-Visibility Tailored Practice Recommendation Card */}
          <ProminentRecommendationCard />
        </div>

        {/* ========================================================================= */}
        {/* 3. SKILL PERFORMANCE & READINESS MATRIX                                   */}
        {/* ========================================================================= */}
        <div className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#E87A42]" aria-hidden="true" />
                <span>2. Skill Performance &amp; Evaluation Rubrics</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Multi-dimensional competence breakdown across algorithms, architecture, and STAR storytelling
              </p>
            </div>

            {/* Streamlined Interview Level Selector */}
            <div className="flex items-center gap-2">
              <label htmlFor="interview-level-select" className="text-xs font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">
                Interview Level:
              </label>
              <select
                id="interview-level-select"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="min-h-[44px] px-3 py-2 bg-white dark:bg-[#1C2230] border border-slate-200/80 dark:border-slate-700/80 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-[#E87A42] transition-colors cursor-pointer"
              >
                {levelOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left: Skill Comparison Horizontal Bars / Radar Profile (Col 1-5) */}
            <div className="lg:col-span-5 p-5 bg-white dark:bg-[#181E29] rounded-2xl border border-slate-200/80 dark:border-[#242C3B] shadow-xs flex flex-col justify-between">
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
        <div className="space-y-4 pt-2">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" aria-hidden="true" />
              <span>3. Recent Improvement &amp; Longitudinal Trajectory</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Track progress trends over the last 10 mock sessions and monitor weakness mitigation
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Competency Growth Trajectory Chart (Col 1-7) */}
            <div className="lg:col-span-7 p-5 bg-white dark:bg-[#181E29] rounded-2xl border border-slate-200/80 dark:border-[#242C3B] shadow-xs">
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
        <div className="space-y-4 pt-2">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Mic className="w-4 h-4 text-[#E87A42]" aria-hidden="true" />
              <span>4. Detailed Speaking &amp; Delivery Analytics</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Vocal cadence, speech pacing, filler words, and AI STAR rubric breakdown
            </p>
          </div>

          {/* Delivery Telemetry 4-Metric Grid */}
          <DeliveryTelemetry />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch pt-2">
            {/* AI STAR Rubric Feedback Card (Col 1-6) */}
            <div className="lg:col-span-6">
              <StarRubricFeedbackCard
                onPracticeAction={() => router.push("/interview/new?type=behavioral&focus=action")}
              />
            </div>

            {/* Interview Consensus & Executive Summary (Col 7-12) */}
            <div className="lg:col-span-6 space-y-5 flex flex-col justify-between">
              <InterviewConsensusCard />
              <ExecutiveSummaryCard />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 6. INTERVIEWER PERSONA SELECTION RELOCATION BANNER                        */}
        {/* ========================================================================= */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-[#181F2C] border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E8602E]/10 text-[#E8602E] flex items-center justify-center shrink-0">
              <SlidersHorizontal className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Interviewer Persona &amp; Evaluator Styles
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Configure your interviewer persona (e.g. Alex Vance, Sarah Jenkins, or Marcus Sterling) directly in the Interview Setup Studio.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLaunchInterview}
            className="min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer shrink-0 focus-visible:ring-2 focus-visible:ring-[#E8602E]"
          >
            <span>Configure Persona in Setup</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>

        {/* Past Sessions Drawer Toggle */}
        {sessions.length > 0 && (
          <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setShowHistoryDrawer(!showHistoryDrawer)}
              className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
            >
              <History className="w-4 h-4 text-[#E87A42]" aria-hidden="true" />
              <span>
                {showHistoryDrawer ? "Hide" : "View"} Past Sessions Archive ({sessions.length})
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${
                  showHistoryDrawer ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>

            {showHistoryDrawer && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-3">
                {sessions.slice(0, 6).map((sess) => (
                  <div
                    key={sess.id}
                    className="p-3.5 bg-white dark:bg-[#1C2230] rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs shadow-2xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{sess.role}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">
                        {sess.difficulty} • {sess.status}
                      </div>
                    </div>
                    <Link
                      href={`/interview/${sess.id}`}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-[#FFF6F0] dark:hover:bg-[#2C1E18] hover:text-[#E87A42] font-semibold transition-colors"
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
