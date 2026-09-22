export type PersonaId =
  | "tech-grinder"
  | "hr-partner"
  | "simulation-boss"
  | "supportive-mentor"
  | "skeptical-interrogator";

export interface PersonaDef {
  id: PersonaId;
  name: string;
  title: string;
  avatar: string;
  tagline: string;
  description: string;
}

export const PERSONAS: Record<PersonaId, PersonaDef> = {
  "tech-grinder": {
    id: "tech-grinder",
    name: "Alex Vance",
    title: "Strict Tech Grinder",
    avatar: "💻",
    tagline: "Rigorous & Edge-Case Heavy",
    description: "Probes algorithmic bounds, latency constraints, and implementation specifics.",
  },
  "hr-partner": {
    id: "hr-partner",
    name: "Sarah Jenkins",
    title: "Warm HR Partner",
    avatar: "🤝",
    tagline: "STAR Behavioral Expert",
    description: "Focuses on leadership, cross-functional conflict, culture, and team empathy.",
  },
  "skeptical-interrogator": {
    id: "skeptical-interrogator",
    name: "Dr. Viktor Cole",
    title: "Skeptical Interrogator",
    avatar: "🔬",
    tagline: "Challenger & Proof-Driven",
    description: "Relentlessly challenges assumptions, demands rigorous proofs, and tests failure boundaries.",
  },
  "simulation-boss": {
    id: "simulation-boss",
    name: "Marcus Sterling",
    title: "Simulation AI Boss",
    avatar: "👔",
    tagline: "Executive Architecture & ROI",
    description: "Direct engineering manager probing cost trade-offs, roadmap, and organizational impact.",
  },
  "supportive-mentor": {
    id: "supportive-mentor",
    name: "Elena Rostova",
    title: "Supportive Mentor",
    avatar: "🌱",
    tagline: "Pedagogical & Confidence Booster",
    description: "Guides you through tricky problems with constructive hints, patience, and positive reinforcement.",
  },
};
