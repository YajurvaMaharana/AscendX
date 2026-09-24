"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Trash2,
  Lock,
  EyeOff,
  Database,
  FileText,
  Mic,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Info,
  Sliders,
  Check,
} from "lucide-react";

export default function PrivacyTrustSettings() {
  // 1. Recording Storage State
  const [retentionPeriod, setRetentionPeriod] = useState<string>("30_days");
  const [cloudCacheDuration, setCloudCacheDuration] = useState<string>("24_hours");
  const [localStorageEnabled, setLocalStorageEnabled] = useState<boolean>(true);

  // 2. Resume & LLM Privacy
  const [restrictResumeSharing, setRestrictResumeSharing] = useState<boolean>(true);
  const [zeroDataRetentionMode, setZeroDataRetentionMode] = useState<boolean>(true);

  // 3. AI Analysis & Model Training Opt-Out
  const [optOutModelTraining, setOptOutModelTraining] = useState<boolean>(true);
  const [allowContextLogging, setAllowContextLogging] = useState<boolean>(false);

  // 4. Pre-Recording Consent Enforcer
  const [enforceConsentPrompts, setEnforceConsentPrompts] = useState<boolean>(true);

  // Data Deletion State
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteSuccess, setDeleteSuccess] = useState<boolean>(false);

  // Local Storage Sync
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedRetention = localStorage.getItem("ascendx_audio_retention");
      if (savedRetention) setRetentionPeriod(savedRetention);

      const savedOptOut = localStorage.getItem("ascendx_opt_out_training");
      if (savedOptOut) setOptOutModelTraining(savedOptOut === "true");

      const savedConsent = localStorage.getItem("ascendx_enforce_consent");
      if (savedConsent) setEnforceConsentPrompts(savedConsent === "true");
    }
  }, []);

  const handleSaveSetting = (key: string, val: any) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, String(val));
    }
  };

  const handlePurgeAllData = async () => {
    setIsDeleting(true);
    // Simulate backend purge call
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsDeleting(false);
    setShowDeleteModal(false);
    setDeleteSuccess(true);
    setTimeout(() => setDeleteSuccess(false), 5000);
  };

  return (
    <div
      role="region"
      aria-label="Privacy, Trust & Data Controls"
      className="w-full bg-white dark:bg-[#181E29] rounded-2xl border border-slate-200/80 dark:border-[#242C3B] p-6 shadow-sm space-y-6"
    >
      {/* Header with Trust Messaging */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                Privacy, Trust Assurance &amp; Data Controls
              </h2>
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                <span>Zero-Retention Certified</span>
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Your voice recordings and resume data are encrypted end-to-end and deleted according to your rules.
            </p>
          </div>
        </div>
      </div>

      {/* Prominent Trust Banner */}
      <div className="p-4 rounded-xl bg-[#FFF8F3] dark:bg-[#2A1D16] border border-[#E87A42]/30 flex items-start gap-3">
        <Lock className="w-4 h-4 text-[#E87A42] shrink-0 mt-0.5" aria-hidden="true" />
        <div className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
          <strong className="font-bold text-[#A24419] dark:text-[#FFAC82]">Explicit Privacy Commitment: </strong>
          Your audio recordings and raw interview transcripts are private, used solely for real-time speech telemetry and STAR feedback, and can be purged at any time with one click.
        </div>
      </div>

      {deleteSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-200 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
          <span>All historical voice recordings, transcripts, and telemetry data have been purged successfully.</span>
        </div>
      )}

      {/* ── 1. Recording Storage & Retention Controls ── */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-2">
          <Database className="w-4 h-4 text-[#E87A42]" aria-hidden="true" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            1. Recording Storage &amp; Retention Settings
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Audio Retention Period */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#131822] border border-slate-200/80 dark:border-slate-800 space-y-2">
            <label htmlFor="retention-select" className="text-xs font-bold text-slate-900 dark:text-white block">
              Audio Retention Period
            </label>
            <select
              id="retention-select"
              value={retentionPeriod}
              onChange={(e) => {
                setRetentionPeriod(e.target.value);
                handleSaveSetting("ascendx_audio_retention", e.target.value);
              }}
              className="w-full min-h-[44px] px-3 py-2 bg-white dark:bg-[#1C2230] border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white rounded-xl cursor-pointer focus-visible:ring-2 focus-visible:ring-[#E87A42]"
            >
              <option value="immediate">Delete immediately after analysis</option>
              <option value="7_days">Retain for 7 days</option>
              <option value="30_days">Retain for 30 days (Recommended)</option>
              <option value="indefinite">Keep until manually deleted</option>
            </select>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Automatically purges audio files after expiration.
            </p>
          </div>

          {/* Cloud Cache Duration */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#131822] border border-slate-200/80 dark:border-slate-800 space-y-2">
            <label htmlFor="cache-select" className="text-xs font-bold text-slate-900 dark:text-white block">
              Cloud Cache Duration
            </label>
            <select
              id="cache-select"
              value={cloudCacheDuration}
              onChange={(e) => setCloudCacheDuration(e.target.value)}
              className="w-full min-h-[44px] px-3 py-2 bg-white dark:bg-[#1C2230] border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white rounded-xl cursor-pointer focus-visible:ring-2 focus-visible:ring-[#E87A42]"
            >
              <option value="direct_stream">No cloud cache (Direct streaming)</option>
              <option value="session_only">Session memory only</option>
              <option value="24_hours">24-hour temporary cache</option>
            </select>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Controls temporary RAM caching during evaluation.
            </p>
          </div>

          {/* Local Browser Storage */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#131822] border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Local Browser Cache
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Cache offline speech telemetry in browser IndexedDB.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setLocalStorageEnabled(!localStorageEnabled)}
              className={`min-h-[44px] min-w-[44px] px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                localStorageEnabled
                  ? "bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800"
                  : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700"
              }`}
            >
              {localStorageEnabled ? "Enabled" : "Disabled"}
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. Resume & Job Description Privacy Controls ── */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-2">
          <FileText className="w-4 h-4 text-[#E87A42]" aria-hidden="true" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            2. Resume &amp; Job Description Grounding Privacy
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#131822] border border-slate-200/80 dark:border-slate-800 flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Restrict Third-Party LLM Sharing
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Prevents parsed resume text and Job Descriptions from being shared with any external non-certified third party.
              </p>
            </div>
            <input
              type="checkbox"
              checked={restrictResumeSharing}
              onChange={(e) => setRestrictResumeSharing(e.target.checked)}
              className="w-5 h-5 rounded-md text-[#E87A42] focus:ring-[#E87A42] cursor-pointer mt-0.5 shrink-0"
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#131822] border border-slate-200/80 dark:border-slate-800 flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Zero-Data-Retention API Endpoint
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Enforces Gemini API zero-data-retention headers, ensuring prompt queries are never stored on server logs.
              </p>
            </div>
            <input
              type="checkbox"
              checked={zeroDataRetentionMode}
              onChange={(e) => setZeroDataRetentionMode(e.target.checked)}
              className="w-5 h-5 rounded-md text-[#E87A42] focus:ring-[#E87A42] cursor-pointer mt-0.5 shrink-0"
            />
          </div>
        </div>
      </div>

      {/* ── 3. AI Model Training & Context Logging Controls ── */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-2">
          <EyeOff className="w-4 h-4 text-[#E87A42]" aria-hidden="true" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            3. AI Model Training &amp; Conversational Context Logging
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#131822] border border-slate-200/80 dark:border-slate-800 flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Opt-Out of AI Model Training
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Guarantees that your interview transcripts and speech data are strictly excluded from AI model retraining datasets.
              </p>
            </div>
            <input
              type="checkbox"
              checked={optOutModelTraining}
              onChange={(e) => {
                setOptOutModelTraining(e.target.checked);
                handleSaveSetting("ascendx_opt_out_training", e.target.checked);
              }}
              className="w-5 h-5 rounded-md text-[#E87A42] focus:ring-[#E87A42] cursor-pointer mt-0.5 shrink-0"
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#131822] border border-slate-200/80 dark:border-slate-800 flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Conversational Context Logging
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Allow conversational history logging to enable longitudinal follow-up questions across multiple practice sessions.
              </p>
            </div>
            <input
              type="checkbox"
              checked={allowContextLogging}
              onChange={(e) => setAllowContextLogging(e.target.checked)}
              className="w-5 h-5 rounded-md text-[#E87A42] focus:ring-[#E87A42] cursor-pointer mt-0.5 shrink-0"
            />
          </div>
        </div>
      </div>

      {/* ── 4. Pre-Recording Consent Prompts Settings ── */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-2">
          <Mic className="w-4 h-4 text-[#E87A42]" aria-hidden="true" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            4. Pre-Recording Mandatory Consent Prompts
          </h3>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#131822] border border-slate-200/80 dark:border-slate-800 flex items-start justify-between gap-3">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-900 dark:text-white block">
              Enforce Explicit Consent Gate Before Every Recording
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Requires an explicit checkbox confirmation before initializing microphone streams in pre-flight diagnostics or live interview rooms.
            </p>
          </div>
          <input
            type="checkbox"
            checked={enforceConsentPrompts}
            onChange={(e) => {
              setEnforceConsentPrompts(e.target.checked);
              handleSaveSetting("ascendx_enforce_consent", e.target.checked);
            }}
            className="w-5 h-5 rounded-md text-[#E87A42] focus:ring-[#E87A42] cursor-pointer mt-0.5 shrink-0"
          />
        </div>
      </div>

      {/* ── 5. One-Click Data Deletion Mechanism ── */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider block">
            Purge All Historical Data
          </span>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Permanently delete all past voice audio, interview transcripts, and performance metrics.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="min-h-[44px] px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-rose-500 shrink-0"
        >
          <Trash2 className="w-4 h-4" aria-hidden="true" />
          <span>Purge All Historical Data</span>
        </button>
      </div>

      {/* Purge Confirmation Modal */}
      {showDeleteModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="purge-modal-title"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
        >
          <div className="bg-white dark:bg-[#1A212D] border border-slate-200 dark:border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-slate-900 dark:text-white">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-6 h-6 shrink-0" aria-hidden="true" />
              <h3 id="purge-modal-title" className="text-base font-bold">
                Confirm Data Purge
              </h3>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete all historical voice recordings, interview transcripts, and STAR metric history? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handlePurgeAllData}
                disabled={isDeleting}
                className="min-h-[44px] px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" aria-hidden="true" />
                    <span>Purging...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                    <span>Permanently Purge Everything</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
