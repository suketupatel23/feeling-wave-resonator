
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";

// Big Five 10-Item Personality Test (TIPI - short and public domain)
const questions = [
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

const options = [
  { label: "Disagree Strongly", value: 1 },
  { label: "Disagree Moderately", value: 2 },
  { label: "Disagree a little", value: 3 },
  { label: "Neither agree nor disagree", value: 4 },
  { label: "Agree a little", value: 5 },
  { label: "Agree moderately", value: 6 },
  { label: "Agree strongly", value: 7 },
];

type Answers = Record<number, number>;

const traitEmotions: Record<string, string[]> = {
  Extraversion: ["Excitement", "Joy", "Enthusiasm", "Optimism"],
  Agreeableness: ["Trust", "Compassion", "Empathy", "Warmth"],
  Conscientiousness: ["Determination", "Confidence", "Pride", "Guilt (if low)"],
  "Emotional Stability": ["Calm", "Contentment", "Resilience", "Anxiety (if low)"],
  Openness: ["Curiosity", "Awe", "Creativity", "Surprise"],
};

function calcScores(answers: Answers) {
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
  const result: Record<string, number> = {};
  Object.keys(sum).forEach((trait) => {
    result[trait] = Math.round(
      sum[trait].reduce((a, b) => a + b, 0) / sum[trait].length
    );
  });
  return result;
}

const PersonalityTest = () => {
  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const allAnswered = Object.keys(answers).length === questions.length;

  const handleSubmit = async () => {
    if (!user || !allAnswered) return;

    const result = calcScores(answers);

    const { error } = await supabase
      .from('personality_test_results')
      .insert({
        user_id: user.id,
        scores: result,
      });

    if (error) {
      console.error('Error saving personality test results:', error);
      // In a future step, we could show a toast notification on error.
    }
    
    setSubmitted(true);
  };

  const result = calcScores(answers);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-8">
      <Card className="max-w-2xl w-full p-8 shadow-lg">
        <Button
          variant="ghost"
          size="sm"
          className="mb-5 flex items-center"
          onClick={() => navigate("/realizations")}
        >
          <ArrowLeft className="mr-2" />
          Back
        </Button>
        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Personality Awareness Test
        </h2>
        {!submitted ? (
          <>
            <ol className="space-y-6 mb-8">
              {questions.map((item, idx) => (
                <li key={idx}>
                  <div className="mb-2 font-medium">{item.q}</div>
                  <div className="flex gap-2 flex-wrap">
                    {options.map((opt) => (
                      <label
                        key={opt.value}
                        className={`cursor-pointer px-2 py-1 rounded ${answers[idx] === opt.value ? "bg-purple-100 font-semibold" : ""}`}
                      >
                        <input
                          type="radio"
                          name={`q-${idx}`}
                          value={opt.value}
                          checked={answers[idx] === opt.value}
                          onChange={() =>
                            setAnswers((a) => ({ ...a, [idx]: opt.value }))
                          }
                          className="mr-1"
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </li>
              ))}
            </ol>
            <Button
              disabled={!allAnswered}
              className="w-full"
              onClick={handleSubmit}
            >
              See my assessment
            </Button>
          </>
        ) : (
          <div>
            <h3 className="text-xl font-bold mb-4 text-center">Your Personality Trait Scores</h3>
            <ul className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.entries(result).map(([trait, score]) => (
                <li
                  key={trait}
                  className="flex flex-col items-center justify-center border rounded px-3 py-2 bg-muted"
                >
                  <span className="font-bold">{trait}:</span>
                  <span className="text-lg">{score} / 7</span>
                </li>
              ))}
            </ul>
            <h4 className="font-medium mb-2">Common Emotions Associated With Your Traits:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.entries(result).map(([trait, score]) => (
                <div key={trait} className="bg-white rounded p-3 border">
                  <div className="font-bold">{trait}</div>
                  <ul className="pl-4 list-disc">
                    {traitEmotions[trait].map((emotion) => (
                      <li key={emotion}>{emotion}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <Button className="mt-8 w-full" onClick={() => navigate("/realizations")}>
              Back to Realizations
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PersonalityTest;
