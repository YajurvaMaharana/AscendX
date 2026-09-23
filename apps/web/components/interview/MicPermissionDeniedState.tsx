"use client";

import React, { useState } from "react";
import {
  MicOff,
  RefreshCw,
  HelpCircle,
  Lock,
  Settings,
  MessageSquare,
  AlertCircle,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";

export interface MicPermissionDeniedStateProps {
  onRetry: () => void;
  onContinueTextOnly?: () => void;
}

export default function MicPermissionDeniedState({
  onRetry,
  onContinueTextOnly,
}: MicPermissionDeniedStateProps) {
  const [selectedBrowser, setSelectedBrowser] = useState<"chrome" | "safari" | "firefox">("chrome");

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-label="Microphone permission required"
      className="w-full max-w-xl mx-auto p-6 sm:p-8 bg-white dark:bg-[#181E29] rounded-2xl border border-amber-300 dark:border-amber-800/80 shadow-lg space-y-5"
    >
      {/* Icon & Title */}
      <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="w-12 h-12 rounded-2xl bg-[#FFF0E6] dark:bg-[#341F14] text-[#E87A42] flex items-center justify-center shrink-0">
          <MicOff className="w-6 h-6" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Microphone Access Blocked
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            AscendX requires microphone access for real-time speech telemetry and voice coaching.
          </p>
        </div>
      </div>

      {/* Browser Tab Switcher */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
          How to allow microphone in your browser:
        </span>
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-[#131822] rounded-xl border border-slate-200/80 dark:border-slate-800">
          {(
            [
              { id: "chrome", label: "Chrome / Edge" },
              { id: "safari", label: "Safari" },
              { id: "firefox", label: "Firefox" },
            ] as const
          ).map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setSelectedBrowser(b.id)}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                selectedBrowser === b.id
                  ? "bg-white dark:bg-[#1E2533] text-slate-900 dark:text-white shadow-2xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* Step by step instructions */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#131822] border border-slate-200/60 dark:border-slate-800 space-y-2 text-xs text-slate-700 dark:text-slate-300">
        {selectedBrowser === "chrome" && (
          <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
            <li>
              Click the <strong>Lock icon</strong> or <strong>Site Settings tune icon</strong> on the left side of your browser address bar.
            </li>
            <li>
              Find <strong>Microphone</strong> and toggle the switch to <strong>Allow</strong>.
            </li>
            <li>Click the &ldquo;Retry Connection&rdquo; button below to re-verify audio input.</li>
          </ol>
        )}
        {selectedBrowser === "safari" && (
          <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
            <li>
              Open <strong>Safari &gt; Settings &gt; Websites &gt; Microphone</strong> in the top menu bar.
            </li>
            <li>
              Set the current website permission from <em>Deny</em> to <strong>Allow</strong>.
            </li>
            <li>Click &ldquo;Retry Connection&rdquo; below.</li>
          </ol>
        )}
        {selectedBrowser === "firefox" && (
          <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
            <li>
              Click the <strong>Permissions icon</strong> next to the address bar URL.
            </li>
            <li>
              Clear the <strong>Blocked Temporarily</strong> microphone flag.
            </li>
            <li>Click &ldquo;Retry Connection&rdquo; below.</li>
          </ol>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onRetry}
          className="w-full sm:w-auto px-5 py-2.5 bg-[#E87A42] hover:bg-[#d85322] active:scale-[0.98] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#E87A42]"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Connection</span>
        </button>

        {onContinueTextOnly && (
          <button
            type="button"
            onClick={onContinueTextOnly}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 dark:bg-[#202736] hover:bg-slate-200 dark:hover:bg-[#283144] text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Continue in Text Mode</span>
          </button>
        )}
      </div>
    </div>
  );
}
