"use client";

import React, { useState, useEffect } from "react";
import { useTab, TabType } from "@/context/TabContext";
import DashboardOverview from "@/components/dashboard/views/DashboardOverview";
import MockInterviewsView from "@/components/dashboard/views/MockInterviewsView";
import InsightsTrendsView from "@/components/dashboard/views/InsightsTrendsView";
import GapAnalysisView from "@/components/grounding/GapAnalysisView";
import VoiceCoachPage from "@/app/voice-coach/page";
import DaySimulationsPage from "@/app/day-simulations/page";
import FeedbackHubPage from "@/app/feedback-hub/page";
import { ArrowLeft } from "lucide-react";

export interface AscendXDashboardProps {
  initialSessions?: Array<{
    id: string;
    role: string;
    difficulty: string;
    status: string;
    created_at: string;
  }>;
  initialResume?: any;
  initialJD?: any;
}

export default function AscendXDashboard({
  initialSessions = [],
  initialResume,
  initialJD,
}: AscendXDashboardProps) {
  const { activeTab, setActiveTab } = useTab();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full min-h-[calc(100vh-5rem)] bg-[#ECEEF2] dark:bg-[#0B0F15] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E87A42]" />
      </div>
    );
  }

  // State-driven conditional view rendering
  switch (activeTab) {
    case "mock-interviews":
      return (
        <MockInterviewsView
          initialSessions={initialSessions}
          onSwitchTab={(tab) => setActiveTab(tab as TabType)}
        />
      );

    case "insights":
      return (
        <InsightsTrendsView
          initialSessions={initialSessions}
          onSwitchTab={(tab) => setActiveTab(tab as TabType)}
        />
      );

    case "resume-grounding":
      return (
        <div className="w-full min-h-[calc(100vh-5rem)] bg-[#ECEEF2] dark:bg-[#0B0F15] py-4 sm:py-6 px-3 sm:px-6 lg:px-8 transition-colors duration-300">
          <div className="max-w-[1380px] mx-auto space-y-4">
            <div className="flex items-center justify-between mb-2">
              <button
                type="button"
                onClick={() => setActiveTab("dashboard")}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-[#1C2230]/90 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 hover:bg-white dark:hover:bg-[#252E40] transition-colors shadow-2xs group cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 group-hover:-translate-x-0.5 transition-transform" />
                <span>Back to Dashboard</span>
              </button>
            </div>
            <GapAnalysisView initialResume={initialResume} initialJD={initialJD} />
          </div>
        </div>
      );

    case "voice-coach":
      return <VoiceCoachPage />;

    case "day-simulations":
      return <DaySimulationsPage />;

    case "feedback-hub":
      return <FeedbackHubPage />;

    case "dashboard":
    default:
      return (
        <DashboardOverview
          initialSessions={initialSessions}
          onSwitchTab={(tab) => setActiveTab(tab as TabType)}
        />
      );
  }
}
