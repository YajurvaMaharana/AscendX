"use client";

import React from "react";
import AscendXDashboard from "@/components/dashboard/AscendXDashboard";

interface TabSwitchContainerProps {
  initialSessions: Array<{
    id: string;
    role: string;
    difficulty: string;
    status: string;
    created_at: string;
  }>;
  initialResume: any;
  initialJD: any;
}

export default function TabSwitchContainer({
  initialSessions,
  initialResume,
  initialJD,
}: TabSwitchContainerProps) {
  return (
    <AscendXDashboard
      initialSessions={initialSessions}
      initialResume={initialResume}
      initialJD={initialJD}
    />
  );
}
