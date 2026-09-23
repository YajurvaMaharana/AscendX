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
      accentColor: "text-blue-600 dark:text-blue-400",
    },
    {
      id: "tech",
      name: "Technical depth",
      score: techDepth,
      previousScore: 68,
      benchmark: 75,
      interpretation: "Strong system architecture principles; expand on edge-case failure modes and database partitioning.",
      barColor: "bg-purple-500",
      accentColor: "text-purple-600 dark:text-purple-400",
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
      accentColor: "text-emerald-600 dark:text-emerald-400",
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
    <div className="w-full flex flex-col justify-between space-y-4">
      {/* Header and Toggle Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
              {title}
            </h3>
            <span className="text-[10.5px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 px-2 py-0.5 rounded-full">
              +5.3 avg delta
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {subtitle}
          </p>
        </div>

        {/* View Switcher Pill Toggle */}
        <div className="inline-flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-[#131822] border border-slate-200/80 dark:border-slate-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode("bars")}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === "bars"
                ? "bg-white dark:bg-[#1C2230] text-slate-900 dark:text-white shadow-2xs"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-[#E87A42]" />
            <span>Horizontal Bars</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("radar")}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === "radar"
                ? "bg-white dark:bg-[#1C2230] text-slate-900 dark:text-white shadow-2xs"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-blue-500" />
            <span>Radar Map</span>
          </button>
        </div>
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
                    ? "bg-amber-50/40 dark:bg-[#201A15] border-amber-200/70 dark:border-amber-900/40 ring-1 ring-amber-400/20"
                    : "bg-slate-50/60 dark:bg-[#131822]/60 border-slate-100 dark:border-slate-800/80 hover:border-slate-200"
                }`}
              >
                {/* Top Row: Skill Name, Numeric Score, and Delta */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {skill.name}
                    </span>
                    {isOpportunity && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#FFF0E6] dark:bg-[#341F14] text-[#E87A42] border border-[#E87A42]/30 uppercase tracking-wide">
                        <Sparkles className="w-2.5 h-2.5" />
                        Top Opportunity
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                      {skill.score}
                      <span className="text-[10px] font-normal text-slate-400">/100</span>
                    </span>
                    <span
                      className={`text-[10.5px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 ${
                        delta >= 0
                          ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                          : "bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300"
                      }`}
                    >
                      <TrendingUp className="w-3 h-3" />
                      +{delta} vs prev
                    </span>
                  </div>
                </div>

                {/* Horizontal Progress Bar Track */}
                <div className="relative w-full h-2.5 bg-slate-200 dark:bg-slate-700/80 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${skill.barColor}`}
                    style={{ width: `${Math.min(100, Math.max(5, skill.score))}%` }}
                  />
                  {/* Target benchmark indicator line */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-slate-400 dark:bg-slate-300 opacity-60"
                    style={{ left: `${skill.benchmark}%` }}
                    title={`Target Benchmark: ${skill.benchmark}`}
                  />
                </div>

                {/* Contextual Interpretation & Opportunity Diagnosis */}
                <div className="flex items-start gap-1.5 text-[11px] leading-snug">
                  {isOpportunity ? (
                    <AlertCircle className="w-3.5 h-3.5 text-[#E87A42] shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  )}
                  <p
                    className={
                      isOpportunity
                        ? "text-slate-800 dark:text-slate-200 font-medium"
                        : "text-slate-600 dark:text-slate-400"
                    }
                  >
                    {skill.interpretation}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. RADAR VIEW (VISUAL POLYGON COMPARISON)                                 */}
      {/* ========================================================================= */}
      {viewMode === "radar" && (
        <div className="flex flex-col items-center justify-center py-2 animate-in fade-in duration-150 space-y-3">
          <div className="relative flex items-center justify-center w-full">
            <svg
              viewBox={`0 0 ${radarSize} ${radarSize}`}
              className="w-full max-w-[240px] h-auto overflow-visible select-none"
            >
              <defs>
                <radialGradient id="radarBackdropAlt" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#E87A42" stopOpacity="0.2" />
                  <stop offset="60%" stopColor="#E87A42" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="#E87A42" stopOpacity="0.01" />
                </radialGradient>

                <linearGradient id="radarPolygonGradAlt" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#E87A42" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.5" />
                </linearGradient>
              </defs>

              <circle cx={center} cy={center} r={radius + 4} fill="url(#radarBackdropAlt)" />

              {/* Concentric rings */}
              {[0.25, 0.5, 0.75, 1.0].map((level, idx) => (
                <circle
                  key={idx}
                  cx={center}
                  cy={center}
                  r={radius * level}
                  fill="none"
                  stroke="currentColor"
                  className="text-slate-300 dark:text-slate-700/80"
                  strokeWidth="0.8"
                  strokeDasharray={level === 1 ? "none" : "2,2"}
                  opacity="0.8"
                />
              ))}

              {/* Cross Axes Lines */}
              <line
                x1={center}
                y1={center - radius}
                x2={center}
                y2={center + radius}
                stroke="currentColor"
                className="text-slate-400 dark:text-slate-600"
                strokeWidth="1"
                strokeDasharray="2,2"
                opacity="0.6"
              />
              <line
                x1={center - radius}
                y1={center}
                x2={center + radius}
                y2={center}
                stroke="currentColor"
                className="text-slate-400 dark:text-slate-600"
                strokeWidth="1"
                strokeDasharray="2,2"
                opacity="0.6"
              />

              {/* Radar Skill Shape Polygon */}
              <polygon
                points={polygonPoints}
                fill="url(#radarPolygonGradAlt)"
                stroke="#E87A42"
                strokeWidth="2.2"
                strokeLinejoin="round"
                className="transition-all duration-300 drop-shadow-sm"
              />

              {/* Nodes */}
              <circle cx={topX} cy={topY} r="4.5" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="2.5" />
              <circle cx={rightX} cy={rightY} r="4.5" fill="#FFFFFF" stroke="#10B981" strokeWidth="2.5" />
              <circle cx={bottomX} cy={bottomY} r="4.5" fill="#FFFFFF" stroke="#E87A42" strokeWidth="2.5" />
              <circle cx={leftX} cy={leftY} r="4.5" fill="#FFFFFF" stroke="#8B5CF6" strokeWidth="2.5" />

              {/* Axis Labels */}
              <text
                x={center}
                y={center - radius - 8}
                textAnchor="middle"
                className="text-[10px] font-bold fill-slate-800 dark:fill-slate-200"
              >
                Communication ({communication})
              </text>
              <text
                x={center}
                y={center + radius + 14}
                textAnchor="middle"
                className="text-[10px] font-bold fill-[#E87A42]"
              >
                STAR Structure ({resolvedStar})
              </text>
              <text
                x={center - radius - 10}
                y={center - 4}
                textAnchor="end"
                className="text-[10px] font-bold fill-slate-800 dark:fill-slate-200"
              >
                Tech Depth ({techDepth})
              </text>
              <text
                x={center + radius + 10}
                y={center - 4}
                textAnchor="start"
                className="text-[10px] font-bold fill-slate-800 dark:fill-slate-200"
              >
                Confidence ({resolvedConfidence})
              </text>
            </svg>
          </div>

          <div className="w-full p-2.5 rounded-xl bg-amber-50 dark:bg-[#201A15] border border-amber-200/60 dark:border-amber-900/40 text-[11px] text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#E87A42] shrink-0" />
            <span>
              <strong>STAR Structure (61)</strong> is currently your biggest growth opportunity. Switch to <strong>Horizontal Bars</strong> for in-depth feedback.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
