"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Target,
  Award,
  HelpCircle,
  ChevronDown,
  Info,
  CheckCircle2,
  AlertCircle,
  Clock,
  Edit3,
  X,
  Sparkles,
  Calendar,
  Briefcase,
  Check,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export interface OverallReadinessSummaryBlockProps {
  score?: number; // 0 - 100
  monthlyDelta?: number; // +12
  strongestSkill?: { name: string; score: number };
  focusArea?: { name: string; score: number };
  nextMilestone?: { name: string; targetScore: number };
  userDisplayName?: string;
  initialTargetRole?: string;
  initialTimeline?: string;
  totalSessions?: number;
  onStartSession?: () => void;
}

const COMMON_ROLES = [
  "Frontend Developer",
  "Senior Full-Stack Engineer",
  "Backend & Distributed Systems",
  "Mobile Engineer (iOS/Android)",
  "AI & ML Solutions Engineer",
  "DevOps & Cloud Architect",
  "Engineering Manager",
];

const TIMELINE_OPTIONS = [
  { value: "1 week", label: "1 week until interview" },
  { value: "2 weeks", label: "2 weeks until interview" },
  { value: "3 weeks", label: "3 weeks until interview" },
  { value: "1 month", label: "1 month until interview" },
  { value: "2 months", label: "2 months until interview" },
  { value: "Ongoing", label: "Ongoing general preparation" },
];

export default function OverallReadinessSummaryBlock({
  score = 0,
  monthlyDelta = 0,
  strongestSkill,
  focusArea,
  nextMilestone = { name: "First Diagnostic Mock (70/100)", targetScore: 70 },
  userDisplayName = "Candidate",
  initialTargetRole,
  initialTimeline = "3 weeks until interview",
  totalSessions = 0,
  onStartSession,
}: OverallReadinessSummaryBlockProps) {
  const { user, updateUserProfile } = useAuth();

  const [showCalculationInfo, setShowCalculationInfo] = useState(false);
  const [isEditingGoal, setIsEditingGoal] = useState(false);

  // Target role & timeline state
  const profileRole =
    (user as any)?.target_role ||
    (user as any)?.user_metadata?.target_role ||
    initialTargetRole ||
    "Frontend Developer";

  const profileTimeline =
    (user as any)?.interview_timeline ||
    (user as any)?.user_metadata?.interview_timeline ||
    initialTimeline;

  const [targetRole, setTargetRole] = useState<string>(profileRole);
  const [timeline, setTimeline] = useState<string>(profileTimeline);
  const [customRoleInput, setCustomRoleInput] = useState<string>("");
  const [isSavingGoal, setIsSavingGoal] = useState(false);

  useEffect(() => {
    if (profileRole) {
      setTargetRole(profileRole);
    }
    if (profileTimeline) {
      setTimeline(profileTimeline);
    }
  }, [profileRole, profileTimeline]);

  // SVG Circular Gauge calculation
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const handleOpenEditModal = () => {
    setCustomRoleInput(targetRole);
    setIsEditingGoal(true);
  };

  const handleSaveGoal = async () => {
    setIsSavingGoal(true);
    const newRole = customRoleInput.trim() || targetRole;
    setTargetRole(newRole);

    try {
      if (updateUserProfile) {
        await updateUserProfile({
          target_role: newRole,
          interview_goals: [timeline],
        });
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("ascendx_target_role", newRole);
        localStorage.setItem("ascendx_target_timeline", timeline);
      }
    } catch (err) {
      console.warn("Failed to persist user goal:", err);
    } finally {
      setIsSavingGoal(false);
      setIsEditingGoal(false);
    }
  };

  return (
    <div className="w-full relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-[#222B3A] bg-gradient-to-br from-slate-900 via-[#161D2B] to-[#0F141E] text-white p-5 sm:p-6 lg:p-7 shadow-[0_14px_45px_rgba(0,0,0,0.18)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.6)] space-y-5">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#E8602E]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar: Title & Target Role / Timeline Tracking */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#E8602E]/20 text-[#E8602E] flex items-center justify-center border border-[#E8602E]/30 shrink-0">
            <Target className="w-4.5 h-4.5" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <span>Welcome Back, {userDisplayName}</span>
            </h1>

            {/* Target Role & Timeline / Empty State */}
            {targetRole ? (
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-300 font-medium">
                <span className="text-slate-400">Preparing for:</span>
                <strong className="text-white font-bold">{targetRole}</strong>
                <span className="text-slate-500">·</span>
                <span className="inline-flex items-center gap-1 text-[#FB923C] font-semibold">
                  <Clock className="w-3 h-3 text-[#E87A42]" />
                  <span>{timeline}</span>
                </span>
                <span className="text-slate-500">·</span>
                <button
                  type="button"
                  onClick={handleOpenEditModal}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition-colors underline decoration-slate-600 hover:decoration-white cursor-pointer ml-1"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit goal</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                <span className="text-slate-400 italic">
                  Choose a target role to personalize your interview practice.
                </span>
                <button
                  type="button"
                  onClick={handleOpenEditModal}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#E87A42] hover:text-[#f3915f] underline transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>+ Set target role</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Calculation Info Collapsible Button / Tooltip Trigger */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setShowCalculationInfo(!showCalculationInfo)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-expanded={showCalculationInfo}
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#E87A42]" />
            <span>How is readiness calculated?</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                showCalculationInfo ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Calculation Explanation Drawer */}
      {showCalculationInfo && (
        <div className="relative z-10 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-start gap-2 text-slate-200">
            <Info className="w-4 h-4 text-[#E87A42] shrink-0 mt-0.5" />
            <p className="font-semibold leading-relaxed">
              &ldquo;Readiness is based on answer quality, communication, structure, confidence, and consistency across recent sessions.&rdquo;
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 border-t border-white/10 text-[11px]">
            <div className="p-2 rounded-lg bg-black/20">
              <span className="text-slate-400 block text-[9.5px]">Answer Quality (30%)</span>
              <span className="font-bold text-white">Technical Correctness</span>
            </div>
            <div className="p-2 rounded-lg bg-black/20">
              <span className="text-slate-400 block text-[9.5px]">Communication (20%)</span>
              <span className="font-bold text-white">Cadence & Clarity</span>
            </div>
            <div className="p-2 rounded-lg bg-black/20">
              <span className="text-slate-400 block text-[9.5px]">STAR Structure (20%)</span>
              <span className="font-bold text-white">Action & Impact</span>
            </div>
            <div className="p-2 rounded-lg bg-black/20">
              <span className="text-slate-400 block text-[9.5px]">Confidence (15%)</span>
              <span className="font-bold text-white">Low Hesitation</span>
            </div>
            <div className="p-2 rounded-lg bg-black/20">
              <span className="text-slate-400 block text-[9.5px]">Consistency (15%)</span>
              <span className="font-bold text-white">Practice Velocity</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Metric Showcase Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Left / Hero Metric: Circular Gauge + Big Score Typography (Col 1-5) */}
        <div className="lg:col-span-5 flex items-center gap-4 sm:gap-5 p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10">
          {/* Circular SVG Gauge */}
          <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              {/* Background Track */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-slate-800 dark:text-slate-800 stroke-current"
                strokeWidth="9"
                fill="transparent"
              />
              {/* Animated Foreground Progress Bar */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-[#E8602E] stroke-current transition-all duration-1000 ease-out"
                strokeWidth="9"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl sm:text-2xl font-black text-white">{score}</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">/ 100</span>
            </div>
          </div>

          {/* Large Headline Score & Monthly Delta */}
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
              Interview Readiness
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {score}/100
              </span>
            </div>
            {totalSessions === 0 || score === 0 ? (
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>No interviews completed yet</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+{monthlyDelta} points this month</span>
              </div>
            )}
          </div>
        </div>

        {/* Right / Key Diagnostic Indicators: Strongest Skill, Focus Area, Next Milestone (Col 6-12) */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* 1. Strongest Skill */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                Strongest Skill
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-white line-clamp-1">
                {strongestSkill?.name || "Not evaluated yet"}
              </div>
              <div className="text-sm font-black text-emerald-400 mt-0.5">
                {strongestSkill ? (
                  <>
                    {strongestSkill.score}% <span className="text-[10px] text-slate-400 font-normal">Proficiency</span>
                  </>
                ) : (
                  <span className="text-[11px] text-slate-400 font-normal">Pending first session</span>
                )}
              </div>
            </div>
          </div>

          {/* 2. Focus Area */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-[#E8602E]/30 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#E8602E] font-bold uppercase tracking-wider">
                Focus Area
              </span>
              <AlertCircle className="w-3.5 h-3.5 text-[#E87A42]" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-white line-clamp-1">
                {focusArea?.name || "Diagnostic Pending"}
              </div>
              <div className="text-sm font-black text-[#E8602E] mt-0.5">
                {focusArea ? (
                  <>
                    {focusArea.score}% <span className="text-[10px] text-slate-400 font-normal">(Needs Work)</span>
                  </>
                ) : (
                  <span className="text-[11px] text-slate-400 font-normal">Awaiting first session</span>
                )}
              </div>
            </div>
          </div>

          {/* 3. Next Milestone */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                Next Milestone
              </span>
              <Award className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-white line-clamp-1">
                {nextMilestone?.name || "First Mock Interview (70/100)"}
              </div>
              <div className="text-sm font-black text-amber-400 mt-0.5">
                {nextMilestone?.targetScore || 70}/100 <span className="text-[10px] text-slate-400 font-normal">Target</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Zero-State Action Callout Banner if user has 0 sessions */}
      {totalSessions === 0 && (
        <div className="relative z-10 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-[#E8602E]/20 to-transparent border border-[#E8602E]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#E8602E] text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <p className="text-xs text-slate-200">
              <strong className="text-white font-bold">New candidate profile:</strong> No interviews completed yet. Complete your first practice session to establish your baseline score.
            </p>
          </div>
          {onStartSession && (
            <button
              type="button"
              onClick={onStartSession}
              className="px-4 py-2 bg-[#E8602E] hover:bg-[#d85322] text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer self-start sm:self-auto"
            >
              Start First Session &rarr;
            </button>
          )}
        </div>
      )}

      {/* ── Edit Goal Interactive Modal / Drawer ── */}
      {isEditingGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#181F2C] border border-slate-700/80 rounded-3xl p-6 shadow-2xl text-white space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#E8602E]/20 text-[#E8602E] flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Edit Target Role & Goal</h3>
                  <p className="text-xs text-slate-400">Personalize your readiness calibration</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingGoal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300">
                Target Role / Job Title
              </label>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_ROLES.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setCustomRoleInput(role)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      customRoleInput === role
                        ? "bg-[#E8602E] text-white shadow-2xs"
                        : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={customRoleInput}
                onChange={(e) => setCustomRoleInput(e.target.value)}
                placeholder="Or type a custom target role (e.g. Frontend Developer)..."
                className="w-full mt-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-[#E8602E] transition-colors"
              />
            </div>

            {/* Timeline Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300">
                Interview Timeline Countdown
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TIMELINE_OPTIONS.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTimeline(t.label)}
                    className={`p-2.5 rounded-xl text-left text-xs font-semibold border transition-all cursor-pointer ${
                      timeline === t.label
                        ? "bg-[#FFF6F0] dark:bg-[#2F2119] border-[#E8602E] text-[#E8602E]"
                        : "bg-white/5 hover:bg-white/10 border-white/10 text-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{t.label}</span>
                      {timeline === t.label && <Check className="w-3.5 h-3.5 text-[#E8602E]" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-700/60">
              <button
                type="button"
                onClick={() => setIsEditingGoal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveGoal}
                disabled={isSavingGoal || !customRoleInput.trim()}
                className="px-5 py-2 rounded-xl bg-[#E8602E] hover:bg-[#d85322] text-white text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {isSavingGoal ? "Saving..." : "Save Target Goal"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
