"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  Mic,
  ArrowLeft,
  Search,
  Filter,
  Sparkles,
  ChevronRight,
  Clock,
  Award,
  Play,
  CheckCircle2,
  AlertCircle,
  Sliders,
  FileText,
  Radio,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { PERSONAS } from "@/types/persona";
import type { PersonaId } from "@/types/persona";
import PreFlightModal from "@/components/interview/PreFlightModal";

export interface MockInterviewsViewProps {
  initialSessions?: Array<{
    id: string;
    role: string;
    difficulty: string;
    status: string;
    created_at: string;
  }>;
  onSwitchTab?: (tab: string) => void;
}

interface RolePreset {
  id: string;
  title: string;
  category: string;
  difficulty: "mid" | "senior" | "staff";
  description: string;
  topics: string[];
  recommendedPersona: PersonaId;
}

const ROLE_PRESETS: RolePreset[] = [
  {
    id: "senior-fullstack",
    title: "Senior Full-Stack Engineer",
    category: "Full-Stack",
    difficulty: "senior",
    description: "End-to-end architectures, React concurrency, Node.js microservices, and database tuning.",
    topics: ["React / Next.js", "PostgreSQL", "Caching Strategies", "GraphQL / REST API Design"],
    recommendedPersona: "tech-grinder",
  },
  {
    id: "backend-distributed",
    title: "Backend & Distributed Systems",
    category: "Backend",
    difficulty: "staff",
    description: "High-throughput messaging, partition tolerance, consensus protocols, and storage engines.",
    topics: ["Raft / Paxos", "Kafka / Event Streams", "Database Sharding", "Fault Recovery"],
    recommendedPersona: "skeptical-interrogator",
  },
  {
    id: "frontend-arch",
    title: "Frontend & UI Architecture",
    category: "Frontend",
    difficulty: "senior",
    description: "Core Web Vitals, state orchestration, design system primitives, and rendering pipelines.",
    topics: ["Client Performance", "SSR / Hydration", "State Machine Logic", "Accessibility (a11y)"],
    recommendedPersona: "supportive-mentor",
  },
  {
    id: "system-design-scale",
    title: "System Design & Scalability",
    category: "Architecture",
    difficulty: "staff",
    description: "Global scale constraints, CDN topologies, write amplification, and SLA guarantees.",
    topics: ["Rate Limiting", "Global Load Balancing", "Cache Invalidation", "Disaster Recovery"],
    recommendedPersona: "simulation-boss",
  },
  {
    id: "star-behavioral",
    title: "Leadership & STAR Behavioral",
    category: "Behavioral",
    difficulty: "senior",
    description: "Executive communication, conflict resolution, technical mentorship, and business impact.",
    topics: ["STAR Framework", "Cross-Team Alignment", "Failure Retrospectives", "Delivery Pressure"],
    recommendedPersona: "hr-partner",
  },
  {
    id: "devops-infra",
    title: "DevOps & Cloud Reliability",
    category: "Infra",
    difficulty: "senior",
    description: "Container orchestration, CI/CD telemetry, zero-downtime rollouts, and multi-cloud resilience.",
    topics: ["Kubernetes", "Terraform / IaC", "Observability & Tracing", "Incident Response"],
    recommendedPersona: "tech-grinder",
  },
];

export default function MockInterviewsView({
  initialSessions = [],
  onSwitchTab,
}: MockInterviewsViewProps) {
  const router = useRouter();

  // Launcher state
  const [selectedRolePreset, setSelectedRolePreset] = useState<string>("senior-fullstack");
  const [selectedPersona, setSelectedPersona] = useState<PersonaId>("tech-grinder");
  const [difficultyLevel, setDifficultyLevel] = useState<"medium" | "hard" | "expert">("hard");
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isAdaptiveEnabled, setIsAdaptiveEnabled] = useState(true);
  const [isLaunching, setIsLaunching] = useState(false);
  const [showPreFlightModal, setShowPreFlightModal] = useState(false);

  // History filters
  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "in_progress">("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");

  const currentPreset = ROLE_PRESETS.find((r) => r.id === selectedRolePreset) || ROLE_PRESETS[0];

  const handleLaunch = () => {
    setIsLaunching(true);
    const params = new URLSearchParams();
    params.set("role", currentPreset.title);
    params.set("persona", selectedPersona);
    params.set("difficulty", difficultyLevel);
    params.set("voice", isVoiceEnabled ? "true" : "false");
    params.set("adaptive", isAdaptiveEnabled ? "true" : "false");
    router.push(`/interview/new?${params.toString()}`);
  };

  // Filtered session records
  const filteredSessions = useMemo(() => {
    return initialSessions.filter((sess) => {
      const matchesSearch =
        !searchFilter ||
        sess.role.toLowerCase().includes(searchFilter.toLowerCase()) ||
        sess.difficulty.toLowerCase().includes(searchFilter.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "completed" && sess.status === "completed") ||
        (statusFilter === "in_progress" && sess.status !== "completed");
      const matchesDiff =
        difficultyFilter === "all" ||
        sess.difficulty.toLowerCase() === difficultyFilter.toLowerCase();
      return matchesSearch && matchesStatus && matchesDiff;
    });
  }, [initialSessions, searchFilter, statusFilter, difficultyFilter]);

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] bg-[#ECEEF2] dark:bg-[#0B0F15] py-3 sm:py-5 px-2 sm:px-4 lg:px-6 transition-colors duration-300">
      <div className="max-w-[1380px] mx-auto space-y-6">
        {/* Top Header & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F9FAFC] dark:bg-[#151922] border border-slate-200/80 dark:border-[#222B3A] rounded-2xl p-4 sm:p-5 shadow-sm">
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
                Mock Interviews Studio
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Adaptive Mock Interview Studio
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Calibrated technical, system architecture, and behavioral simulations matching premier engineering standards.
            </p>
          </div>

          {/* KPI Snapshot Pills */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 flex-wrap">
            <div className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#1C2230] border border-slate-200/80 dark:border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block font-medium">Completed Mocks</span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                {initialSessions.length > 0 ? initialSessions.length : 12}
              </span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#1C2230] border border-slate-200/80 dark:border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block font-medium">Avg Score</span>
              <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                87.4%
              </span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#1C2230] border border-slate-200/80 dark:border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block font-medium">Target Track</span>
              <span className="text-sm font-extrabold text-[#E87A42]">Staff / L5</span>
            </div>
          </div>
        </div>

        {/* Section 1: Interactive Launch Studio Grid */}
        <div className="bg-[#F9FAFC] dark:bg-[#151922] border border-slate-200/80 dark:border-[#222B3A] rounded-[28px] p-4 sm:p-6 lg:p-7 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#FFF0E6] dark:bg-[#2F2119] text-[#E87A42] flex items-center justify-center font-bold">
                <Play className="w-4 h-4 fill-current" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  Launch New Mock Session
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Select your target role track, calibration interviewer, and session mode.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowPreFlightModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-[#1C2230] border border-slate-200/80 dark:border-slate-800 hover:border-[#E87A42] text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                title="Verify microphone, camera, and network bandwidth"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#E87A42]" />
                <span>Pre-Flight Check</span>
              </button>

              <button
                type="button"
                onClick={() => onSwitchTab?.("resume-grounding")}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-[#1C2230] border border-slate-200/80 dark:border-slate-800 hover:border-[#E87A42] text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-[#E87A42]" />
                <span>Ground with My Resume / JD</span>
              </button>
            </div>
          </div>

          {/* Role Preset Track Cards */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <span>1. Target Engineering Track</span>
              <span className="text-[10px] text-[#E87A42] font-semibold font-mono">
                ({ROLE_PRESETS.length} Calibrated Paths)
              </span>
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {ROLE_PRESETS.map((preset) => {
                const isSelected = selectedRolePreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setSelectedRolePreset(preset.id);
                      setSelectedPersona(preset.recommendedPersona);
                    }}
                    className={`text-left p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer relative ${
                      isSelected
                        ? "bg-white dark:bg-[#1C2230] border-[#E87A42] shadow-[0_4px_18px_rgba(232,122,66,0.15)] ring-1 ring-[#E87A42]"
                        : "bg-white/60 dark:bg-[#161B24] border-slate-200/70 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {preset.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-md ${
                          preset.difficulty === "staff"
                            ? "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400"
                            : "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {preset.difficulty.toUpperCase()}
                      </span>
                    </div>

                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-1 mb-1">
                      {preset.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-2.5">
                      {preset.description}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {preset.topics.slice(0, 3).map((topic) => (
                        <span
                          key={topic}
                          className="text-[9.5px] px-1.5 py-0.5 rounded bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Persona Selection + Session Modality in 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-1">
            {/* Left: Interviewer Persona */}
            <div className="lg:col-span-7 space-y-2.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                2. AI Interviewer Persona Calibration
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {Object.values(PERSONAS).map((persona) => {
                  const isSelected = selectedPersona === persona.id;
                  return (
                    <button
                      key={persona.id}
                      type="button"
                      onClick={() => setSelectedPersona(persona.id)}
                      className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#FFF6F0] dark:bg-[#251D18] border-[#E87A42] ring-1 ring-[#E87A42]"
                          : "bg-white dark:bg-[#1C2230] border-slate-200/80 dark:border-slate-800 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{persona.avatar}</span>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {persona.name}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                            {persona.title}
                          </div>
                        </div>
                      </div>
                      <p className="text-[10.5px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-tight">
                        {persona.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Modality & Controls */}
            <div className="lg:col-span-5 space-y-3 bg-white dark:bg-[#181E29] p-4 rounded-2xl border border-slate-100 dark:border-[#242C3B] shadow-2xs">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                3. Modality & Difficulty
              </label>

              {/* Difficulty Segmented Control */}
              <div className="space-y-1.5">
                <span className="text-[10.5px] font-semibold text-slate-500 dark:text-slate-400">
                  Target Calibration
                </span>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-[#131822] rounded-xl">
                  {(["medium", "hard", "expert"] as const).map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setDifficultyLevel(diff)}
                      className={`py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                        difficultyLevel === diff
                          ? "bg-white dark:bg-[#1C2230] text-[#E87A42] shadow-2xs"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                      }`}
                    >
                      {diff === "medium" ? "Mid (L4)" : diff === "hard" ? "Senior (L5)" : "Staff (L6)"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Voice & Adaptive Toggles */}
              <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5 text-[#E87A42]" />
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Full Audio Voice Stream
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                    className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                      isVoiceEnabled ? "bg-[#E87A42]" : "bg-slate-300 dark:bg-slate-700"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        isVoiceEnabled ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Adaptive Difficulty Probing
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAdaptiveEnabled(!isAdaptiveEnabled)}
                    className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                      isAdaptiveEnabled ? "bg-[#E87A42]" : "bg-slate-300 dark:bg-slate-700"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        isAdaptiveEnabled ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Glowing Launch Button */}
              <button
                type="button"
                onClick={handleLaunch}
                disabled={isLaunching}
                className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#E8602E] to-[#F17E45] hover:from-[#d85322] hover:to-[#e07038] text-white font-semibold text-sm shadow-[0_6px_22px_rgba(232,96,46,0.35)] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Launch Mock Interview ({currentPreset.title})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: Mock Interview Past Sessions History & Filtering */}
        <div className="bg-[#F9FAFC] dark:bg-[#151922] border border-slate-200/80 dark:border-[#222B3A] rounded-[28px] p-4 sm:p-6 lg:p-7 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/60 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Mock Interview Records & Performance
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Review detailed transcripts, rubrics, and playback from past simulation sessions.
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter sessions..."
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-white dark:bg-[#1C2230] border border-slate-200/80 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-hidden focus:border-[#E87A42]"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#1C2230] border border-slate-200/80 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 font-medium focus:outline-hidden"
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="in_progress">In Progress</option>
              </select>

              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#1C2230] border border-slate-200/80 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 font-medium focus:outline-hidden"
              >
                <option value="all">All Levels</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="expert">Staff / Expert</option>
              </select>
            </div>
          </div>

          {/* Sessions List / Table */}
          {filteredSessions.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-[#181E29] rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 space-y-2">
              <Sparkles className="w-6 h-6 text-[#E87A42] mx-auto opacity-75" />
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                No mock interviews match your filter
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Ready to calibrate your performance? Select a role track above and launch your first adaptive session.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredSessions.map((sess) => (
                <div
                  key={sess.id}
                  className="p-4 rounded-2xl bg-white dark:bg-[#181E29] border border-slate-100 dark:border-[#242C3B] shadow-2xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold font-mono uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {sess.difficulty}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1.5">
                        {sess.role}
                      </h4>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        sess.status === "completed"
                          ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/40 dark:border-emerald-800/40"
                          : "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/40 dark:border-amber-800/40"
                      }`}
                    >
                      {sess.status === "completed" ? "Completed" : "Active"}
                    </span>
                  </div>

                  <div className="text-[10.5px] text-slate-500 dark:text-slate-400 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{new Date(sess.created_at).toLocaleDateString()}</span>
                    </span>
                    <span>•</span>
                    <span>Interactive AI Calibration</span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <Link
                      href={`/interview/${sess.id}`}
                      className="text-xs font-bold text-[#E87A42] hover:underline flex items-center gap-1"
                    >
                      <span>Resume / Review</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href={`/interview/${sess.id}/feedback`}
                      className="text-[10.5px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    >
                      Rubric Breakdown
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Pre-Flight Diagnostic Modal ── */}
      <PreFlightModal
        isOpen={showPreFlightModal}
        sessionRole={currentPreset?.title || "Senior Full-Stack"}
        interviewType="Technical"
        defaultAudioOnly={!isVoiceEnabled}
        onProceed={(results) => {
          setShowPreFlightModal(false);
          handleLaunch();
        }}
        onClose={() => setShowPreFlightModal(false)}
      />
    </div>
  );
}
