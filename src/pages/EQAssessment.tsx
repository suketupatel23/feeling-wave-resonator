
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";

// EQ Assessment Questions based on emotional intelligence domains
const eqQuestions = [
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

const options = [
  { label: "Strongly Disagree", value: 1 },
  { label: "Disagree", value: 2 },
  { label: "Somewhat Disagree", value: 3 },
  { label: "Neutral", value: 4 },
  { label: "Somewhat Agree", value: 5 },
  { label: "Agree", value: 6 },
  { label: "Strongly Agree", value: 7 },
];

type Answers = Record<number, number>;

// Emotion mappings for each EQ domain
const domainEmotions: Record<string, string[]> = {
  "Self-Awareness": ["Mindfulness", "Clarity", "Insight", "Understanding"],
  "Self-Regulation": ["Calm", "Control", "Balance", "Resilience"],
  "Motivation": ["Drive", "Determination", "Optimism", "Persistence"],
  "Empathy": ["Compassion", "Understanding", "Connection", "Sensitivity"],
  "Social Skills": ["Confidence", "Harmony", "Cooperation", "Leadership"],
};

function calculateEQScores(answers: Answers) {
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

  const result: Record<string, number> = {};
  Object.keys(domainScores).forEach((domain) => {
    result[domain] = Math.round(
      domainScores[domain].reduce((a, b) => a + b, 0) / domainScores[domain].length
    );
  });

  return result;
}

const EQAssessment = () => {
  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const allAnswered = Object.keys(answers).length === eqQuestions.length;

  const handleSubmit = async () => {
    if (!user || !allAnswered) return;

    const scores = calculateEQScores(answers);
    
    // Generate emotional insights based on scores
    const insights: Record<string, string[]> = {};
    Object.entries(scores).forEach(([domain, score]) => {
      insights[domain] = domainEmotions[domain];
    });

    const { error } = await supabase
      .from('eq_assessment_results')
      .insert({
        user_id: user.id,
        scores: scores,
        emotional_insights: insights,
      });

    if (error) {
      console.error('Error saving EQ assessment results:', error);
    }
    
    setSubmitted(true);
  };

  const result = calculateEQScores(answers);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-8">
      <Card className="max-w-3xl w-full p-8 shadow-lg">
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
          Emotional Intelligence Assessment
        </h2>
        {!submitted ? (
          <>
            <p className="text-gray-600 mb-6 text-center">
              Rate how well each statement describes you on a scale from 1 (Strongly Disagree) to 7 (Strongly Agree).
            </p>
            <ol className="space-y-6 mb-8">
              {eqQuestions.map((item, idx) => (
                <li key={idx}>
                  <div className="mb-3 font-medium">{item.q}</div>
                  <div className="flex gap-1 flex-wrap">
                    {options.map((opt) => (
                      <label
                        key={opt.value}
                        className={`cursor-pointer px-2 py-1 rounded text-sm ${answers[idx] === opt.value ? "bg-purple-100 font-semibold" : "hover:bg-gray-100"}`}
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
                        {opt.value}
                      </label>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 flex justify-between">
                    <span>Strongly Disagree</span>
                    <span>Strongly Agree</span>
                  </div>
                </li>
              ))}
            </ol>
            <Button
              disabled={!allAnswered}
              className="w-full"
              onClick={handleSubmit}
            >
              See my EQ assessment
            </Button>
          </>
        ) : (
          <div>
            <h3 className="text-xl font-bold mb-4 text-center">Your Emotional Intelligence Scores</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {Object.entries(result).map(([domain, score]) => (
                <div
                  key={domain}
                  className="flex flex-col items-center justify-center border rounded-lg px-4 py-3 bg-muted"
                >
                  <span className="font-bold text-center">{domain}:</span>
                  <span className="text-lg">{score} / 7</span>
                </div>
              ))}
            </div>
            <h4 className="font-medium mb-4 text-center">Associated Emotions by Domain:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {Object.entries(domainEmotions).map(([domain, emotions]) => (
                <div key={domain} className="bg-white rounded-lg p-4 border">
                  <div className="font-bold mb-2">{domain}</div>
                  <div className="flex flex-wrap gap-2">
                    {emotions.map((emotion) => (
                      <span key={emotion} className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm">
                        {emotion}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full" onClick={() => navigate("/realizations")}>
              Back to Realizations
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default EQAssessment;
