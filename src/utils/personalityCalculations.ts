
import { Answers, PersonalityScores } from "@/types/personality";
import { questions } from "@/data/personalityQuestions";

export function calcScores(answers: Answers): PersonalityScores {
  const sum: Record<string, number[]> = {
    Extraversion: [],
    Agreeableness: [],
    Conscientiousness: [],
    "Emotional Stability": [],
    Openness: [],
  };
  
  questions.forEach((q, i) => {
    let value = answers[i] ?? 4;
    if (q.reverse) value = 8 - value; // Reverse code as in TIPI
    sum[q.trait].push(value);
  });
  
  const result: PersonalityScores = {};
  Object.keys(sum).forEach((trait) => {
    result[trait] = Math.round(
      sum[trait].reduce((a, b) => a + b, 0) / sum[trait].length
    );
  });
  
  return result;
}
