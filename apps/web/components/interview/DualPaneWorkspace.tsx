"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Code2,
  Terminal,
  Send,
  Sparkles,
  Lightbulb,
  Radio,
  Volume2,
  VolumeX,
  Bot,
  User,
  Sliders,
  Maximize2,
  RotateCcw,
  Check,
  ChevronRight,
  Flame,
  ShieldAlert,
  Braces,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { stopMediaStream, stopElementMediaStream } from "@/lib/utils/media-cleanup";
import { useAutoSaveDraft } from "@/hooks/useAutoSaveDraft";
import type { ChatMessage } from "@/components/interview/ChatBubble";
import type { SessionAdaptiveTelemetry } from "@/lib/services/ai-engine/adaptive-engine.service";

interface DualPaneWorkspaceProps {
  sessionRole?: string;
  personaDisplayName?: string;
  latestAiMessage?: ChatMessage | null;
  messages: ChatMessage[];
  telemetry?: SessionAdaptiveTelemetry | null;
  isLoading: boolean;
  onSendMessage: (text: string) => Promise<void> | void;
  onEndSession?: () => void;
  isImmersive?: boolean;
  onToggleImmersive?: () => void;
  sessionId?: string;
  tts: {
    isSpeaking: boolean;
    isMuted: boolean;
    stop: () => void;
    speak: (text: string) => void;
    toggleMute: () => void;
  };
}

export function DualPaneWorkspace({
  sessionRole = "Full Stack AI Engineer",
  personaDisplayName = "Alex Vance",
  latestAiMessage,
  messages,
  telemetry,
  isLoading,
  onSendMessage,
  onEndSession,
  isImmersive = true,
  onToggleImmersive,
  sessionId,
  tts,
}: DualPaneWorkspaceProps) {
  // Media controls state
  const [userMicActive, setUserMicActive] = useState<boolean>(true);
  const [userCameraActive, setUserCameraActive] = useState<boolean>(true);
  const [aiVoiceActive, setAiVoiceActive] = useState<boolean>(true);
  const [aiCameraActive, setAiCameraActive] = useState<boolean>(true);

  // Video streams
  const userVideoRef = useRef<HTMLVideoElement | null>(null);
  const activeStreamRef = useRef<MediaStream | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  // Code assessment editor state with 1000ms debounced local auto-save
  const {
    draftText: codeResponse,
    setDraftText: setCodeResponse,
    clearDraft,
    isDraftSaved,
    isAutoSaving,
    hasRestoredDraft,
  } = useAutoSaveDraft({
    sessionId,
    debounceMs: 1000,
  });
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Web Speech recognition for user mic & live transcription
  const [isRecognizing, setIsRecognizing] = useState<boolean>(false);
  const [userLiveTranscript, setUserLiveTranscript] = useState<string>("");
  const recognitionRef = useRef<any>(null);

  // Explicit termination method for all local media tracks
  const terminateLocalMediaTracks = useCallback(() => {
    // 1. Terminate all tracks on activeStreamRef
    if (activeStreamRef.current) {
      stopMediaStream(activeStreamRef.current);
      activeStreamRef.current = null;
    }

    // 2. Clear video element srcObject and halt any attached streams
    if (userVideoRef.current) {
      stopElementMediaStream(userVideoRef.current);
    }

    // 3. Stop speech recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    setIsRecognizing(false);
  }, []);

  // Listen for global session termination events or component unmount
  useEffect(() => {
    const handleGlobalTermination = () => {
      terminateLocalMediaTracks();
    };

    window.addEventListener("ascendx:media-session-terminate", handleGlobalTermination);
    window.addEventListener("beforeunload", handleGlobalTermination);

    return () => {
      window.removeEventListener("ascendx:media-session-terminate", handleGlobalTermination);
      window.removeEventListener("beforeunload", handleGlobalTermination);
      terminateLocalMediaTracks();
    };
  }, [terminateLocalMediaTracks]);

  // Initialize camera stream
  useEffect(() => {
    let stream: MediaStream | null = null;
    const currentVideoEl = userVideoRef.current;

    if (userCameraActive) {
      if (navigator?.mediaDevices?.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: { width: 640, height: 480 }, audio: false })
          .then((s) => {
            stream = s;
            activeStreamRef.current = s;
            setHasCameraPermission(true);
            if (currentVideoEl) {
              currentVideoEl.srcObject = s;
            }
          })
          .catch((err) => {
            console.warn("Camera stream not available:", err);
            setHasCameraPermission(false);
          });
      }
    } else {
      if (currentVideoEl) {
        stopElementMediaStream(currentVideoEl);
      }
      if (activeStreamRef.current) {
        stopMediaStream(activeStreamRef.current);
        activeStreamRef.current = null;
      }
    }

    return () => {
      if (stream) {
        stopMediaStream(stream);
      }
      if (activeStreamRef.current) {
        stopMediaStream(activeStreamRef.current);
        activeStreamRef.current = null;
      }
      if (currentVideoEl) {
        stopElementMediaStream(currentVideoEl);
      }
    };
  }, [userCameraActive]);

  // Handle Speech Recognition for live user voice transcript
  useEffect(() => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    if (userMicActive) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          let interim = "";
          let final = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              final += event.results[i][0].transcript;
            } else {
              interim += event.results[i][0].transcript;
            }
          }
          const current = (final || interim).trim();
          if (current) {
            setUserLiveTranscript(current);
            // Append speech into code/text editor if focused or empty
            setCodeResponse((prev) => {
              if (!prev.trim()) return current;
              return prev;
            });
          }
        };

        recognition.onerror = () => {
          setIsRecognizing(false);
        };

        recognition.onend = () => {
          if (userMicActive) {
            try {
              recognition.start();
            } catch {
              // Ignore restart collision
            }
          } else {
            setIsRecognizing(false);
          }
        };

        recognition.start();
        recognitionRef.current = recognition;
        setIsRecognizing(true);
      } catch (err) {
        console.warn("Speech recognition initialization error:", err);
      }
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
        recognitionRef.current = null;
      }
      setIsRecognizing(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, [userMicActive, setCodeResponse]);

  // Code formatting helpers
  const handleInsertBraces = () => {
    insertSnippet("{\n  \n}");
  };

  const handleInsertTag = () => {
    insertSnippet("<Component>\n  \n</Component>");
  };

  const handleInsertFunction = () => {
    insertSnippet("async function solveProblem(input) {\n  // Implementation\n  return result;\n}");
  };

  const insertSnippet = (snippet: string) => {
    if (!textareaRef.current) {
      setCodeResponse((prev) => (prev ? prev + "\n" + snippet : snippet));
      return;
    }
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);
    const newText = before + snippet + after;
    setCodeResponse(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + snippet.length, start + snippet.length);
    }, 50);
  };

  // Submit response handler
  const handleSubmit = async () => {
    if (!codeResponse.trim() || isLoading) return;
    const submission = codeResponse.trim();
    clearDraft();
    setUserLiveTranscript("");
    try {
      await onSendMessage(submission);
    } catch {
      setCodeResponse(submission);
    }
  };

  // Handle Enter to submit (Shift+Enter for newline)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Synchronize AI audio mute state with tts
  const handleToggleAiVoice = () => {
    setAiVoiceActive(!aiVoiceActive);
    tts.toggleMute();
  };

  // Format the AI spoken text with highlight on role / keywords
  const promptText =
    latestAiMessage?.content ||
    `I'm ${personaDisplayName}. We're here to determine if you have the technical rigor required for the ${sessionRole} role. I value precision, architectural foresight, and an uncompromising approach to system efficiency. We don't have time for fluff, so let's dive straight into the technical architecture.`;

  // Compute dynamic AI Insight Cards based on active telemetry or question context
  const insightCards = React.useMemo(() => {
    const list = [
      {
        id: "insight-1",
        label: "Assess: System Efficiency",
        detail: telemetry?.concurrencyEvaluation
          ? `Concurrency: ${telemetry.concurrencyEvaluation}`
          : "Analyzing algorithmic throughput and non-blocking performance",
      },
      {
        id: "insight-2",
        label: "Probe: Technical Rigor",
        detail: telemetry?.communicationPacing
          ? `Pacing: ${telemetry.communicationPacing}`
          : "Measuring state consistency, edge-case coverage & modularity",
      },
      {
        id: "insight-3",
        label: "Evaluate: Architectural Forensics",
        detail: telemetry?.recommendedFocus
          ? `Focus: ${telemetry.recommendedFocus}`
          : "Benchmarking distributed scale, latency budgets and failure recovery",
      },
    ];
    return list;
  }, [telemetry]);

  // Live transcription ticker content (AI speech or user streaming transcript)
  const liveTranscriptText =
    userLiveTranscript ||
    latestAiMessage?.content?.slice(0, 110) ||
    `I'm ${personaDisplayName}. We're here to determine if you have technical rigor...`;

  return (
    <div
      id="mock-interview-workspace"
      className={cn(
        "w-full flex-1 flex flex-col justify-start items-center transition-all duration-300",
        isImmersive ? "p-1.5 sm:p-2.5 md:p-3 h-full max-h-screen" : "p-2 sm:p-4 md:p-6"
      )}
    >
      {/* ── High-Tech Console Bezel Frame ── */}
      <div
        className={cn(
          "w-full rounded-2xl sm:rounded-3xl bg-[#10141D] border border-[#232B3E] shadow-2xl relative overflow-hidden backdrop-blur-2xl flex flex-col",
          isImmersive
            ? "max-w-[100vw] h-full flex-1 p-3 sm:p-4 md:p-5"
            : "max-w-7xl p-3 sm:p-5 md:p-6"
        )}
      >
        {/* Top Streamlined Header Bar with Live Status & End & View Feedback button */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#1B2232] text-xs shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#E8602E] animate-pulse" />
              <span className="text-slate-200 font-semibold tracking-wide text-xs sm:text-sm">
                {sessionRole}
              </span>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#181F2C] border border-[#29354A] text-emerald-400 font-mono text-[11px]">
              <Radio className="h-3 w-3 animate-pulse" />
              <span>LIVE INTERVIEW</span>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {onToggleImmersive && (
              <button
                type="button"
                onClick={onToggleImmersive}
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#161B26] hover:bg-[#1E2536] border border-[#2A354C] text-slate-400 hover:text-slate-200 text-xs font-medium transition-colors cursor-pointer"
                title={isImmersive ? "Exit Full-Screen Canvas" : "Enter Full-Screen Canvas"}
              >
                <Maximize2 className="h-3.5 w-3.5 text-amber-400" />
                <span>{isImmersive ? "Standard View" : "Full Screen"}</span>
              </button>
            )}

            {onEndSession && (
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  terminateLocalMediaTracks();
                  onEndSession();
                }}
                className="gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#E8602E] via-[#F06A35] to-[#F58245] hover:from-[#DC5420] hover:to-[#E8602E] text-white font-semibold text-xs shadow-md shadow-orange-950/40 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Award className="h-3.5 w-3.5" />
                <span>End &amp; View Feedback</span>
              </Button>
            )}
          </div>
        </div>

        {/* ── Main Two-Column Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-5 pt-3 sm:pt-4 flex-1 overflow-y-auto">
          {/* ══════════════════════════════════════════════════════════════
              LEFT PANE: Interview & Call + Code Assessment Response Box
          ══════════════════════════════════════════════════════════════ */}
          <div className="flex flex-col space-y-4">
            {/* 1. Header: Interview & Call */}
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-semibold tracking-wide text-slate-200">
                Interview &amp; Call
              </h2>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Encrypted Session
                </span>
              </div>
            </div>

            {/* Video Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* User Webcam Feed */}
              <div className="flex flex-col rounded-2xl bg-[#161B26] border border-[#242D3E] p-3 shadow-lg group">
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-[#0C1017] border border-[#1D2536] flex items-center justify-center">
                  {userCameraActive ? (
                    <>
                      <video
                        ref={userVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover scale-x-[-1]"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-mono text-emerald-300 flex items-center gap-1 border border-emerald-500/30">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Live Cam
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-500 p-4">
                      <div className="h-12 w-12 rounded-full bg-[#1C2333] flex items-center justify-center mb-2">
                        <User className="h-6 w-6 text-slate-400" />
                      </div>
                      <span className="text-xs font-medium text-slate-400">Camera Off</span>
                    </div>
                  )}

                  {/* Fallback avatar preview overlay if permission denied */}
                  {userCameraActive && hasCameraPermission === false && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-slate-950 via-slate-900 to-slate-950/80 p-2 text-center">
                      <div className="h-12 w-12 rounded-full bg-[#1E283A] border border-amber-500/30 flex items-center justify-center mb-1">
                        <User className="h-6 w-6 text-amber-400" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-300">Candidate Avatar</span>
                      <span className="text-[9px] text-slate-500">Camera permission needed</span>
                    </div>
                  )}

                  {/* Audio Level Waveform Indicator */}
                  {userMicActive && (
                    <div className="absolute bottom-2 left-2 flex items-center gap-0.5 px-2 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10">
                      <span className="h-2 w-0.5 bg-[#E8602E] animate-pulse" />
                      <span className="h-3 w-0.5 bg-[#E8602E] animate-pulse [animation-delay:150ms]" />
                      <span className="h-1.5 w-0.5 bg-[#E8602E] animate-pulse [animation-delay:300ms]" />
                      <span className="text-[9px] font-mono text-amber-300 ml-1">VOX</span>
                    </div>
                  )}
                </div>

                {/* User Webcam Label */}
                <div className="mt-2.5 text-center">
                  <span className="text-xs font-medium text-slate-300">User Webcam</span>
                </div>

                {/* User Controls: Mic Toggle Switch */}
                <div className="mt-2 pt-2 border-t border-[#1F2737] flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setUserMicActive(!userMicActive)}
                    className={cn(
                      "flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-all cursor-pointer border",
                      userMicActive
                        ? "bg-[#251A14] border-[#E8602E]/60 text-[#F58245] shadow-xs shadow-orange-500/10"
                        : "bg-[#18202D] border-slate-700/60 text-slate-400 hover:text-slate-200"
                    )}
                    title={userMicActive ? "Mute Microphone" : "Unmute Microphone"}
                  >
                    {userMicActive ? (
                      <Mic className="h-3.5 w-3.5 text-[#E8602E]" />
                    ) : (
                      <MicOff className="h-3.5 w-3.5 text-slate-400" />
                    )}
                    {/* Visual Capsule Switch Toggle */}
                    <div
                      className={cn(
                        "w-7 h-4 rounded-full p-0.5 transition-colors duration-200 flex items-center",
                        userMicActive ? "bg-[#E8602E]" : "bg-slate-700"
                      )}
                    >
                      <div
                        className={cn(
                          "w-3 h-3 rounded-full bg-white transition-transform duration-200 shadow-xs",
                          userMicActive ? "translate-x-3" : "translate-x-0"
                        )}
                      />
                    </div>
                    <span className="text-[11px] font-semibold">
                      {userMicActive ? "Voice Active" : "Muted"}
                    </span>
                  </button>

                  {/* Camera Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setUserCameraActive(!userCameraActive)}
                    className={cn(
                      "p-1.5 rounded-full border transition-all cursor-pointer",
                      userCameraActive
                        ? "bg-[#1C2535] border-slate-700 text-slate-300 hover:text-white"
                        : "bg-[#25191C] border-rose-500/40 text-rose-400"
                    )}
                    title={userCameraActive ? "Turn off camera" : "Turn on camera"}
                  >
                    {userCameraActive ? (
                      <Video className="h-3.5 w-3.5" />
                    ) : (
                      <VideoOff className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* AI Persona Video Feed (Alex Vance) */}
              <div className="flex flex-col rounded-2xl bg-[#161B26] border border-[#242D3E] p-3 shadow-lg">
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-gradient-to-b from-[#131926] via-[#0E131E] to-[#0A0D15] border border-[#1D2536] flex flex-col items-center justify-center group">
                  {/* Glowing Holographic Halo Ring */}
                  <div
                    className={cn(
                      "absolute inset-0 flex items-center justify-center transition-opacity duration-500 pointer-events-none",
                      tts.isSpeaking
                        ? "opacity-100 bg-[radial-gradient(circle_at_center,rgba(232,96,46,0.18)_0%,transparent_70%)]"
                        : "opacity-40"
                    )}
                  />

                  {/* AI Persona Circular Avatar with Subtle Sound Wave Ring */}
                  <div className="relative z-10 flex items-center justify-center">
                    <div
                      className={cn(
                        "relative h-18 w-18 rounded-full flex items-center justify-center transition-all duration-300",
                        tts.isSpeaking
                          ? "ring-4 ring-orange-500/50 shadow-xl shadow-orange-500/30 scale-105"
                          : "ring-2 ring-blue-500/30"
                      )}
                    >
                      {/* Stylized Silhouette Avatar matching image.png */}
                      <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-[#141B29] via-[#1F2B42] to-[#162032] flex items-center justify-center shadow-inner overflow-hidden border border-blue-400/20">
                        <svg viewBox="0 0 100 100" className="w-12 h-12 text-slate-300 opacity-80" fill="currentColor">
                          <circle cx="50" cy="36" r="18" fill="rgba(203,213,225,0.75)" />
                          <path d="M20 84 C22 60, 36 54, 50 54 C64 54, 78 60, 80 84 Z" fill="rgba(148,163,184,0.6)" />
                        </svg>
                      </div>

                      {/* Speaking Pulse Ring */}
                      {tts.isSpeaking && (
                        <span className="absolute -inset-1 rounded-full border border-[#E8602E] animate-ping opacity-60 pointer-events-none" />
                      )}
                    </div>
                  </div>

                  {/* AI Status Badge */}
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-mono text-amber-300 flex items-center gap-1 border border-amber-500/30">
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full bg-amber-400",
                        tts.isSpeaking ? "animate-pulse" : ""
                      )}
                    />
                    {tts.isSpeaking ? "Speaking" : "Listening"}
                  </div>

                  {/* Realtime Waveform bar at bottom */}
                  {tts.isSpeaking && (
                    <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-1 px-4">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <span
                          key={i}
                          className="w-1 bg-[#E8602E] rounded-full animate-pulse"
                          style={{
                            height: `${Math.max(6, Math.sin(i * 0.7 + Date.now() * 0.01) * 18 + 12)}px`,
                            animationDelay: `${i * 60}ms`,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* AI Persona Label */}
                <div className="mt-2.5 text-center">
                  <span className="text-xs font-semibold text-slate-200">
                    {personaDisplayName}
                  </span>
                </div>

                {/* AI Controls: Voice Active & Camera On Badges */}
                <div className="mt-2 pt-2 border-t border-[#1F2737] flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={handleToggleAiVoice}
                    className={cn(
                      "flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border transition-all cursor-pointer",
                      aiVoiceActive && !tts.isMuted
                        ? "bg-[#251A14] border-[#E8602E]/60 text-[#F58245]"
                        : "bg-[#18202D] border-slate-700 text-slate-400"
                    )}
                    title={aiVoiceActive ? "Mute AI voice output" : "Unmute AI voice"}
                  >
                    {aiVoiceActive && !tts.isMuted ? (
                      <Volume2 className="h-3.5 w-3.5 text-[#E8602E]" />
                    ) : (
                      <VolumeX className="h-3.5 w-3.5 text-slate-400" />
                    )}
                    <span className="text-[11px] font-semibold">Voice Active</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAiCameraActive(!aiCameraActive)}
                    className={cn(
                      "flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border transition-all cursor-pointer",
                      aiCameraActive
                        ? "bg-[#251A14] border-[#E8602E]/60 text-[#F58245]"
                        : "bg-[#18202D] border-slate-700 text-slate-400"
                    )}
                  >
                    <Video className="h-3.5 w-3.5 text-[#E8602E]" />
                    <span className="text-[11px] font-semibold">Camera On</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Built-in Code Assessment & Text Response Card */}
            <div className="rounded-2xl bg-[#161B26] border border-[#242D3E] p-3 sm:p-4 shadow-xl flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-[#E8602E]" />
                  <span className="text-xs font-semibold text-slate-200">
                    Code Assessment Response
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-[#0F131C] px-2 py-0.5 rounded-md border border-[#202737]">
                  Shift+Enter for newline
                </span>
              </div>

              {/* Code Snippet Formatting Toolbar */}
              <div className="flex items-center gap-1.5 pb-2 border-b border-[#212A3B]">
                <button
                  type="button"
                  onClick={handleInsertBraces}
                  className="px-2.5 py-1 rounded-lg bg-[#1B2232] hover:bg-[#252E42] border border-[#2A354C] text-slate-300 hover:text-white text-xs font-mono font-bold transition-colors cursor-pointer flex items-center gap-1"
                  title="Insert code block / object braces"
                >
                  <Braces className="h-3 w-3 text-[#E8602E]" />
                  <span>{"{ }"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleInsertTag}
                  className="px-2.5 py-1 rounded-lg bg-[#1B2232] hover:bg-[#252E42] border border-[#2A354C] text-slate-300 hover:text-white text-xs font-mono font-bold transition-colors cursor-pointer flex items-center gap-1"
                  title="Insert JSX / markup snippet"
                >
                  <Code2 className="h-3 w-3 text-[#E8602E]" />
                  <span>{"</>"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleInsertFunction}
                  className="px-2.5 py-1 rounded-lg bg-[#1B2232] hover:bg-[#252E42] border border-[#2A354C] text-slate-300 hover:text-white text-xs font-mono font-bold transition-colors cursor-pointer"
                  title="Insert function snippet"
                >
                  <span>fn()</span>
                </button>

                <div className="ml-auto text-[11px] text-slate-500 font-mono">
                  {codeResponse.length} chars
                </div>
              </div>

              {/* Code/Text Editor Textarea */}
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={codeResponse}
                  onChange={(e) => setCodeResponse(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="// Type your code solution, architectural explanation, or algorithm here...
function optimizeExecution(nodes) {
  // Write or speak your solution...
}"
                  rows={6}
                  disabled={isLoading}
                  className="w-full rounded-xl bg-[#0D111A] border border-[#202737] p-3 text-xs font-mono text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-[#E8602E]/70 focus:ring-1 focus:ring-[#E8602E]/40 resize-y transition-all"
                />
              </div>

              {/* Bottom Actions: Auto-save status, Quick Clear + Direct Submit Button */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      clearDraft();
                      setCodeResponse("");
                    }}
                    disabled={!codeResponse || isLoading}
                    className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
                  >
                    Clear Buffer
                  </button>

                  {/* Debounced Auto-Save status badge */}
                  {isAutoSaving && (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-amber-400 animate-pulse">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                      Auto-saving draft...
                    </span>
                  )}
                  {isDraftSaved && !isAutoSaving && codeResponse.trim().length > 0 && (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                      <Check className="h-2.5 w-2.5" />
                      Auto-saved locally
                    </span>
                  )}
                  {hasRestoredDraft && codeResponse.trim().length > 0 && !isAutoSaving && (
                    <span className="flex items-center gap-1 rounded bg-blue-500/20 px-1.5 py-0.5 text-[10px] font-mono text-blue-300 border border-blue-500/30">
                      <RotateCcw className="h-2.5 w-2.5" />
                      Restored draft
                    </span>
                  )}
                </div>

                <Button
                  type="button"
                  size="sm"
                  onClick={handleSubmit}
                  disabled={!codeResponse.trim() || isLoading}
                  className="gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#E8602E] to-[#F27740] hover:from-[#DC5420] hover:to-[#E8602E] text-white font-semibold text-xs shadow-md shadow-orange-950/40 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? (
                    <>
                      <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <span>Evaluating...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit</span>
                      <Send className="h-3 w-3" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              RIGHT PANE: AI Companion & Insight, Dynamic Insight Cards,
              and Persistent Live Transcription Ticker
          ══════════════════════════════════════════════════════════════ */}
          <div className="flex flex-col space-y-4">
            {/* Header: AI Companion & Insight */}
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-semibold tracking-wide text-slate-200">
                AI Companion &amp; Insight
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#1B2332] text-amber-300 border border-amber-500/20">
                Persona: {personaDisplayName}
              </span>
            </div>

            {/* 1. Highlighted AI Companion Speech Dialogue Box */}
            <div className="relative rounded-2xl bg-gradient-to-b from-[#1E2638] via-[#161C28] to-[#121620] border-2 border-amber-500/40 dark:border-amber-500/35 p-4 sm:p-5 shadow-xl shadow-amber-950/20">
              {/* Top Accent glow */}
              <div className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-70" />

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-amber-300">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <Sparkles className="h-3.5 w-3.5 text-[#E8602E] animate-pulse" />
                    <span>Active Dialogue &amp; Framing</span>
                  </div>
                  {tts.isSpeaking && (
                    <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E8602E]/20 text-[#F58245] border border-[#E8602E]/30 animate-pulse">
                      <Volume2 className="h-2.5 w-2.5" />
                      Streaming Voice
                    </span>
                  )}
                </div>

                <div className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans font-normal tracking-wide">
                  <span className="text-amber-400 font-bold mr-1">
                    I&apos;m {personaDisplayName}.
                  </span>
                  <span>
                    We&apos;re here to determine if you have the technical rigor required for the{" "}
                  </span>
                  <span className="font-extrabold text-[#F58245] underline decoration-amber-500/40 underline-offset-4">
                    {sessionRole} role
                  </span>
                  <span>
                    . I value precision, architectural foresight, and an uncompromising approach to system efficiency. We don&apos;t have time for fluff, so let&apos;s dive straight into the technical architecture and real-world system constraints.
                  </span>
                </div>

                {/* Sub-text if AI message provided */}
                {latestAiMessage && latestAiMessage.content && (
                  <div className="mt-3 pt-3 border-t border-[#263146] text-xs text-slate-300 bg-[#0F141E]/80 rounded-xl p-3 border border-[#20293C]">
                    <div className="text-[11px] font-bold text-amber-400/90 mb-1 flex items-center gap-1">
                      <ChevronRight className="h-3 w-3 text-[#E8602E]" />
                      Current Prompt:
                    </div>
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {latestAiMessage.content}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 2. AI Insight Cards */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-semibold text-slate-300">
                  AI Insight Cards
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  Live Adaptive Probes
                </span>
              </div>

              <div className="space-y-2">
                {insightCards.map((card) => (
                  <div
                    key={card.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#161B26] hover:bg-[#1A2130] border border-[#242D3E] hover:border-amber-500/30 transition-all shadow-sm group"
                  >
                    <div className="h-8 w-8 rounded-lg bg-[#201815] border border-amber-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Lightbulb className="h-4 w-4 text-amber-400 group-hover:text-amber-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-200 group-hover:text-amber-300 transition-colors">
                        {card.label}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {card.detail}
                      </div>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-600 group-hover:text-amber-400 transition-colors shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Live Transcription Ticker */}
            <div className="rounded-2xl bg-[#161B26] border border-[#242D3E] p-3 sm:p-3.5 shadow-lg flex flex-col space-y-1.5 mt-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                  <Radio className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
                  <span>Live Transcription</span>
                </div>
                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  {userMicActive ? "MIC STREAMING" : "STANDBY"}
                </span>
              </div>

              <div className="rounded-xl bg-[#0D111A] border border-[#1F2738] p-2.5 min-h-[52px] flex items-center">
                <p className="text-xs font-mono text-slate-300 leading-relaxed truncate">
                  {liveTranscriptText}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
