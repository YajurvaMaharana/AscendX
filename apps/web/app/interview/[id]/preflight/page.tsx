"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Bot } from "lucide-react";
import PreFlightDiagnostic from "@/components/interview/PreFlightDiagnostic";

function InterviewPreflightContent() {
  const params = useParams();
  const router = useRouter();
  const interviewId = (params?.id as string) || "demo-session";
  const [session, setSession] = useState<{ role?: string; difficulty?: string; type?: string } | null>(null);

  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch(`/api/interviews/${encodeURIComponent(interviewId)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.session) {
            setSession(data.session);
          }
        }
      } catch (err) {
        console.warn("Could not fetch session details for preflight:", err);
      }
    }
    fetchSession();
  }, [interviewId]);

  return (
    <div className="w-full min-h-screen bg-[#ECEEF2] dark:bg-[#0B0F15] py-5 sm:py-8 px-3 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-[#1C2230]/90 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 hover:bg-white dark:hover:bg-[#252E40] transition-colors shadow-2xs group"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 group-hover:-translate-x-0.5 transition-transform" />
            <span>Dashboard</span>
          </Link>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="font-mono text-slate-700 dark:text-slate-300">Session: {interviewId}</span>
          </div>
        </div>

        {/* Pre-Flight Diagnostic Module */}
        <PreFlightDiagnostic
          sessionRole={session?.role || "Full-Stack Software Engineer"}
          interviewType={session?.type || "Technical"}
          onProceed={(results) => {
            // Smoothly navigate to the active interview simulation room
            router.push(`/interview/${encodeURIComponent(interviewId)}?preflight=passed`);
          }}
          onCancel={() => {
            router.push("/dashboard");
          }}
        />
      </div>
    </div>
  );
}

export default function SessionPreflightPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#ECEEF2] dark:bg-[#0B0F15]">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin text-[#E87A42]" />
            <span>Loading pre-flight check...</span>
          </div>
        </div>
      }
    >
      <InterviewPreflightContent />
    </Suspense>
  );
}
