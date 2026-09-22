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

// Domain-specific dataset points for isolated filtering
const DOMAIN_DATASETS: Record<string, { x: number; y: number; label: string }[]> = {
  all: [
    { x: 0, y: 35, label: "Baseline Diagnostic" },
    { x: 50, y: 54, label: "50m - Core Algorithms" },
    { x: 100, y: 62, label: "100m - Hard Concurrency" },
    { x: 150, y: 78, label: "150m - System Design" },
    { x: 200, y: 84, label: "200m - Behavioral STAR" },
    { x: 250, y: 92, label: "250m - Master Lead Mock" },
  ],
  system_design: [
    { x: 0, y: 40, label: "Session #1: Monolith vs Microservices" },
    { x: 50, y: 58, label: "Session #2: Database Caching" },
    { x: 100, y: 70, label: "Session #3: Partitioning & Sharding" },
    { x: 150, y: 82, label: "Session #4: Consensus Protocols" },
    { x: 200, y: 88, label: "Session #5: Rate Limiting & SLAs" },
    { x: 250, y: 94, label: "Latest: Global Multi-Region Mesh" },
  ],
  distributed: [
    { x: 0, y: 30, label: "Session #1: CAP Baseline" },
    { x: 60, y: 48, label: "Session #2: 2PC & Saga Pattern" },
    { x: 120, y: 65, label: "Session #3: Raft Consensus" },
    { x: 180, y: 79, label: "Session #4: Vector Clocks & CRDTs" },
    { x: 240, y: 91, label: "Latest: High-Throughput Kafka Streams" },
  ],
  behavioral: [
    { x: 0, y: 45, label: "Session #1: Basic Situation Intro" },
    { x: 60, y: 62, label: "Session #2: Task Ownership" },
    { x: 120, y: 74, label: "Session #3: Action Trade-offs" },
    { x: 180, y: 86, label: "Session #4: Metric Quantification" },
    { x: 240, y: 95, label: "Latest: Executive Conflict Resolution" },
  ],
  frontend: [
    { x: 0, y: 50, label: "Session #1: React Lifecycle" },
    { x: 60, y: 68, label: "Session #2: Core Web Vitals" },
    { x: 120, y: 79, label: "Session #3: Concurrent Rendering" },
    { x: 180, y: 87, label: "Session #4: State Machine Architectures" },
    { x: 240, y: 93, label: "Latest: Microfrontends & Hydration" },
  ],
};

const DOMAIN_RADAR_PROPS: Record<string, { comm: number; tech: number; pace: number; star: number }> = {
  all: { comm: 88, tech: 84, pace: 86, star: 91 },
  system_design: { comm: 85, tech: 94, pace: 82, star: 84 },
  distributed: { comm: 80, tech: 96, pace: 80, star: 82 },
  behavioral: { comm: 95, tech: 78, pace: 90, star: 96 },
  frontend: { comm: 90, tech: 88, pace: 88, star: 86 },
};

export default function InsightsTrendsView({
  initialSessions = [],
  onSwitchTab,
}: InsightsTrendsViewProps) {
  // Query / Filter state
  const [selectedTimeframe, setSelectedTimeframe] = useState<"7d" | "30d" | "90d" | "all">("30d");
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [selectedPersonaFilter, setSelectedPersonaFilter] = useState<string>("all");

  const activeDataset = useMemo(() => {
    return DOMAIN_DATASETS[selectedDomain] || DOMAIN_DATASETS.all;
  }, [selectedDomain]);

  const activeRadar = useMemo(() => {
    return DOMAIN_RADAR_PROPS[selectedDomain] || DOMAIN_RADAR_PROPS.all;
  }, [selectedDomain]);

  // Session comparison history mock enriched with analytical data
  const analyticalSessions = useMemo(() => {
    const base = [
      {
        id: "sess-05",
        name: "Session #5: Distributed Systems & Raft Consensus",
        role: "Backend & Systems",
        date: "Sep 21, 2026",
        score: 92,
        paceWpm: 138,
        fillerRate: "1.6%",
        starScore: "94%",
        status: "Exceeds Expectations",
      },
      {
        id: "sess-04",
        name: "Session #4: High-Throughput Event Ingestion",
        role: "System Architecture",
        date: "Sep 18, 2026",
        score: 87,
        paceWpm: 134,
        fillerRate: "2.1%",
        starScore: "88%",
        status: "Strong Hire",
      },
      {
        id: "sess-03",
        name: "Session #3: Leadership & Cross-Team Conflict",
        role: "Behavioral (STAR)",
        date: "Sep 14, 2026",
        score: 85,
        paceWpm: 142,
        fillerRate: "2.8%",
        starScore: "91%",
        status: "Solid Pass",
      },
      {
        id: "sess-02",
        name: "Session #2: Concurrency & Lock-Free Caches",
        role: "Full-Stack Core",
        date: "Sep 09, 2026",
        score: 78,
        paceWpm: 126,
        fillerRate: "4.0%",
        starScore: "76%",
        status: "Needs Practice",
      },
      {
        id: "sess-01",
        name: "Session #1: Diagnostic Baseline Assessment",
        role: "Full-Stack Core",
        date: "Sep 02, 2026",
        score: 68,
        paceWpm: 118,
        fillerRate: "5.8%",
        starScore: "62%",
        status: "Baseline",
      },
    ];
    return base;
  }, []);

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
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">+24 pts</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                (68% → 92%)
              </span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
              Across 5 logged calibrations
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#181E29] border border-slate-100 dark:border-[#242C3B] shadow-2xs space-y-1">
            <span className="text-[10.5px] font-semibold text-slate-400 block">
              Delivery Speech Pace
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">138 WPM</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                Optimal Zone
              </span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
              Target band: 125-150 WPM
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#181E29] border border-slate-100 dark:border-[#242C3B] shadow-2xs space-y-1">
            <span className="text-[10.5px] font-semibold text-slate-400 block">
              Filler Word Ratio
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">1.8%</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                -4.0% drop
              </span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
              Baseline was 5.8%
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#181E29] border border-slate-100 dark:border-[#242C3B] shadow-2xs space-y-1">
            <span className="text-[10.5px] font-semibold text-slate-400 block">
              STAR Metric Precision
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-[#E87A42]">92%</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                Calibrated
              </span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
              100% quantifiable results cited
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
                communication={activeRadar.comm}
                techDepth={activeRadar.tech}
                deliveryPace={activeRadar.pace}
                starStorytelling={activeRadar.star}
              />
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 dark:text-slate-400">Composite Readiness:</span>
                <span className="font-extrabold text-[#E87A42]">
                  {Math.round((activeRadar.comm + activeRadar.tech + activeRadar.pace + activeRadar.star) / 4)}% (Staff Band)
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

          <WeaknessHeatmapCard />
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
            <ReadinessScoreWidget />
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
              <ActiveTelemetryStreamCard />
              <DeliveryTelemetry />
            </div>
          </div>
        </div>

        {/* Row 4: STAR Rubric Feedback & Async Coach Notes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <div className="lg:col-span-5 bg-[#F9FAFC] dark:bg-[#151922] border border-slate-200/80 dark:border-[#222B3A] rounded-[28px] p-4 sm:p-6 shadow-sm flex flex-col justify-between space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
              STAR Rubric Benchmark Verification
            </h3>
            <StarRubricFeedbackCard />
          </div>

          <div className="lg:col-span-7 bg-[#F9FAFC] dark:bg-[#151922] border border-slate-200/80 dark:border-[#222B3A] rounded-[28px] p-4 sm:p-6 shadow-sm flex flex-col justify-between space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
              Actionable Coaching Notes & Study Roadmaps
            </h3>
            <AsyncCoachNotesCard />
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
              5 Filtered Sessions
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
                {analyticalSessions.map((row) => (
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
