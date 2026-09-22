"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mic, Search, ChevronDown, Info, ArrowDown, History, Sparkles } from "lucide-react";
import PersonaSelector from "@/components/dashboard/PersonaSelector";
import ResumeJDCard from "@/components/dashboard/ResumeJDCard";
import SkillReadinessRadar from "@/components/dashboard/SkillReadinessRadar";
import CompetencyGrowthLineChart from "@/components/dashboard/CompetencyGrowthLineChart";
import DeliveryTelemetry from "@/components/dashboard/DeliveryTelemetry";
import StarRubricFeedbackCard from "@/components/dashboard/StarRubricFeedbackCard";
import ActiveTelemetryStreamCard from "@/components/dashboard/ActiveTelemetryStreamCard";
import ExecutiveSummaryCard from "@/components/dashboard/ExecutiveSummaryCard";
import AnswerRewriteCard from "@/components/dashboard/AnswerRewriteCard";
import NextPracticeModule from "@/components/dashboard/NextPracticeModule";
import WeaknessHeatmapCard from "@/components/dashboard/WeaknessHeatmapCard";
import ReadinessScoreWidget from "@/components/dashboard/ReadinessScoreWidget";
import DailyDrillWidget from "@/components/dashboard/DailyDrillWidget";
import AsyncCoachNotesCard from "@/components/dashboard/AsyncCoachNotesCard";
import { useAuth } from "@/context/AuthContext";
import type { PersonaId } from "@/types/persona";

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
  const [selectedPersona, setSelectedPersona] = useState<PersonaId>("tech-grinder");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGraduation, setSelectedGraduation] = useState("All graduations");
  const [isGraduationOpen, setIsGraduationOpen] = useState(false);
  const [isAdaptiveOn, setIsAdaptiveOn] = useState(true);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);

  const userDisplayName = user?.email ? user.email.split("@")[0] : "Candidate";

  const handleLaunchInterview = () => {
    setIsLaunching(true);
    router.push(`/interview/new?persona=${selectedPersona}`);
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
    <div className="w-full min-h-[calc(100vh-5rem)] bg-[#ECEEF2] dark:bg-[#0B0F15] py-3 sm:py-5 px-2 sm:px-4 lg:px-6 transition-colors duration-300">
      {/* Outer Card Container */}
      <div className="max-w-[1380px] mx-auto bg-[#F9FAFC] dark:bg-[#151922] border border-slate-200/80 dark:border-[#222B3A] rounded-[28px] p-4 sm:p-6 lg:p-7 shadow-[0_12px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.6)] space-y-6 transition-colors duration-300">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Active Dashboard View
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div className="flex items-center gap-2 bg-white/90 dark:bg-[#1C2230]/90 px-3.5 py-1.5 rounded-full border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              Voice Active
            </span>
            <button
              type="button"
              onClick={() => setIsVoiceActive(!isVoiceActive)}
              className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-hidden cursor-pointer ${
                isVoiceActive ? "bg-[#E87A42]" : "bg-slate-300 dark:bg-slate-700"
              }`}
              aria-label="Toggle Voice Active"
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                  isVoiceActive ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* 3-Column Main Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
          {/* ========================================================= */}
          {/* COLUMN 1: LEFT COLUMN (Persona, Resume/JD, Launch) (~33%) */}
          {/* ========================================================= */}
          <div className="lg:col-span-4 xl:col-span-4 flex flex-col space-y-4">
            {/* Welcome Card & Title */}
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-[26px] font-extrabold text-slate-900 dark:text-white tracking-tight">
                Welcome Back, {userDisplayName}
              </h1>

              {/* Interviewer Persona Section */}
              <PersonaSelector
                selectedPersona={selectedPersona}
                onSelectPersona={(id) => setSelectedPersona(id)}
              />

              {/* Resume / JD Grounding Card */}
              <ResumeJDCard />

              {/* Repositioned: Launch Action Section directly below Resume / JD upload */}
              <div className="space-y-2.5 pt-1">
                {/* Glowing Warm Orange Launch Button */}
                <button
                  type="button"
                  onClick={handleLaunchInterview}
                  disabled={isLaunching}
                  className="w-full group relative flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#E8602E] to-[#F17E45] hover:from-[#d85322] hover:to-[#e07038] text-white font-semibold text-sm shadow-[0_6px_22px_rgba(232,96,46,0.35)] dark:shadow-[0_6px_28px_rgba(232,96,46,0.4)] transition-all duration-200 active:scale-[0.99] cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-lg bg-black/20 dark:bg-black/30 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
                    <Mic className="w-3.5 h-3.5" />
                  </div>
                  <span>+ Launch Adaptive AI Interview</span>
                </button>

                {/* Status Toggles & Details Row */}
                <div className="flex items-center justify-between px-1 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                    <ArrowDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    <span>Text & Full Voice</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 dark:text-slate-400">Adaptive Difficulty:</span>
                    <button
                      type="button"
                      onClick={() => setIsAdaptiveOn(!isAdaptiveOn)}
                      className="text-[#E87A42] hover:underline font-bold cursor-pointer"
                    >
                      {isAdaptiveOn ? "ON" : "OFF"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Target Role & Session Readiness Summary */}
            <div className="p-3.5 bg-white dark:bg-[#181E29] rounded-2xl border border-slate-100 dark:border-[#242C3B] shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-900 dark:text-white">
                  Active Target Track
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FFF0E6] dark:bg-[#2F2119] text-[#E87A42] font-semibold">
                  Staff / L5
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center text-[10.5px]">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#131822] border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block text-[9.5px]">Target Readiness</span>
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">88%</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#131822] border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block text-[9.5px]">Practice Streak</span>
                  <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">4 Days</span>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* COLUMN 2: CENTER COLUMN (Live Analytics, Radar, Line Chart) */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 xl:col-span-5 flex flex-col space-y-4">
            {/* Header: Title + Search & Dropdown Filter */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                    Live Analytics
                  </h2>
                  <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer" />
                </div>

                {/* Compact Search Input */}
                <div className="relative w-full sm:w-48">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search metrics..."
                    className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-[#1C2230] border border-slate-200/80 dark:border-slate-700/80 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-hidden focus:border-[#E87A42] transition-colors"
                  />
                </div>
              </div>

              {/* Graduation Selector Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsGraduationOpen(!isGraduationOpen)}
                  className="flex items-center justify-between w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#1C2230] border border-slate-200/80 dark:border-slate-700/80 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#232B3C] transition-colors cursor-pointer"
                >
                  <span>{selectedGraduation}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isGraduationOpen && (
                  <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-[#1C2230] border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-30 py-1 overflow-hidden">
                    {graduationOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setSelectedGraduation(opt);
                          setIsGraduationOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs hover:bg-[#FFF6F0] dark:hover:bg-[#2A2320] transition-colors cursor-pointer ${
                          selectedGraduation === opt
                            ? "text-[#E87A42] font-bold bg-[#FFF6F0]/50 dark:bg-[#2A2320]/50"
                            : "text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Visual Analytics Box: Radar Chart & Growth Line Chart */}
            <div className="p-4 bg-white dark:bg-[#181E29] rounded-2xl border border-slate-100 dark:border-[#242C3B] shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Radar Chart */}
              <div className="flex items-center justify-center pb-2 md:pb-0 md:border-r border-slate-100 dark:border-slate-800 md:pr-3">
                <SkillReadinessRadar
                  communication={88}
                  techDepth={78}
                  deliveryPace={84}
                  starStorytelling={92}
                />
              </div>

              {/* Line Chart */}
              <div className="flex items-center justify-center pt-2 md:pt-0 md:pl-3">
                <CompetencyGrowthLineChart />
              </div>
            </div>

            {/* Multi-Axis Readiness Score Widget */}
            <ReadinessScoreWidget />

            {/* Daily Five-Minute Drill Feature */}
            <DailyDrillWidget />

            {/* Longitudinal Weakness Heatmap & Skill Matrix */}
            <WeaknessHeatmapCard />

            {/* Async Coach Notes Between Sessions */}
            <AsyncCoachNotesCard />
          </div>

          {/* ========================================================= */}
          {/* COLUMN 3: RIGHT COLUMN (Insights & Feedback, Telemetry) */}
          {/* ========================================================= */}
          <div className="lg:col-span-3 xl:col-span-3 flex flex-col space-y-3.5">
            {/* Header Title */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Insights & Feedbacks
              </h2>
            </div>

            {/* Delivery Telemetry (4-Box Grid) */}
            <DeliveryTelemetry />

            {/* AI Coaching Card: STAR Rubric Feedback */}
            <StarRubricFeedbackCard />

            {/* Answer Rewrite Insight Card */}
            <AnswerRewriteCard
              onPracticeAgain={() => router.push(`/interview/new?persona=${selectedPersona}`)}
            />

            {/* Active Telemetry Stream Card */}
            <ActiveTelemetryStreamCard />

            {/* Executive Feedback & Consensus Summary Card */}
            <ExecutiveSummaryCard />

            {/* Personalized Next-Practice Recommendations Engine */}
            <NextPracticeModule />
          </div>
        </div>

        {/* Past Sessions Drawer Toggle if sessions exist */}
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
