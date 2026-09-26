"use client";

import React, { useState, useMemo } from "react";
import { TrendingUp, Calendar, ArrowUpRight, CheckCircle2, Sparkles, Filter } from "lucide-react";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState";

export interface SessionDataPoint {
  id: string;
  sessionIndex: number;
  sessionLabel: string;
  date: string;
  score: number;
  delta: number;
  milestone: string;
  roleTrack: string;
}

const ALL_SESSIONS_DATA: SessionDataPoint[] = [];

export type GenericChartItem =
  | SessionDataPoint
  | { x: number; y: number; label: string; date?: string; score?: number };

type TimeFilter = "7d" | "30d" | "all";

interface CompetencyGrowthLineChartProps {
  data?: GenericChartItem[];
  title?: string;
  subtitle?: string;
  initialFilter?: TimeFilter;
}

export default function CompetencyGrowthLineChart({
  data,
  title = "Progress over time",
  subtitle = "Session-by-session score trajectory & competency growth",
  initialFilter = "30d",
}: CompetencyGrowthLineChartProps) {
  const [filter, setFilter] = useState<TimeFilter>(initialFilter);
  const [hoveredPoint, setHoveredPoint] = useState<SessionDataPoint | null>(null);

  // Normalize incoming data if passed as generic { x, y, label }
  const normalizedData: SessionDataPoint[] = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.map((item, i, arr) => {
      if ("sessionIndex" in item && "date" in item) {
        return item as SessionDataPoint;
      }
      const scoreVal = (item as any).score ?? (item as any).y ?? 0;
      const prevScoreVal = i > 0 ? ((arr[i - 1] as any).score ?? (arr[i - 1] as any).y ?? scoreVal) : scoreVal;
      const lbl = (item as any).label || `Session #${i + 1}`;

      return {
        id: `sess-${i + 1}`,
        sessionIndex: i + 1,
        sessionLabel: lbl.includes(":") ? lbl.split(":")[0] : `S${i + 1}`,
        date: (item as any).date || `Day ${i + 1}`,
        score: scoreVal,
        delta: scoreVal - prevScoreVal,
        milestone: lbl,
        roleTrack: "Domain Competency",
      };
    });
  }, [data]);

  // If no data exists, render clean zero state
  if (normalizedData.length === 0) {
    return (
      <div className="w-full h-full flex flex-col justify-between space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">{title}</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{subtitle}</p>
          </div>
          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
            0 Sessions
          </span>
        </div>
        <div className="py-6">
          <DashboardEmptyState type="no_sessions" />
        </div>
      </div>
    );
  }

  // Filter sessions based on selection
  const filteredData = useMemo(() => {
    if (filter === "7d") {
      // Last 2 sessions
      return normalizedData.slice(-2);
    }
    if (filter === "30d") {
      // Last 5 sessions
      return normalizedData.slice(-5);
    }
    return normalizedData;
  }, [normalizedData, filter]);

  // Derived comparative metrics
  const firstSession = filteredData[0] || { score: 0, date: "", milestone: "", roleTrack: "", sessionIndex: 1, sessionLabel: "S1", id: "s1", delta: 0 };
  const latestSession = filteredData[filteredData.length - 1] || firstSession;
  const prevSession = filteredData.length > 1 ? filteredData[filteredData.length - 2] : firstSession;

  const totalPointsGrowth = latestSession.score - firstSession.score;
  const recentSessionDelta = latestSession.score - prevSession.score;
  const growthPercentage =
    firstSession.score > 0
      ? Math.round(((latestSession.score - firstSession.score) / firstSession.score) * 100)
      : 0;

  // Contextual summary text dynamically generated
  const contextualSummary = useMemo(() => {
    const count = filteredData.length;
    if (count <= 1) {
      return `Latest session recorded at ${latestSession.score}/100 readiness score.`;
    }
    return `Your readiness increased by ${totalPointsGrowth} points (+${growthPercentage}%) across your last ${count} sessions (from ${firstSession.score} to ${latestSession.score}).`;
  }, [filteredData, totalPointsGrowth, growthPercentage, firstSession.score, latestSession.score]);

  // SVG Chart Geometry
  const svgWidth = 560;
  const svgHeight = 220;
  const paddingLeft = 36;
  const paddingRight = 24;
  const paddingTop = 24;
  const paddingBottom = 34;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const minScore = 50; // Visible Y-axis range: 50 to 100
  const maxScore = 100;

  const mapX = (idx: number, total: number) => {
    if (total <= 1) return paddingLeft + chartWidth / 2;
    return paddingLeft + (idx / (total - 1)) * chartWidth;
  };

  const mapY = (score: number) => {
    const clamped = Math.max(minScore, Math.min(maxScore, score));
    return paddingTop + chartHeight - ((clamped - minScore) / (maxScore - minScore)) * chartHeight;
  };

  const points = filteredData.map((d, i) => ({
    xCoord: mapX(i, filteredData.length),
    yCoord: mapY(d.score),
    raw: d,
  }));

  // Generate smooth cubic bezier SVG path
  let pathD = "";
  if (points.length === 1) {
    pathD = `M ${points[0].xCoord - 20} ${points[0].yCoord} L ${points[0].xCoord + 20} ${points[0].yCoord}`;
  } else if (points.length > 1) {
    pathD = `M ${points[0].xCoord} ${points[0].yCoord}`;
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const controlX1 = current.xCoord + (next.xCoord - current.xCoord) * 0.45;
      const controlY1 = current.yCoord;
      const controlX2 = next.xCoord - (next.xCoord - current.xCoord) * 0.45;
      const controlY2 = next.yCoord;
      pathD += ` C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${next.xCoord} ${next.yCoord}`;
    }
  }

  // Area under curve
  let areaD = "";
  if (points.length > 1) {
    const lastPoint = points[points.length - 1];
    const firstPoint = points[0];
    const baselineY = mapY(minScore);
    areaD = `${pathD} L ${lastPoint.xCoord} ${baselineY} L ${firstPoint.xCoord} ${baselineY} Z`;
  }

  const yTicks = [100, 90, 80, 70, 60, 50];

  return (
    <div className="flex flex-col justify-between w-full h-full space-y-3.5">
      {/* 1. Header with Title and Easy-to-use Date Range Filter Options */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
              {title}
            </h3>
            <span className="text-[10.5px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 px-2 py-0.5 rounded-full flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +{totalPointsGrowth} pts growth
            </span>
          </div>
          {subtitle && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {/* Date Range Filter Options */}
        <div className="inline-flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-[#131822] border border-slate-200/80 dark:border-slate-800 self-start sm:self-auto">
          {(
            [
              { id: "7d", label: "Last 7 days" },
              { id: "30d", label: "Last 30 days" },
              { id: "all", label: "All sessions" },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filter === item.id
                  ? "bg-white dark:bg-[#1C2230] text-[#E87A42] shadow-2xs font-extrabold"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {filteredData.length === 0 ? (
        <DashboardEmptyState
          type="no_time_data"
          onResetFilter={() => setFilter("all")}
        />
      ) : (
        <>
          {/* 2. Contextual Summary Header Banner directly above the chart */}
      <div className="p-2.5 sm:p-3 rounded-xl bg-[#FFF0E6] dark:bg-[#261B14] border border-[#E87A42]/20 dark:border-[#E87A42]/30 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#E87A42] shrink-0" />
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            {contextualSummary}
          </p>
        </div>
        <span className="hidden sm:inline-flex text-[11px] font-bold text-[#E87A42] shrink-0">
          Target L5: 75+
        </span>
      </div>

      {/* 3. Core Chart Comparative Metrics Strip */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#131822] border border-slate-100 dark:border-slate-800/80">
          <span className="text-[10px] text-slate-400 block font-medium">Current Score</span>
          <span className="text-sm font-extrabold text-slate-900 dark:text-white">
            {latestSession.score}
            <span className="text-[10px] font-normal text-slate-400">/100</span>
          </span>
        </div>
        <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#131822] border border-slate-100 dark:border-slate-800/80">
          <span className="text-[10px] text-slate-400 block font-medium">Vs. Previous Session</span>
          <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
            +{recentSessionDelta} pts ({prevSession.score} → {latestSession.score})
          </span>
        </div>
        <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#131822] border border-slate-100 dark:border-slate-800/80">
          <span className="text-[10px] text-slate-400 block font-medium">Total Growth Lift</span>
          <span className="text-sm font-extrabold text-[#E87A42]">
            +{totalPointsGrowth} pts (+{growthPercentage}%)
          </span>
        </div>
      </div>

      {/* 4. Core Interactive SVG Line Chart with Date/Session Labels and Range Indicators */}
      <div className="relative w-full py-1">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            {/* Orange gradient area beneath curve */}
            <linearGradient id="competencyAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#EA580C" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#F97316" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#FDBA74" stopOpacity="0.0" />
            </linearGradient>

            {/* Glowing filter for nodes */}
            <filter id="pointGlowOrange" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#EA580C" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* Benchmark Guideline at 75 (Senior Target) */}
          <line
            x1={paddingLeft}
            y1={mapY(75)}
            x2={svgWidth - paddingRight}
            y2={mapY(75)}
            stroke="#10B981"
            strokeWidth="1"
            strokeDasharray="4,4"
            opacity="0.6"
          />
          <text
            x={svgWidth - paddingRight}
            y={mapY(75) - 4}
            textAnchor="end"
            className="text-[9.5px] fill-emerald-600 dark:fill-emerald-400 font-bold"
          >
            Senior Benchmark (75)
          </text>

          {/* Horizontal Grid lines & Y-Axis Range Labels */}
          {yTicks.map((val) => {
            const y = mapY(val);
            return (
              <g key={val}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  stroke="currentColor"
                  className="text-slate-200 dark:text-slate-800"
                  strokeWidth="0.8"
                />
                <text
                  x={paddingLeft - 6}
                  y={y + 3.5}
                  textAnchor="end"
                  className="text-[10px] fill-slate-400 dark:fill-slate-500 font-medium"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Area fill under curve */}
          {areaD && <path d={areaD} fill="url(#competencyAreaGrad)" />}

          {/* Main Orange Trend Curve */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="#E87A42"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Interactive Data Point Dots and X-Axis Date/Session Labels */}
          {points.map((pt, idx) => (
            <g
              key={pt.raw.id}
              className="cursor-pointer group"
              onMouseEnter={() => setHoveredPoint(pt.raw)}
              onMouseLeave={() => setHoveredPoint(null)}
            >
              {/* Invisible large hit area */}
              <circle cx={pt.xCoord} cy={pt.yCoord} r="14" fill="transparent" />

              {/* White node with orange border and glow */}
              <circle
                cx={pt.xCoord}
                cy={pt.yCoord}
                r="5"
                fill="#FFFFFF"
                stroke="#E87A42"
                strokeWidth="2.5"
                filter="url(#pointGlowOrange)"
                className="transition-transform duration-150 group-hover:scale-130"
              />
              <circle cx={pt.xCoord} cy={pt.yCoord} r="2" fill="#E87A42" />

              {/* Numeric score callout pill above each dot */}
              <text
                x={pt.xCoord}
                y={pt.yCoord - 9}
                textAnchor="middle"
                className="text-[10px] font-extrabold fill-slate-800 dark:fill-slate-200"
              >
                {pt.raw.score}
              </text>

              {/* X-Axis Date & Session Label */}
              <text
                x={pt.xCoord}
                y={svgHeight - 14}
                textAnchor="middle"
                className="text-[10px] font-bold fill-slate-700 dark:fill-slate-300"
              >
                {pt.raw.sessionLabel}
              </text>
              <text
                x={pt.xCoord}
                y={svgHeight - 2}
                textAnchor="middle"
                className="text-[9px] fill-slate-400 dark:fill-slate-500 font-medium"
              >
                {pt.raw.date}
              </text>
            </g>
          ))}
        </svg>

        {/* Interactive Hover Tooltip */}
        {hoveredPoint && (
          <div className="absolute top-2 right-4 bg-slate-900/95 dark:bg-slate-800/95 border border-slate-700 text-white text-xs px-3 py-2 rounded-xl shadow-xl animate-fade-in pointer-events-none backdrop-blur-xs space-y-1">
            <div className="flex items-center justify-between gap-3">
              <span className="font-bold text-amber-400">
                {hoveredPoint.sessionLabel} ({hoveredPoint.date})
              </span>
              <span className="font-extrabold text-white text-sm">
                {hoveredPoint.score}/100
              </span>
            </div>
            <div className="text-[10.5px] text-slate-300">
              {hoveredPoint.milestone}
            </div>
            <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 pt-0.5">
              <TrendingUp className="w-3 h-3" />
              <span>+{hoveredPoint.delta} pts vs prior session</span>
            </div>
          </div>
        )}
      </div>
        </>
      )}
    </div>
  );
}
