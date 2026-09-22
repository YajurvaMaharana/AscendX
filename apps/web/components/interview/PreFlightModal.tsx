"use client";

import React, { useEffect } from "react";
import PreFlightDiagnostic, {
  type PreFlightCheckResults,
} from "@/components/interview/PreFlightDiagnostic";
import { X, ShieldCheck } from "lucide-react";

interface PreFlightModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: (results: PreFlightCheckResults) => void;
  sessionRole?: string;
  interviewType?: string;
  defaultAudioOnly?: boolean;
}

export default function PreFlightModal({
  isOpen,
  onClose,
  onProceed,
  sessionRole = "Software Engineering",
  interviewType = "Technical & Behavioral",
  defaultAudioOnly = false,
}: PreFlightModalProps) {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl my-auto animate-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close pre-flight diagnostic"
          className="absolute -top-3 -right-3 sm:top-4 sm:right-4 z-10 w-8 h-8 rounded-full bg-white dark:bg-[#1C2230] text-slate-500 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-md transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <PreFlightDiagnostic
          isModal
          sessionRole={sessionRole}
          interviewType={interviewType}
          defaultAudioOnly={defaultAudioOnly}
          onProceed={(results) => {
            onProceed(results);
          }}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}
