"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Sparkles, Loader2, ShieldCheck } from "lucide-react";
import PreFlightDiagnostic from "@/components/interview/PreFlightDiagnostic";

function PreFlightPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/interview/new";
  const role = searchParams.get("role") || "Senior Software Engineer";
  const type = searchParams.get("type") || "Technical & System Architecture";

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] bg-[#ECEEF2] dark:bg-[#0B0F15] py-5 sm:py-8 px-3 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href={returnTo}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-[#1C2230]/90 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 hover:bg-white dark:hover:bg-[#252E40] transition-colors shadow-2xs group"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 group-hover:-translate-x-0.5 transition-transform" />
            <span>Return to Setup</span>
          </Link>

          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>AscendX</span>
            <span>/</span>
            <span className="text-slate-800 dark:text-slate-200 font-semibold">Pre-Flight Diagnostic</span>
          </div>
        </div>

        {/* Pre-Flight Diagnostic Module */}
        <PreFlightDiagnostic
          sessionRole={role}
          interviewType={type}
          onProceed={(results) => {
            if (returnTo.includes("/interview/")) {
              router.push(`${returnTo}?preflight=passed`);
            } else {
              router.push("/interview/new?preflight=passed");
            }
          }}
          onCancel={() => {
            router.push(returnTo);
          }}
        />
      </div>
    </div>
  );
}

export default function StandalonePreFlightPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#ECEEF2] dark:bg-[#0B0F15]">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin text-[#E87A42]" />
            <span>Loading pre-flight diagnostic module...</span>
          </div>
        </div>
      }
    >
      <PreFlightPageContent />
    </Suspense>
  );
}
