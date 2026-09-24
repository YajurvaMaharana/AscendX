"use client";

import React, { useState } from "react";
import {
  BarChart3,
  Compass,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  Info,
} from "lucide-react";

export interface SkillItem {
  id: string;
  name: string;
  score: number;
  previousScore: number;
  benchmark: number; // e.g. 75 or 80 for target role
  isOpportunity?: boolean;
  interpretation: string;
  barColor: string;
  accentColor: string;
}

interface SkillReadinessRadarProps {
  communication?: number; // 0-100
  techDepth?: number;
  starStructure?: number;
  confidence?: number;
  starStorytelling?: number; // alias for starStructure
  deliveryPace?: number; // alias for confidence
  title?: string;
  subtitle?: string;
  defaultView?: "bars" | "radar";
}

export default function SkillReadinessRadar({
  communication = 78,
  techDepth = 72,
  starStructure,
  confidence,
  starStorytelling = 61,
  deliveryPace = 84,
  title = "Skill Performance & Core Competencies",
  subtitle = "Horizontal competency comparison with previous-session deltas & interpretations",
  defaultView = "bars",
}: SkillReadinessRadarProps) {
  const [viewMode, setViewMode] = useState<"bars" | "radar">(defaultView);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  // Resolved scores
  const resolvedStar = starStructure ?? starStorytelling;
  const resolvedConfidence = confidence ?? deliveryPace;

  const skills: SkillItem[] = [
    {
      id: "comm",
      name: "Communication",
      score: communication,
      previousScore: 72,
      benchmark: 75,
      interpretation: "Clear pacing and concise articulation; slight filler word tendency during complex transitions.",
      barColor: "bg-blue-500",
      accentColor: "text-blue-700 dark:text-blue-300",
    },
    {
      id: "tech",
      name: "Technical depth",
      score: techDepth,
      previousScore: 68,
      benchmark: 75,
      interpretation: "Strong system architecture principles; expand on edge-case failure modes and database partitioning.",
      barColor: "bg-purple-500",
      accentColor: "text-purple-700 dark:text-purple-300",
    },
    {
      id: "star",
      name: "STAR structure",
      score: resolvedStar,
      previousScore: 54,
      benchmark: 75,
      isOpportunity: true,
      interpretation: "Biggest opportunity — answers describe actions well but lack quantifiable business & engineering results.",
      barColor: "bg-[#E87A42]",
      accentColor: "text-[#E87A42]",
    },
    {
      id: "confidence",
      name: "Confidence",
      score: resolvedConfidence,
      previousScore: 80,
      benchmark: 80,
      interpretation: "Authoritative vocal tone, steady eye contact, and prompt engagement without hesitation.",
      barColor: "bg-emerald-500",
      accentColor: "text-emerald-700 dark:text-emerald-300",
    },
  ];

  // Radar geometry calculations
  const radarSize = 250;
  const center = radarSize / 2;
  const radius = 85;

  const topX = center;
  const topY = center - (radius * communication) / 100;

  const rightX = center + (radius * resolvedConfidence) / 100;
  const rightY = center;

  const bottomX = center;
  const bottomY = center + (radius * resolvedStar) / 100;

  const leftX = center - (radius * techDepth) / 100;
  const leftY = center;

  const polygonPoints = `${topX},${topY} ${rightX},${rightY} ${bottomX},${bottomY} ${leftX},${leftY}`;

  return (
    <div
      className="w-full flex flex-col justify-between space-y-4"
      role="region"
      aria-label={title}
    >
      {/* Header and Toggle Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
              {title}
            </h3>
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/60 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <TrendingUp className="w-3 h-3" aria-hidden="true" />
              <span>+5.3 avg delta</span>
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
            {subtitle}
          </p>
        </div>

        {/* View Switcher Pill Toggle with Accessible Min Touch Targets */}
        <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-[#131822] border border-slate-200/80 dark:border-slate-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode("bars")}
            aria-pressed={viewMode === "bars"}
            className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 min-h-[44px] rounded-lg text-xs font-bold transition-all cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#E87A42] ${
              viewMode === "bars"
                ? "bg-white dark:bg-[#1C2230] text-slate-900 dark:text-white shadow-2xs"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            }`}
          >
            <BarChart3 className="w-4 h-4 text-[#E87A42]" aria-hidden="true" />
            <span>Horizontal Bars</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("radar")}
            aria-pressed={viewMode === "radar"}
            className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 min-h-[44px] rounded-lg text-xs font-bold transition-all cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#E87A42] ${
              viewMode === "radar"
                ? "bg-white dark:bg-[#1C2230] text-slate-900 dark:text-white shadow-2xs"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            }`}
          >
            <Compass className="w-4 h-4 text-blue-500" aria-hidden="true" />
            <span>Radar Map</span>
          </button>
        </div>
      </div>

      {/* Screen Reader Text Alternative Summary */}
      <div className="sr-only">
        Competency breakdown: Communication score {communication} out of 100; Technical depth score {techDepth} out of 100; STAR structure score {resolvedStar} out of 100 (Top Opportunity); Confidence score {resolvedConfidence} out of 100.
      </div>

      {/* ========================================================================= */}
      {/* 1. HORIZONTAL BARS VIEW (CLEAR, ACTIONABLE & HIGHEST READABILITY)         */}
      {/* ========================================================================= */}
      {viewMode === "bars" && (
        <div className="space-y-3.5 animate-in fade-in duration-150">
          {skills.map((skill) => {
            const delta = skill.score - skill.previousScore;
            const isOpportunity = skill.isOpportunity;

            return (
              <div
                key={skill.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isOpportunity
                    ? "bg-amber-50/50 dark:bg-[#201A15] border-amber-300/80 dark:border-amber-900/60 ring-1 ring-amber-400/20"
                    : "bg-slate-50/70 dark:bg-[#131822]/70 border-slate-200/70 dark:border-slate-800/80 hover:border-slate-300"
                }`}
              >
                {/* Top Row: Skill Name, Numeric Score, and Delta */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {skill.name}
                    </span>
                    {isOpportunity && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-[#FFF0E6] dark:bg-[#341F14] text-[#A24419] dark:text-[#FFAC82] border border-[#E87A42]/40 uppercase tracking-wide">
                        <Sparkles className="w-3 h-3 text-[#E87A42]" aria-hidden="true" />
                        <span>Top Opportunity</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                      {skill.score}
                      <span className="text-xs font-normal text-slate-500 dark:text-slate-400">/100</span>
                    </span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1 border ${
                        delta >= 0
                          ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                          : "bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"
                      }`}
                    >
                      <TrendingUp className="w-3 h-3" aria-hidden="true" />
                      <span>+{delta} vs prev</span>
                    </span>
                  </div>
                </div>

                {/* Horizontal Progress Bar Track */}
                <div className="relative w-full h-2.5 bg-slate-200 dark:bg-slate-700/80 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${skill.barColor}`}
                    style={{ width: `${skill.score}%` }}
                    role="progressbar"
                    aria-valuenow={skill.score}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${skill.name} score ${skill.score} out of 100`}
                  />
                  {/* Benchmark Guide Line at 75 */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-slate-900 dark:bg-white z-10 opacity-70"
                    style={{ left: `${skill.benchmark}%` }}
                    title={`L5 Senior Benchmark (${skill.benchmark})`}
                  />
                </div>

                {/* Interpretation & Specific Actionable Advice */}
                <div className="flex items-start gap-1.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <Info className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
                  <p>{skill.interpretation}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. RADAR MAP VIEW                                                         */}
      {/* ========================================================================= */}
      {viewMode === "radar" && (
        <div className="flex flex-col items-center justify-center p-4 bg-slate-50/60 dark:bg-[#131822]/50 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-3">
          <div className="relative" role="img" aria-label="Radar chart showing skill dimensions">
            <svg width={radarSize} height={radarSize} className="overflow-visible">
              {/* Concentric grid rings */}
              {[0.25, 0.5, 0.75, 1.0].map((ratio, idx) => (
                <polygon
                  key={idx}
                  points={`
                    ${center},${center - radius * ratio}
                    ${center + radius * ratio},${center}
                    ${center},${center + radius * ratio}
                    ${center - radius * ratio},${center}
                  `}
                  fill="none"
                  stroke="currentColor"
                  className="text-slate-200 dark:text-slate-800"
                  strokeWidth="1"
                />
              ))}

              {/* Axis Crosshairs */}
              <line x1={center} y1={center - radius} x2={center} y2={center + radius} stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="1" />
              <line x1={center - radius} y1={center} x2={center + radius} y2={center} stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="1" />

              {/* Data Shape Polygon */}
              <polygon
                points={polygonPoints}
                fill="rgba(232, 122, 66, 0.25)"
                stroke="#E87A42"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />

              {/* Radar Nodes */}
              <circle cx={topX} cy={topY} r="4" fill="#3B82F6" />
              <circle cx={rightX} cy={rightY} r="4" fill="#10B981" />
              <circle cx={bottomX} cy={bottomY} r="4" fill="#E87A42" />
              <circle cx={leftX} cy={leftY} r="4" fill="#A855F7" />
            </svg>

            {/* Labels around radar */}
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-[#181E29] px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-800">
              Comm: {communication}%
            </div>
            <div className="absolute top-1/2 -right-16 -translate-y-1/2 text-xs font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-[#181E29] px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-800">
              Conf: {resolvedConfidence}%
            </div>
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs font-bold text-[#A24419] dark:text-[#FFAC82] bg-[#FFF0E6] dark:bg-[#2C1D15] px-2 py-0.5 rounded-md border border-[#E87A42]/30">
              STAR: {resolvedStar}%
            </div>
            <div className="absolute top-1/2 -left-16 -translate-y-1/2 text-xs font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-[#181E29] px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-800">
              Tech: {techDepth}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
