
import { EQAnswers, EQScores } from "@/types/eq";
import { eqQuestions } from "@/data/eqQuestions";

export function calculateEQScores(answers: EQAnswers): EQScores {
  const domainScores: Record<string, number[]> = {
    "Self-Awareness": [],
    "Self-Regulation": [],
    "Motivation": [],
    "Empathy": [],
    "Social Skills": [],
  };

  eqQuestions.forEach((q, i) => {
    let value = answers[i] ?? 4;
    if (q.reverse) value = 8 - value;
    domainScores[q.domain].push(value);
  });

  const result: EQScores = {};
  Object.keys(domainScores).forEach((domain) => {
    result[domain] = Math.round(
      domainScores[domain].reduce((a, b) => a + b, 0) / domainScores[domain].length
    );
  });

  return result;
}
