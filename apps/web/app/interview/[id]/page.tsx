"use client";

/* eslint-disable react-hooks/exhaustive-deps */

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Bot,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Clock,
  ShieldCheck,
  Award,
  Zap,
  Mic,
  MessageSquare,
  Target,
  Sliders,
  LayoutGrid,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { useAutoScroll } from "@/hooks/useAutoScroll";
import { ChatBubble, type ChatMessage } from "@/components/interview/ChatBubble";
import { InterviewInput } from "@/components/interview/InterviewInput";
import { LiveVoiceWorkspace } from "@/components/interview/LiveVoiceWorkspace";
import { DualPaneWorkspace } from "@/components/interview/DualPaneWorkspace";
import { Button } from "@/components/ui/button";
import { AdaptiveTelemetryHUD } from "@/components/interview/AdaptiveTelemetryHUD";
import { InterviewerAudioPlayer } from "@/components/interview/InterviewerAudioPlayer";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { cn } from "@/lib/utils";
import { terminateAllActiveMediaStreams } from "@/lib/utils/media-cleanup";
import PreFlightModal from "@/components/interview/PreFlightModal";
import type { PreFlightCheckResults } from "@/components/interview/PreFlightDiagnostic";
import type { SessionAdaptiveTelemetry } from "@/lib/services/ai-engine/adaptive-engine.service";
import type { JobDescriptionParsedData } from "@/lib/types/database.types";
import { useChat } from "@ai-sdk/react";
import {
  getStoredSessionState,
  useInterviewSessionPersistence,
  markSessionCompleted,
  clearActiveSession,
} from "@/hooks/useInterviewSessionState";
import {
  INTERVIEW_QUESTIONS,
  TOTAL_INTERVIEW_QUESTIONS,
  getInterviewQuestionByIndex,
} from "@/lib/constants/interview-questions";

interface InterviewResponse {
  message: string;
  telemetry?: SessionAdaptiveTelemetry;
  evaluation?: any;
}

interface SessionData {
  id: string;
  role: string;
  difficulty: string;
  type: string;
  status: string;
  persona?: string | null;
  modality?: string;
  jd_data?: JobDescriptionParsedData | null;
}

function InterviewPageContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const interviewId = (params?.id as string) || "demo-session";

  // Pre-Flight Diagnostic State: Check if already cleared or passed via query
  const hasPassedPreflightParam = searchParams?.get("preflight") === "passed";
  const [showPreFlightModal, setShowPreFlightModal] = React.useState<boolean>(() => {
    if (typeof window !== "undefined") {
      if (hasPassedPreflightParam) return false;
      const cleared = sessionStorage.getItem(`preflight_cleared_${interviewId}`);
      return !cleared;
    }
    return false;
  });

  // Synchronously hydrate initial stored session parameters from localStorage on mount
  const storedInitial = React.useMemo(() => {
    if (typeof window !== "undefined") {
      return getStoredSessionState(interviewId);
    }
    return null;
  }, [interviewId]);

  const [session, setSession] = React.useState<SessionData | null>(() => {
    if (storedInitial) {
      return {
        id: interviewId,
        role: storedInitial.personaDisplayName || "Software Engineering",
        difficulty: "Medium",
        type: "Technical",
        status: "in_progress",
        persona: storedInitial.persona || "tech-grinder",
      };
    }
    return null;
  });

  const [telemetry, setTelemetry] = React.useState<SessionAdaptiveTelemetry | null>(() => {
    return storedInitial?.telemetry || null;
  });

  const [isVoiceMode, setIsVoiceMode] = React.useState<boolean>(() => {
    return storedInitial?.isVoiceMode ?? false;
  });

  const [activeLayout, setActiveLayout] = React.useState<"dual-pane" | "stream">(() => {
    return storedInitial?.activeLayout || "dual-pane";
  });

  const [isImmersiveMode, setIsImmersiveMode] = React.useState<boolean>(() => {
    return storedInitial?.isImmersiveMode ?? true;
  });

  const [error, setError] = React.useState<string | null>(null);
  const [lastFailedMessage, setLastFailedMessage] = React.useState<string | null>(null);
  const [sessionRestoredNotice, setSessionRestoredNotice] = React.useState<string | null>(() => {
    if (storedInitial && storedInitial.messages?.length > 1) {
      return "Session restored from exact point of interruption.";
    }
    return null;
  });

  // Persona name resolution
  const personaDisplayName = React.useMemo(() => {
    const p = session?.persona || storedInitial?.persona || "tech-grinder";
    if (p === "hr-partner") return "Sarah Jenkins (HR)";
    if (p === "simulation-boss") return "Marcus Sterling (VP)";
    if (p === "supportive-mentor") return "Elena Rostova (Staff)";
    return "Alex Vance (Lead)";
  }, [session?.persona, storedInitial?.persona]);

  // Spoken message tracking for Hands-Free Speech Flow
  const spokenMessageIdsRef = React.useRef<Set<string>>(new Set());

  // Text-To-Speech Interviewer Engine
  const tts = useTextToSpeech({
    defaultAutoPlay: true,
    defaultRate: 1.0,
    personaId: session?.persona || "tech-grinder",
  });

  // Vercel AI SDK useChat integration for Edge-powered low-latency real-time streaming
  const {
    messages: chatMessages,
    isLoading: isStreaming,
    setMessages: setChatMessages,
    append,
  } = useChat({
    api: `/api/interviews/${encodeURIComponent(interviewId)}/chat`,
    body: {
      sessionId: interviewId,
      role: session?.role || storedInitial?.personaDisplayName || "Full Stack AI Engineer",
      seniority: session?.jd_data?.seniority_level || "Senior",
      interviewType: session?.type || "technical",
      persona: personaDisplayName,
      jdData: session?.jd_data,
    },
    initialMessages:
      storedInitial?.messages && storedInitial.messages.length > 0
        ? storedInitial.messages.map((m, i) => ({
            id: m.id || `msg-${i}`,
            role: (m.role === "assistant" || m.role === "interviewer" || m.role === "system"
              ? "assistant"
              : "user") as "assistant" | "user",
            content: m.content,
          }))
        : [
            {
              id: "initial-greeting",
              role: "assistant",
              content:
                "Hello! I am your AI Interviewer today. Welcome to your mock interview session.\n\nTo get started, please tell me a bit about your background or simply say \"Ready\" when you would like me to ask the first question.",
            },
          ],
    onFinish: (message) => {
      // Auto-speak new response when completed
      if (tts.autoPlayEnabled && !tts.isMuted) {
        tts.speak(message.content);
      }
    },
    onError: (err) => {
      setError(`Stream connection error: ${err.message || "Failed to complete streaming response."}`);
    },
  });

  // Format Vercel AI SDK messages for UI chat frames
  const messages: ChatMessage[] = React.useMemo(() => {
    return chatMessages.map((m) => ({
      id: m.id,
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content,
      timestamp: m.createdAt ? new Date(m.createdAt) : new Date(),
    }));
  }, [chatMessages]);

  const isLoading = isStreaming;

  // Unified persistent session management: tracks elapsed time and persists state
  const { elapsedSeconds, questionIndex, setQuestionIndex } = useInterviewSessionPersistence({
    sessionId: interviewId,
    messages,
    telemetry,
    persona: session?.persona || storedInitial?.persona || "tech-grinder",
    personaDisplayName,
    activeLayout,
    isImmersiveMode,
    isVoiceMode,
  });

  const [hasSubmittedAnswer, setHasSubmittedAnswer] = React.useState<boolean>(false);

  // 1. Array Content Pointer Synchronization:
  // Map questionIndex cleanly to array index 0..4 (5th element = index 4)
  const arrayIndex = React.useMemo(() => {
    const idx = questionIndex >= 1 && questionIndex <= INTERVIEW_QUESTIONS.length
      ? questionIndex - 1
      : questionIndex;
    return Math.max(0, Math.min(idx, INTERVIEW_QUESTIONS.length - 1));
  }, [questionIndex]);

  // Active question text object from 5-element INTERVIEW_QUESTIONS array
  const activeQuestionTextObject = INTERVIEW_QUESTIONS[arrayIndex] || INTERVIEW_QUESTIONS[0];

  // Active Question Prompt State Variable:
  // Pulls specific AI stream message for current index or the 5th element closing script for index 4
  const activePrompt = React.useMemo(() => {
    const aiMessages = messages.filter(
      (m) => m.role === "assistant" || m.role === "interviewer" || m.role === "system"
    );
    const specificAiMessage = aiMessages[arrayIndex]?.content;
    if (specificAiMessage && specificAiMessage.trim().length > 0) {
      return specificAiMessage.trim();
    }
    return activeQuestionTextObject.prompt;
  }, [messages, arrayIndex, activeQuestionTextObject]);

  // Latest AI message text for quick replay
  const latestAiMessage = React.useMemo(() => {
    const aiMsgs = messages.filter(
      (m) => m.role === "assistant" || m.role === "interviewer" || m.role === "system"
    );
    return aiMsgs.length > 0 ? aiMsgs[aiMsgs.length - 1] : null;
  }, [messages]);

  // Handle successful completion of Pre-Flight Check
  const handlePreFlightProceed = (results: PreFlightCheckResults) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(`preflight_cleared_${interviewId}`, "true");
    }
    setShowPreFlightModal(false);

    // Speak initial greeting smoothly once pre-flight is cleared
    if (activePrompt && tts.autoPlayEnabled && !tts.isMuted) {
      setTimeout(() => {
        tts.speak(activePrompt);
      }, 400);
    }
  };

  // 2. Text-to-Speech Trigger on Text Change:
  // Bind speech synthesis trigger (tts.speak(activePrompt)) directly to activePrompt state variable
  const lastSpokenPromptRef = React.useRef<string>("");

  React.useEffect(() => {
    if (activeLayout === "dual-pane") return; // DualPaneWorkspace handles its speech locally
    if (showPreFlightModal) return; // Do not speak while preflight diagnostic is active
    if (!tts.autoPlayEnabled || tts.isMuted) return;
    if (!activePrompt || !activePrompt.trim()) return;

    if (lastSpokenPromptRef.current !== activePrompt) {
      lastSpokenPromptRef.current = activePrompt;
      tts.stop();
      const timer = setTimeout(() => {
        tts.speak(activePrompt);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [activeLayout, activePrompt, showPreFlightModal, tts.autoPlayEnabled, tts.isMuted]);

  // Load existing session, messages, and initial telemetry
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    let isMounted = true;

    async function loadSessionData() {
      try {
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("ascendx_active_session_id", interviewId);
          } catch {}
        }

        const [sessionRes, telemetryRes] = await Promise.all([
          fetch(`/api/interviews/${encodeURIComponent(interviewId)}`),
          fetch(`/api/interviews/${encodeURIComponent(interviewId)}/telemetry`),
        ]);

        let hasLoadedHistory = false;

        if (sessionRes.ok) {
          const data = await sessionRes.json();
          if (isMounted) {
            if (data.session) {
              setSession(data.session);
              if (data.session.status === "completed") {
                markSessionCompleted(interviewId);
                clearActiveSession();
              }
              if (data.session.modality === "voice") {
                setIsVoiceMode(true);
              }
            }
            if (Array.isArray(data.messages) && data.messages.length > 0) {
              hasLoadedHistory = true;
              setChatMessages(
                data.messages.map((m: any, i: number) => ({
                  id: m.id || `msg-${i}`,
                  role: (m.sender_role === "ai" ? "assistant" : "user") as "assistant" | "user",
                  content: m.content,
                  createdAt: m.created_at ? new Date(m.created_at) : new Date(),
                }))
              );
            }
          }
        }

        if (telemetryRes.ok) {
          const teleData = await telemetryRes.json();
          if (isMounted && teleData.telemetry) {
            setTelemetry(teleData.telemetry);
          }
        }

        // Check if there is local draft cache or active database session
        if (typeof window !== "undefined" && isMounted) {
          const draftKey = `ascendx_interview_draft_${interviewId}`;
          const localDraft = localStorage.getItem(draftKey);
          if (hasLoadedHistory || (localDraft && localDraft.trim().length > 0)) {
            setSessionRestoredNotice("Active session state and conversation history restored from database & local cache.");
          }
        }
      } catch (err) {
        console.warn("Could not preload session messages or telemetry:", err);
      }
    }

    loadSessionData();
    if (interviewId) {
      router.prefetch(`/interview/${encodeURIComponent(interviewId)}/feedback`);
    }
    return () => {
      isMounted = false;
      tts.stop();
    };
  }, [interviewId]);

  // Auto-scroll container as messages arrive or loading status changes
  const { containerRef, bottomRef } = useAutoScroll([
    messages,
    isLoading,
    error,
  ]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    // Stop ongoing speech before user speaks/sends
    tts.stop();
    setError(null);
    setLastFailedMessage(null);
    setHasSubmittedAnswer(true);

    try {
      await append({
        role: "user",
        content: content.trim(),
      });
    } catch (err: any) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Streaming connection issue. Please try again.";
      setError(`Failed to receive response: ${errorMessage}`);
      setLastFailedMessage(content);
      setHasSubmittedAnswer(false);
    }
  };

  const handleNextQuestion = async (targetIndex?: number, phaseTitle?: string) => {
    tts.stop();
    const nextIdx = targetIndex ?? (questionIndex + 1);
    setQuestionIndex(nextIdx);
    setHasSubmittedAnswer(false);
    setError(null);

    const phaseMap: Record<number, string> = {
      1: "Introduction & Technical Context",
      2: "Core Technical & Algorithmic Problem Solving",
      3: "High-Scale Concurrency & System Architecture",
      4: "Behavioral & Situational (STAR Framework)",
      5: "Candidate Questions & Wrap-Up",
    };
    const phase = phaseTitle || phaseMap[nextIdx] || "Technical & Behavioral Assessment";

    try {
      await append({
        role: "user",
        content: `[Proceed to Question ${nextIdx}: ${phase}] Please present the question for this phase to the candidate.`,
      });
    } catch (err: any) {
      console.warn("Could not load subsequent question:", err);
      setError("Failed to load subsequent question. Please retry.");
    }
  };

  const handleRetry = () => {
    if (lastFailedMessage) {
      handleSendMessage(lastFailedMessage);
    } else {
      setError(null);
    }
  };

  const handleEndSession = () => {
    // 1. Mark session completed and clear active session pointer from localStorage
    markSessionCompleted(interviewId);
    clearActiveSession();

    // 2. Explicitly halt text-to-speech audio synthesis
    tts.stop();

    // 3. Terminate all active camera and microphone tracks & release hardware indicators
    terminateAllActiveMediaStreams();

    // 4. Navigate to feedback report
    const targetUrl = `/interview/${encodeURIComponent(interviewId)}/feedback`;
    router.push(targetUrl);
  };

  // Teardown all media streams upon unmount or page exit
  React.useEffect(() => {
    return () => {
      terminateAllActiveMediaStreams();
    };
  }, []);

  return (
    <div className="flex h-screen w-full flex-col bg-[#0B0F15] text-slate-100 transition-colors duration-300 overflow-hidden">
      {/* ── Top Session Header (Hidden when in immersive Dual-Pane mode, accessible in classic stream mode or toggleable) ── */}
      {(!isImmersiveMode || activeLayout === "stream") && (
        <header className="flex shrink-0 items-center justify-between border-b border-slate-200/80 dark:border-[#222B3A] bg-white/80 dark:bg-[#151922]/80 px-4 py-2.5 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="gap-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            </Button>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#E8602E] to-[#F17E45] text-white shadow-2xs">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-bold sm:text-base text-slate-900 dark:text-white">
                    {session?.role ? `${session.role} Interview` : "Adaptive AI Mock Interview"}
                  </h1>
                  <span className="inline-flex items-center rounded-full bg-[#FFF7ED] dark:bg-[#2A1D17] border border-[#FDBA74]/80 dark:border-[#EA580C]/40 px-2.5 py-0.5 text-[10px] font-bold text-[#C2410C] dark:text-[#FB923C]">
                    {session?.difficulty ? `${session.difficulty.toUpperCase()}` : "ADAPTIVE"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Session ID: <span className="font-mono">{interviewId}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Layout switcher: Dual-Pane vs Stream */}
            <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => {
                  setActiveLayout("dual-pane");
                  setIsImmersiveMode(true);
                }}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                  activeLayout === "dual-pane"
                    ? "bg-gradient-to-r from-[#E8602E] to-[#F17E45] text-white shadow-2xs"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                )}
                title="Interactive Dual-Pane Mock Interview Workspace"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Dual-Pane</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveLayout("stream");
                  setIsImmersiveMode(false);
                }}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                  activeLayout === "stream"
                    ? "bg-white dark:bg-[#181E29] text-slate-900 dark:text-white shadow-2xs"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                )}
                title="Classic Conversation Feed"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Feed</span>
              </button>
            </div>

            <div className="hidden items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 md:flex bg-white/80 dark:bg-[#1C2230]/80 px-2.5 py-1 rounded-full border border-slate-200/80 dark:border-slate-700/80">
              <Zap className="h-3.5 w-3.5 text-[#E87A42]" />
              <span>Adaptive Engine Live</span>
            </div>

            {/* Pre-Flight Diagnostic Trigger */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreFlightModal(true)}
              className="gap-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-[#181E29] border-slate-200 dark:border-slate-800 hover:bg-[#FFF6F0] dark:hover:bg-[#2A1D17] hover:text-[#E8602E] transition-colors cursor-pointer shadow-2xs"
              title="Run Pre-Flight Hardware & Network Diagnostics"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-[#E8602E]" />
              <span className="hidden sm:inline">Pre-Flight</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleEndSession}
              className="gap-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-[#181E29] border-slate-200 dark:border-slate-800 hover:bg-[#FFF6F0] dark:hover:bg-[#2A1D17] hover:text-[#E8602E] transition-colors cursor-pointer shadow-2xs"
            >
              <Award className="h-3.5 w-3.5 text-[#E8602E]" />
              <span>End & View Feedback</span>
            </Button>
          </div>
        </header>
      )}

      {/* ── Real-Time Adaptive Difficulty & Telemetry HUD (Shown only in classic stream mode) ── */}
      {(!isImmersiveMode || activeLayout === "stream") && (
        <div className="px-4 sm:px-6 md:px-8 pt-3 pb-1 max-w-4xl mx-auto w-full space-y-2">
          {sessionRestoredNotice && (
            <div className="flex items-center justify-between gap-2.5 px-3.5 py-2 rounded-2xl bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/30 text-xs text-blue-900 dark:text-blue-200 animate-in fade-in duration-300">
              <div className="flex items-center gap-2">
                <RotateCcw className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>{sessionRestoredNotice}</span>
              </div>
              <button
                type="button"
                onClick={() => setSessionRestoredNotice(null)}
                className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          <AdaptiveTelemetryHUD telemetry={telemetry} />

          {/* Visible Adaptation Reason Notification Banner */}
          {telemetry?.branchDescription && (
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent dark:from-amber-500/15 dark:via-orange-500/15 border border-amber-500/30 dark:border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 shadow-2xs animate-in fade-in slide-in-from-top-1 duration-300">
              <Sparkles className="h-4 w-4 shrink-0 text-[#E8602E] animate-pulse" />
              <div className="flex-1 font-medium leading-relaxed">
                <span className="font-extrabold mr-1 text-[#E8602E]">AI Adaptation Rationale:</span>
                <span>{telemetry.branchDescription}</span>
              </div>
              <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/80 dark:bg-[#1C2230] text-amber-700 dark:text-amber-300 font-bold border border-amber-500/20 shadow-2xs">
                Live Shift
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── Active Interview Body: Dual-Pane High-Tech Console vs Classic Stream Feed ── */}
      {activeLayout === "dual-pane" ? (
        <div className="flex-1 h-full w-full flex flex-col justify-start overflow-hidden">
          <DualPaneWorkspace
            sessionRole={session?.role || session?.jd_data?.job_title || "Full Stack AI Engineer"}
            personaDisplayName={personaDisplayName}
            latestAiMessage={latestAiMessage}
            messages={messages}
            telemetry={telemetry}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            onNextQuestion={handleNextQuestion}
            hasSubmittedAnswer={hasSubmittedAnswer}
            onAnswerSubmittedChange={setHasSubmittedAnswer}
            onEndSession={handleEndSession}
            isImmersive={isImmersiveMode}
            onToggleImmersive={() => setIsImmersiveMode(!isImmersiveMode)}
            sessionId={interviewId}
            elapsedSeconds={elapsedSeconds}
            questionIndex={questionIndex}
            jdData={session?.jd_data}
            tts={tts}
          />
        </div>
      ) : (
        <>
          {/* ── Scrollable Chat Messages Area ── */}
          <main
            ref={containerRef}
            className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 md:px-8"
            aria-label="Interview Conversation"
          >
            <div className="mx-auto max-w-4xl space-y-4">
              {/* Session & JD Grounding Banner */}
              {session?.jd_data ? (
                <div className="rounded-2xl border border-[#FDBA74]/80 dark:border-[#EA580C]/40 bg-[#FFF7ED]/90 dark:bg-[#2A1D17]/80 p-3.5 text-xs text-[#9A3412] dark:text-[#FDBA74] shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between font-bold">
                    <div className="flex items-center gap-1.5">
                      <Target className="h-4 w-4 text-[#E8602E]" />
                      <span>JD Calibrated: {session.jd_data.job_title} {session.jd_data.company_name ? `(${session.jd_data.company_name})` : ""}</span>
                    </div>
                    <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-[#E8602E] text-white">
                      {session.jd_data.seniority_level}
                    </span>
                  </div>
                  <p className="text-[11px] opacity-90 leading-relaxed">
                    Questions are strictly grounded in target criteria: {session.jd_data.required_skills?.slice(0, 5).join(", ")}.
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-[#151922]/80 p-3 text-center text-xs text-slate-600 dark:text-slate-400 shadow-2xs">
                  <p className="flex items-center justify-center gap-1.5 font-medium">
                    <Clock className="h-3.5 w-3.5 text-[#E8602E]" />
                    Real-time adaptive difficulty is active. Answers are scored live across concurrency, system design, and STAR framework dimensions.
                  </p>
                </div>
              )}

              {/* Render All Chat Messages */}
              {messages.map((msg, index) => (
                <ChatBubble
                  key={msg.id || `msg-${index}`}
                  message={msg}
                />
              ))}

              {/* AI Typing Indicator with Adaptive Evaluation Note */}
              {isLoading && (
                <div className="flex w-full items-start gap-3 py-2">
                  <div
                    aria-hidden="true"
                    className="flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-2xl bg-gradient-to-tr from-[#E8602E] to-[#F17E45] text-white shadow-xs"
                  >
                    <Bot className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center gap-1 px-1 text-xs text-slate-500 dark:text-slate-400">
                      <Sparkles className="h-3 w-3 text-[#E8602E]" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        AscendX Adaptive Engine
                      </span>
                      <span className="text-[11px] text-slate-500">evaluating competency matrix & branching...</span>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-xs border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#181E29] px-4 py-3.5 shadow-2xs">
                      <span className="h-2 w-2 rounded-full bg-[#E8602E] animate-bounce [animation-delay:-0.3s]" />
                      <span className="h-2 w-2 rounded-full bg-[#E8602E] animate-bounce [animation-delay:-0.15s]" />
                      <span className="h-2 w-2 rounded-full bg-[#E8602E] animate-bounce" />
                    </div>
                  </div>
                </div>
              )}

              {/* Inline Error Message */}
              {error && (
                <div className="flex items-center justify-between rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-sm text-rose-600 dark:text-rose-400 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span className="font-medium">{error}</span>
                  </div>
                  {lastFailedMessage && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleRetry}
                      disabled={isLoading}
                      className="shrink-0 gap-1.5 border-rose-500/40 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-500/15"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Retry
                    </Button>
                  )}
                </div>
              )}

              {/* Bottom scroll marker */}
              <div ref={bottomRef} className="h-1" />
            </div>
          </main>

          {/* ── Fixed Bottom Message Input / Voice Workspace (Stream layout) ── */}
          <div className="bg-white/90 dark:bg-[#151922]/90 border-t border-slate-200/80 dark:border-[#222B3A] backdrop-blur-md">
            {isVoiceMode ? (
              <div className="max-w-4xl mx-auto p-3 sm:p-4">
                <LiveVoiceWorkspace
                  onSendAnswer={handleSendMessage}
                  disabled={isLoading}
                  contextRole={session?.role}
                  onSwitchToTextMode={() => setIsVoiceMode(false)}
                  questionIndex={arrayIndex + 1}
                  questionTitle={activeQuestionTextObject.title}
                  questionPrompt={activePrompt}
                  onNextQuestion={() => handleNextQuestion()}
                  hasSubmittedAnswer={hasSubmittedAnswer}
                />
              </div>
            ) : (
              <InterviewInput
                onSend={handleSendMessage}
                onNextQuestion={() => handleNextQuestion()}
                hasSubmittedAnswer={hasSubmittedAnswer}
                questionIndex={questionIndex}
                disabled={isLoading}
                onToggleVoiceMode={() => setIsVoiceMode(true)}
                isVoiceMode={isVoiceMode}
                sessionId={interviewId}
                placeholder="Type your answer... (Press Enter to send, Shift+Enter for new line)"
              />
            )}
          </div>
        </>
      )}

      {/* ── Automated Pre-Flight Check Diagnostic Modal ── */}
      <PreFlightModal
        isOpen={showPreFlightModal}
        sessionRole={session?.role || "Software Engineering"}
        interviewType={session?.type || "Technical"}
        defaultAudioOnly={!isVoiceMode}
        onProceed={handlePreFlightProceed}
        onClose={() => setShowPreFlightModal(false)}
      />
    </div>
  );
}

export default function InterviewPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#ECEEF2] dark:bg-[#0B0F15]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#E87A42]" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              Loading interview simulation room...
            </p>
          </div>
        </div>
      }
    >
      <InterviewPageContent />
    </React.Suspense>
  );
}

