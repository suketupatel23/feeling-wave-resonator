
import { EQQuestion, EQOption } from "@/types/eq";

export const eqQuestions: EQQuestion[] = [
  {
    q: "I am aware of my emotions as I experience them.",
    domain: "Self-Awareness",
    reverse: false,
  },
  {
    q: "I can easily identify what I'm feeling.",
    domain: "Self-Awareness", 
    reverse: false,
  },
  {
    q: "I understand what causes my emotions.",
    domain: "Self-Awareness",
    reverse: false,
  },
  {
    q: "I can control my emotions when I need to.",
    domain: "Self-Regulation",
    reverse: false,
  },
  {
    q: "I remain calm under pressure.",
    domain: "Self-Regulation",
    reverse: false,
  },
  {
    q: "I can bounce back quickly from setbacks.",
    domain: "Self-Regulation",
    reverse: false,
  },
  {
    q: "I am motivated to achieve my goals.",
    domain: "Motivation",
    reverse: false,
  },
  {
    q: "I persist in the face of obstacles.",
    domain: "Motivation",
    reverse: false,
  },
  {
    q: "I am optimistic about the future.",
    domain: "Motivation",
    reverse: false,
  },
  {
    q: "I can easily recognize emotions in others.",
    domain: "Empathy",
    reverse: false,
  },
  {
    q: "I understand how others are feeling.",
    domain: "Empathy",
    reverse: false,
  },
  {
    q: "I can sense when someone is upset.",
    domain: "Empathy",
    reverse: false,
  },
  {
    q: "I communicate effectively with others.",
    domain: "Social Skills",
    reverse: false,
  },
  {
    q: "I can resolve conflicts well.",
    domain: "Social Skills",
    reverse: false,
  },
  {
    q: "I work well in teams.",
    domain: "Social Skills",
    reverse: false,
  },
];

export const eqOptions: EQOption[] = [
  { label: "Strongly Disagree", value: 1 },
  { label: "Disagree", value: 2 },
  { label: "Somewhat Disagree", value: 3 },
  { label: "Neutral", value: 4 },
  { label: "Somewhat Agree", value: 5 },
  { label: "Agree", value: 6 },
  { label: "Strongly Agree", value: 7 },
];

export const domainEmotions: Record<string, string[]> = {
  "Self-Awareness": ["Mindfulness", "Clarity", "Insight", "Understanding"],
  "Self-Regulation": ["Calm", "Control", "Balance", "Resilience"],
  "Motivation": ["Drive", "Determination", "Optimism", "Persistence"],
  "Empathy": ["Compassion", "Understanding", "Connection", "Sensitivity"],
  "Social Skills": ["Confidence", "Harmony", "Cooperation", "Leadership"],
};
