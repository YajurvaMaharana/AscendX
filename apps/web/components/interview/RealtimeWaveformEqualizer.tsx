// ---------------------------------------------------------------------------
// RealtimeWaveformEqualizer.tsx — Real-Time Waveform & Audio Equalizer Visualization
// ---------------------------------------------------------------------------

"use client";

import React, { useEffect, useState } from "react";
import { Mic, Volume2, Activity, Gauge, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface RealtimeWaveformEqualizerProps {
  audioLevel: number; // 0 to 100
  isRecording: boolean;
  className?: string;
}

export function RealtimeWaveformEqualizer({
  audioLevel,
  isRecording,
  className,
}: RealtimeWaveformEqualizerProps) {
  const [bars, setBars] = useState<number[]>(Array(24).fill(10));

  // Animate equalizer bars dynamically based on audioLevel and time
  useEffect(() => {
    let animationId: number;

    const updateBars = () => {
      if (!isRecording) {
        setBars(Array(24).fill(6));
        return;
      }

      const newBars = Array.from({ length: 24 }, (_, i) => {
        const base = audioLevel * (0.3 + Math.abs(Math.sin(i * 0.5 + Date.now() * 0.008)) * 0.7);
        const randomNoise = Math.random() * 15;
        return Math.max(8, Math.min(64, Math.round(base + randomNoise)));
      });

      setBars(newBars);
      animationId = requestAnimationFrame(updateBars);
    };

    animationId = requestAnimationFrame(updateBars);
    return () => cancelAnimationFrame(animationId);
  }, [audioLevel, isRecording]);

  // Determine intensity label & color
  const getIntensityInfo = (level: number) => {
    if (!isRecording) return { label: "Microphone Standby", color: "text-slate-400 bg-slate-500/10 border-slate-500/20" };
    if (level < 15) return { label: "Low Volume (Speak Closer)", color: "text-amber-500 bg-amber-500/10 border-amber-500/20" };
    if (level <= 75) return { label: "Optimal Voice Projection", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" };
    return { label: "High Intensity (Peak Volume)", color: "text-rose-500 bg-rose-500/10 border-rose-500/20" };
  };

  const intensity = getIntensityInfo(audioLevel);

  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/90 dark:border-[#222B3A] bg-white dark:bg-[#181E29] p-4 shadow-2xs space-y-3",
        className
      )}
    >
      {/* Header & Intensity Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400">
            <Activity className="h-3.5 w-3.5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Spoken Delivery Equalizer & Volume Calibration
            </h4>
            <p className="text-[10.5px] text-slate-500 dark:text-slate-400">
              Real-time spectral analysis of microphone intensity and acoustic projection.
            </p>
          </div>
        </div>

        <span
          className={cn(
            "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border",
            intensity.color
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", isRecording ? "bg-current animate-ping" : "bg-slate-400")} />
          {intensity.label}
        </span>
      </div>

      {/* ── Visual Equalizer Spectrum Bars ── */}
      <div className="relative h-20 rounded-xl bg-slate-900/90 dark:bg-[#121620] border border-slate-800 p-3 flex items-center justify-between overflow-hidden shadow-inner">
        {/* Background Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between p-3 pointer-events-none opacity-20">
          <div className="w-full border-b border-dashed border-slate-600" />
          <div className="w-full border-b border-dashed border-slate-600" />
          <div className="w-full border-b border-dashed border-slate-600" />
        </div>

        {/* Equalizer Frequency Bars */}
        <div className="relative z-10 w-full flex items-end justify-between gap-1 h-full px-1">
          {bars.map((height, idx) => {
            // Color gradient based on bar index & height
            const barColor =
              height > 45
                ? "from-rose-500 to-amber-500"
                : height > 25
                ? "from-orange-500 to-amber-400"
                : "from-indigo-500 to-cyan-400";

            return (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center justify-end h-full"
              >
                <div
                  className={cn(
                    "w-full rounded-t-sm transition-all duration-75 bg-gradient-to-t shadow-xs",
                    barColor,
                    !isRecording && "opacity-30"
                  )}
                  style={{ height: `${Math.max(6, height)}%` }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Volume Level Meter & Stats */}
      <div className="grid grid-cols-3 gap-2 pt-1 text-center">
        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
          <div className="text-[10px] text-slate-400 font-medium">Volume Level</div>
          <div className="text-xs font-bold font-mono text-orange-600 dark:text-orange-400 mt-0.5">
            {audioLevel}%
          </div>
        </div>
        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
          <div className="text-[10px] text-slate-400 font-medium">Spectral Bands</div>
          <div className="text-xs font-bold font-mono text-slate-800 dark:text-slate-200 mt-0.5">
            24 Channels
          </div>
        </div>
        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
          <div className="text-[10px] text-slate-400 font-medium">Signal Status</div>
          <div className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
            {isRecording ? "Streaming" : "Idle"}
          </div>
        </div>
      </div>
    </div>
  );
}
