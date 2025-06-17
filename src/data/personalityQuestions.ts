
import { PersonalityQuestion, PersonalityOption } from "@/types/personality";

// Big Five 10-Item Personality Test (TIPI - short and public domain)
export const questions: PersonalityQuestion[] = [
  {
    q: "I see myself as: Extraverted, enthusiastic.",
    trait: "Extraversion",
    reverse: false,
  },
  {
    q: "I see myself as: Critical, quarrelsome.",
    trait: "Agreeableness",
    reverse: true,
  },
  {
    q: "I see myself as: Dependable, self-disciplined.",
    trait: "Conscientiousness",
    reverse: false,
  },
  {
    q: "I see myself as: Anxious, easily upset.",
    trait: "Emotional Stability",
    reverse: true,
  },
  {
    q: "I see myself as: Open to new experiences, complex.",
    trait: "Openness",
    reverse: false,
  },
  {
    q: "I see myself as: Reserved, quiet.",
    trait: "Extraversion",
    reverse: true,
  },
  {
    q: "I see myself as: Sympathetic, warm.",
    trait: "Agreeableness",
    reverse: false,
  },
  {
    q: "I see myself as: Disorganized, careless.",
    trait: "Conscientiousness",
    reverse: true,
  },
  {
    q: "I see myself as: Calm, emotionally stable.",
    trait: "Emotional Stability",
    reverse: false,
  },
  {
    q: "I see myself as: Conventional, uncreative.",
    trait: "Openness",
    reverse: true,
  },
];

export const options: PersonalityOption[] = [
  { label: "Disagree Strongly", value: 1 },
  { label: "Disagree Moderately", value: 2 },
  { label: "Disagree a little", value: 3 },
  { label: "Neither agree nor disagree", value: 4 },
  { label: "Agree a little", value: 5 },
  { label: "Agree moderately", value: 6 },
  { label: "Agree strongly", value: 7 },
];

export const traitEmotions: Record<string, string[]> = {
  Extraversion: ["Excitement", "Joy", "Enthusiasm", "Optimism"],
  Agreeableness: ["Trust", "Compassion", "Empathy", "Warmth"],
  Conscientiousness: ["Determination", "Confidence", "Pride", "Guilt (if low)"],
  "Emotional Stability": ["Calm", "Contentment", "Resilience", "Anxiety (if low)"],
  Openness: ["Curiosity", "Awe", "Creativity", "Surprise"],
};
