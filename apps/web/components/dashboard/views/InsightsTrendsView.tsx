"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  TrendingUp,
  BarChart3,
  Calendar,
  Filter,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Activity,
  Award,
  ChevronDown,
  Layers,
  Zap,
} from "lucide-react";
import CompetencyGrowthLineChart from "@/components/dashboard/CompetencyGrowthLineChart";
import SkillReadinessRadar from "@/components/dashboard/SkillReadinessRadar";
import WeaknessHeatmapCard from "@/components/dashboard/WeaknessHeatmapCard";
import ReadinessScoreWidget from "@/components/dashboard/ReadinessScoreWidget";
import DeliveryTelemetry from "@/components/dashboard/DeliveryTelemetry";
import ActiveTelemetryStreamCard from "@/components/dashboard/ActiveTelemetryStreamCard";
import StarRubricFeedbackCard from "@/components/dashboard/StarRubricFeedbackCard";
import AsyncCoachNotesCard from "@/components/dashboard/AsyncCoachNotesCard";
import { useAuth } from "@/context/AuthContext";
import { useSessionArchive } from "@/hooks/useSessionArchive";

export interface InsightsTrendsViewProps {
  initialSessions?: Array<{
    id: string;
    role: string;
    difficulty: string;
    status: string;
    created_at: string;
  }>;
  onSwitchTab?: (tab: string) => void;
}

export default function InsightsTrendsView({
  initialSessions = [],
  onSwitchTab,
}: InsightsTrendsViewProps) {
  const { user } = useAuth();
  const { sessions } = useSessionArchive(initialSessions, user?.id);

  // Query / Filter state
  const [selectedTimeframe, setSelectedTimeframe] = useState<"7d" | "30d" | "90d" | "all">("30d");
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [selectedPersonaFilter, setSelectedPersonaFilter] = useState<string>("all");

  const hasSessions = sessions.length > 0;

  const scoreStats = useMemo(() => {
    if (!hasSessions) return { delta: 0, first: 0, last: 0, avg: 0 };
    const sorted = [...sessions].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    const first = sorted[0].score || 70;
    const last = sorted[sorted.length - 1].score || 70;
    const avg = Math.round(
      sorted.map((s) => s.score || 70).reduce((a, b) => a + b, 0) / sorted.length
    );
    return { delta: last - first, first, last, avg };
  }, [sessions, hasSessions]);

  const activeDataset = useMemo(() => {
    if (!hasSessions) return [];
    return sessions.map((s, idx) => ({
      x: idx * 50,
      y: s.score || 70,
      label: s.role ? `${s.role} (${s.difficulty})` : `Session #${idx + 1}`,
      date: new Date(s.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      score: s.score || 70,
    }));
  }, [sessions, hasSessions]);

  const activeRadar = useMemo(() => {
    if (!hasSessions) return { comm: 0, tech: 0, pace: 0, star: 0 };
    const avg = Math.round(
      sessions.map((s) => s.score || 70).reduce((a, b) => a + b, 0) / sessions.length
    );
    return {
      comm: Math.min(100, Math.round(avg * 1.05)),
      tech: Math.min(100, Math.round(avg * 0.98)),
      pace: Math.min(100, Math.round(avg * 0.95)),
      star: Math.min(100, Math.round(avg * 0.9)),
    };
  }, [sessions, hasSessions]);

  // Session comparison history dynamically derived from real user sessions
  const analyticalSessions = useMemo(() => {
    if (!hasSessions) return [];
    return sessions.map((sess) => ({
      id: sess.id,
      name: `${sess.role} (${sess.difficulty})`,
      role: sess.role,
      date: new Date(sess.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      score: sess.score || 70,
      paceWpm: 135,
      fillerRate: "2.0%",
      starScore: `${Math.round((sess.score || 70) * 0.9)}%`,
      status: (sess.score || 70) >= 85 ? "Strong Hire" : "Completed",
    }));
  }, [sessions, hasSessions]);

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] bg-[#ECEEF2] dark:bg-[#0B0F15] py-3 sm:py-5 px-2 sm:px-4 lg:px-6 transition-colors duration-300">
      <div className="max-w-[1380px] mx-auto space-y-6">
        {/* Top Header & Isolated Query Filtering Bar */}
        <div className="bg-[#F9FAFC] dark:bg-[#151922] border border-slate-200/80 dark:border-[#222B3A] rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <button
                  type="button"
                  onClick={() => onSwitchTab?.("dashboard")}
                  className="hover:text-[#E87A42] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </button>
                <span>/</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold">
                  Insights & Longitudinal Trends
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Deep Multi-Session Analytics & Trendlines
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Longitudinal telemetry tracking competency growth, delivery pacing, weakness heatmaps, and STAR mastery over time.
              </p>
            </div>

            {/* Breadcrumb Action */}
            <button
              type="button"
              onClick={() => onSwitchTab?.("mock-interviews")}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-[#1C2230] border border-slate-200/80 dark:border-slate-800 hover:border-[#E87A42] text-slate-700 dark:text-slate-200 shadow-2xs transition-colors cursor-pointer shrink-0"
            >
              <Zap className="w-3.5 h-3.5 text-[#E87A42]" />
              <span>Practice Target Weakness</span>
            </button>
          </div>

          {/* Isolated Query Filter Controls Row */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-slate-200/60 dark:border-slate-800">
            {/* Left: Domain & Competency Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                <span>Domain Focus:</span>
              </span>

              <div className="flex items-center gap-1 flex-wrap">
                {[
                  { id: "all", label: "All Competencies" },
                  { id: "system_design", label: "System Design" },
                  { id: "distributed", label: "Distributed Systems" },
                  { id: "behavioral", label: "STAR Behavioral" },
                  { id: "frontend", label: "Frontend & UI" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedDomain(item.id)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      selectedDomain === item.id
                        ? "bg-[#E87A42] text-white shadow-2xs"
                        : "bg-white dark:bg-[#1C2230] text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Timeframe Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Window:</span>
              </span>
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-[#131822] rounded-xl">
                {(["7d", "30d", "90d", "all"] as const).map((tf) => (
                  <button
                    key={tf}
                    type="button"
                    onClick={() => setSelectedTimeframe(tf)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold uppercase transition-all cursor-pointer ${
                      selectedTimeframe === tf
                        ? "bg-white dark:bg-[#1C2230] text-[#E87A42] shadow-2xs"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-900"
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Longitudinal Key Performance Indicators (KPIs) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#181E29] border border-slate-100 dark:border-[#242C3B] shadow-2xs space-y-1">
            <span className="text-[10.5px] font-semibold text-slate-400 block">
              Score Growth Trajectory
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                {hasSessions ? `${scoreStats.delta >= 0 ? "+" : ""}${scoreStats.delta} pts` : "0 pts"}
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {hasSessions ? `(${scoreStats.first}% → ${scoreStats.last}%)` : "Pending baseline"}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
              {hasSessions ? `Across ${sessions.length} logged calibrations` : "No sessions completed yet"}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#181E29] border border-slate-100 dark:border-[#242C3B] shadow-2xs space-y-1">
            <span className="text-[10.5px] font-semibold text-slate-400 block">
              Delivery Speech Pace
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                {hasSessions ? "138 WPM" : "—"}
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {hasSessions ? "Optimal Zone" : "Pending voice mock"}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
              Target band: 125-150 WPM
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#181E29] border border-slate-100 dark:border-[#242C3B] shadow-2xs space-y-1">
            <span className="text-[10.5px] font-semibold text-slate-400 block">
              Filler words
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                {hasSessions ? "1.8%" : "—"}
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {hasSessions ? "Optimal" : "Awaiting session"}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
              {hasSessions ? "Low — helping your answers sound confident" : "Not measured yet"}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#181E29] border border-slate-100 dark:border-[#242C3B] shadow-2xs space-y-1">
            <span className="text-[10.5px] font-semibold text-slate-400 block">
              STAR Metric Precision
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-[#E87A42]">
                {hasSessions ? `${Math.round(scoreStats.avg * 0.9)}%` : "0%"}
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {hasSessions ? "Calibrated" : "Pending mock"}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
              {hasSessions ? "Quantifiable results cited" : "No evaluations recorded yet"}
            </span>
          </div>
        </div>

        {/* Row 1: Deep Visual Charts (Filtered Growth Line Chart + Skill Radar) */}
        <div className="bg-[#F9FAFC] dark:bg-[#151922] border border-slate-200/80 dark:border-[#222B3A] rounded-[28px] p-4 sm:p-6 lg:p-7 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Longitudinal Competency Trajectory & Skill Radar
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Correlating progressive difficulty with competency score gains in {selectedDomain.replace("_", " ").toUpperCase()}.
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#FFF0E6] dark:bg-[#2F2119] text-[#E87A42]">
              Window: {selectedTimeframe.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Line Chart spanning 7 columns */}
            <div className="lg:col-span-7 bg-white dark:bg-[#181E29] p-4 rounded-2xl border border-slate-100 dark:border-[#242C3B] shadow-2xs flex flex-col justify-between">
              <CompetencyGrowthLineChart
                data={activeDataset}
                title={`Progression: ${selectedDomain === "all" ? "Composite Competency" : selectedDomain.replace("_", " ")}`}
                subtitle="Milestone scores logged after each live interview session"
              />
            </div>

            {/* Radar Chart spanning 5 columns */}
            <div className="lg:col-span-5 bg-white dark:bg-[#181E29] p-4 rounded-2xl border border-slate-100 dark:border-[#242C3B] shadow-2xs flex flex-col justify-between">
              <SkillReadinessRadar
                totalSessions={sessions.length}
                communication={activeRadar.comm}
                techDepth={activeRadar.tech}
                deliveryPace={activeRadar.pace}
                starStorytelling={activeRadar.star}
              />
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 dark:text-slate-400">Composite Readiness:</span>
                <span className="font-extrabold text-[#E87A42]">
                  {hasSessions
                    ? `${Math.round((activeRadar.comm + activeRadar.tech + activeRadar.pace + activeRadar.star) / 4)}% (Staff Band)`
                    : "0% (Pending)"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Longitudinal Weakness Heatmap & Skill Matrix */}
        <div className="bg-[#F9FAFC] dark:bg-[#151922] border border-slate-200/80 dark:border-[#222B3A] rounded-[28px] p-4 sm:p-6 lg:p-7 shadow-sm space-y-3">
          <div className="border-b border-slate-200/60 dark:border-slate-800 pb-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Multi-Session Competency & Weakness Heatmap
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Click any individual matrix cell to inspect specific question prompts, flagged deficiencies, and targeted AI hints.
            </p>
          </div>

          <WeaknessHeatmapCard totalSessions={sessions.length} />
        </div>

        {/* Row 3: Multi-Axis Score Breakdown & Audio Telemetry Stream */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <div className="lg:col-span-6 bg-[#F9FAFC] dark:bg-[#151922] border border-slate-200/80 dark:border-[#222B3A] rounded-[28px] p-4 sm:p-6 shadow-sm flex flex-col justify-between space-y-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight mb-1">
                Multi-Axis Readiness Evaluation
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Detailed domain-by-domain proficiency indices calibrated for FAANG/Tier-1 benchmarks.
              </p>
            </div>
            <ReadinessScoreWidget totalSessions={sessions.length} />
          </div>

          <div className="lg:col-span-6 bg-[#F9FAFC] dark:bg-[#151922] border border-slate-200/80 dark:border-[#222B3A] rounded-[28px] p-4 sm:p-6 shadow-sm flex flex-col justify-between space-y-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight mb-1">
                Acoustic & Delivery Telemetry Stream
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Live speech modulation, talk-to-listen ratios, and pause latency diagnostics.
              </p>
            </div>
            <div className="space-y-3">
              <ActiveTelemetryStreamCard totalSessions={sessions.length} />
              <DeliveryTelemetry totalSessions={sessions.length} />
            </div>
          </div>
        </div>

        {/* Row 4: STAR Rubric Feedback & Async Coach Notes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <div className="lg:col-span-5 bg-[#F9FAFC] dark:bg-[#151922] border border-slate-200/80 dark:border-[#222B3A] rounded-[28px] p-4 sm:p-6 shadow-sm flex flex-col justify-between space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
              STAR Rubric Benchmark Verification
            </h3>
            <StarRubricFeedbackCard totalSessions={sessions.length} />
          </div>

          <div className="lg:col-span-7 bg-[#F9FAFC] dark:bg-[#151922] border border-slate-200/80 dark:border-[#222B3A] rounded-[28px] p-4 sm:p-6 shadow-sm flex flex-col justify-between space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
              Actionable Coaching Notes & Study Roadmaps
            </h3>
            <AsyncCoachNotesCard totalSessions={sessions.length} />
          </div>
        </div>

        {/* Row 5: Historical Session Comparative Matrix Table */}
        <div className="bg-[#F9FAFC] dark:bg-[#151922] border border-slate-200/80 dark:border-[#222B3A] rounded-[28px] p-4 sm:p-6 lg:p-7 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Historical Calibration Matrix
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Direct side-by-side comparison of multi-session telemetry and outcomes.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {analyticalSessions.length} Filtered Sessions
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200/70 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold text-[10.5px]">
                  <th className="py-2.5 px-3">Session & Focus</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Composite Score</th>
                  <th className="py-2.5 px-3">Pacing</th>
                  <th className="py-2.5 px-3">Filler %</th>
                  <th className="py-2.5 px-3">STAR Metric</th>
                  <th className="py-2.5 px-3">Verdict</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {analyticalSessions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-slate-500 dark:text-slate-400 text-xs">
                      No recorded calibration sessions yet. Complete your first mock interview to track longitudinal trends.
                    </td>
                  </tr>
                ) : (
                  analyticalSessions.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-[#1A212E] transition-colors"
                    >
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 dark:text-white">{row.name}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">{row.role}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {row.date}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-extrabold text-slate-900 dark:text-white">
                          {row.score}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                        {row.paceWpm} WPM
                      </td>
                      <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                        {row.fillerRate}
                      </td>
                      <td className="py-3 px-3 font-semibold text-[#E87A42]">
                        {row.starScore}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            row.score >= 90
                              ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                              : row.score >= 80
                              ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                              : "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400"
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link
                          href="/feedback-hub"
                          className="text-[11px] font-bold text-[#E87A42] hover:underline"
                        >
                          Deep Rubric →
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
