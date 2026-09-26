export interface InterviewQuestion {
  id: string;
  index: number;
  phase: string;
  label: string;
  title: string;
  defaultPrompt: string;
  prompt: string;
}

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: "q1-intro",
    index: 0,
    phase: "Introduction & Context",
    label: "Icebreaker & Background",
    title: "Background & Technical Overview",
    defaultPrompt: "Hello! Welcome to your mock interview session. To kick things off, could you briefly introduce yourself, highlight your core engineering background, and share an impactful project you worked on recently?",
    prompt: "Hello! Welcome to your mock interview session. To kick things off, could you briefly introduce yourself, highlight your core engineering background, and share an impactful project you worked on recently?",
  },
  {
    id: "q2-technical",
    index: 1,
    phase: "Core Technical & Algorithmic",
    label: "Core Technical",
    title: "Algorithmic & Code Architecture",
    defaultPrompt: "Let's dive into the core technical challenge. Suppose you need to build an in-memory cache with an LRU eviction policy supporting O(1) reads and writes under concurrent thread access. Walk me through your design, key data structures, and edge-case synchronization strategies.",
    prompt: "Let's dive into the core technical challenge. Suppose you need to build an in-memory cache with an LRU eviction policy supporting O(1) reads and writes under concurrent thread access. Walk me through your design, key data structures, and edge-case synchronization strategies.",
  },
  {
    id: "q3-system-design",
    index: 2,
    phase: "High-Scale Concurrency & System Design",
    label: "System Design",
    title: "Distributed Scale & Fault Tolerance",
    defaultPrompt: "Now let's scale this up to a distributed environment: Your service now handles 50,000 writes per second distributed across three geographical regions. How do you maintain data consistency, handle network partitions, and minimize replication lag without blocking client latency budgets?",
    prompt: "Now let's scale this up to a distributed environment: Your service now handles 50,000 writes per second distributed across three geographical regions. How do you maintain data consistency, handle network partitions, and minimize replication lag without blocking client latency budgets?",
  },
  {
    id: "q4-behavioral",
    index: 3,
    phase: "Behavioral & Situational (STAR)",
    label: "Behavioral STAR",
    title: "Engineering Conflict & Ownership",
    defaultPrompt: "Using the STAR framework (Situation, Task, Action, Result), tell me about a time you had a strong technical disagreement with a senior engineer or product stakeholder regarding architectural trade-offs. How did you navigate the conversation and what was the measurable outcome?",
    prompt: "Using the STAR framework (Situation, Task, Action, Result), tell me about a time you had a strong technical disagreement with a senior engineer or product stakeholder regarding architectural trade-offs. How did you navigate the conversation and what was the measurable outcome?",
  },
  {
    id: "q5-candidate-questions",
    index: 4,
    phase: "Candidate Questions & Closing Debrief",
    label: "Closing Debrief",
    title: "Closing Debrief & Candidate Inquiries",
    defaultPrompt: "We have reached the final stage of our interview session — the Closing Debrief. I'd love to open the floor to you: What questions do you have for me about our engineering architecture, team operational rhythm, or technology roadmap?",
    prompt: "We have reached the final stage of our interview session — the Closing Debrief. I'd love to open the floor to you: What questions do you have for me about our engineering architecture, team operational rhythm, or technology roadmap?",
  },
];

export const DEFAULT_INTERVIEW_QUESTIONS = INTERVIEW_QUESTIONS;
export const TOTAL_INTERVIEW_QUESTIONS = INTERVIEW_QUESTIONS.length;

export function getInterviewQuestionByIndex(index: number): InterviewQuestion {
  // Support both 0-indexed (0..4) and 1-indexed (1..5) counters cleanly
  const arrayIdx = index >= 1 && index <= INTERVIEW_QUESTIONS.length
    ? index - 1
    : Math.max(0, Math.min(index, INTERVIEW_QUESTIONS.length - 1));
  return INTERVIEW_QUESTIONS[arrayIdx] || INTERVIEW_QUESTIONS[0];
}
