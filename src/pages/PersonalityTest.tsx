import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, User, CheckCircle, Circle, Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";

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
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();

  const allAnswered = Object.keys(answers).length === questions.length;
  const progress = (Object.keys(answers).length / questions.length) * 100;

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
    }
    
    setSubmitted(true);
  };

  const handleAnswerSelect = (questionIndex: number, value: number) => {
    setAnswers((a) => ({ ...a, [questionIndex]: value }));
    
    // Auto-advance to next question if not on last question
    if (questionIndex < questions.length - 1 && questionIndex === currentQuestion) {
      setTimeout(() => {
        setCurrentQuestion(prev => Math.min(prev + 1, questions.length - 1));
      }, 300);
    }
  };

  const result = calcScores(answers);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          size="sm"
          className="mb-6 flex items-center hover:bg-white/50"
          onClick={() => navigate("/realizations")}
        >
          <ArrowLeft className="mr-2" />
          Back to Realizations
        </Button>

        {!submitted ? (
          <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500">
                  <User className="h-8 w-8 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Personality Awareness Test
              </h1>
              <p className="text-gray-600 mt-2">
                Discover your Big Five personality traits
              </p>
            </CardHeader>
            
            <CardContent className="space-y-8">
              {/* Progress Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">
                    Progress: {Object.keys(answers).length} of {questions.length} questions
                  </span>
                  <span className="text-sm font-medium text-blue-600">
                    {Math.round(progress)}% Complete
                  </span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>

              {/* Question Navigation */}
              <div className="flex flex-wrap gap-2 justify-center">
                {questions.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentQuestion(idx)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      answers[idx] !== undefined
                        ? 'bg-green-500 text-white'
                        : currentQuestion === idx
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {answers[idx] !== undefined ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      idx + 1
                    )}
                  </button>
                ))}
              </div>

              {/* Current Question */}
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-3">
                    {questions[currentQuestion].trait}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-800 leading-relaxed">
                    {questions[currentQuestion].q}
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {options.map((opt) => (
                    <label
                      key={opt.value}
                      className={`cursor-pointer p-4 rounded-lg border-2 transition-all hover:border-blue-300 hover:bg-blue-50 ${
                        answers[currentQuestion] === opt.value
                          ? 'border-blue-500 bg-blue-100 ring-2 ring-blue-200'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name={`q-${currentQuestion}`}
                          value={opt.value}
                          checked={answers[currentQuestion] === opt.value}
                          onChange={() => handleAnswerSelect(currentQuestion, opt.value)}
                          className="sr-only"
                        />
                        <Circle 
                          className={`h-5 w-5 mr-3 ${
                            answers[currentQuestion] === opt.value 
                              ? 'text-blue-500 fill-current' 
                              : 'text-gray-400'
                          }`} 
                        />
                        <div className="flex-1 flex justify-between items-center">
                          <span className="font-medium text-gray-700">{opt.label}</span>
                          <span className="text-2xl font-bold text-blue-500">{opt.value}</span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentQuestion(prev => Math.max(prev - 1, 0))}
                    disabled={currentQuestion === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => setCurrentQuestion(prev => Math.min(prev + 1, questions.length - 1))}
                    disabled={currentQuestion === questions.length - 1}
                  >
                    Next
                  </Button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center pt-4">
                <Button
                  disabled={!allAnswered}
                  className="px-8 py-3 text-lg bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                  onClick={handleSubmit}
                >
                  {allAnswered ? 'Complete Assessment' : `Answer ${questions.length - Object.keys(answers).length} more questions`}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="p-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                  Assessment Complete!
                </h2>
                <p className="text-gray-600">Your Personality Profile</p>
              </div>

              {/* Personality Scores */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {Object.entries(result).map(([trait, score]) => {
                  const percentage = (score / 7) * 100;
                  return (
                    <div key={trait} className="bg-white rounded-xl p-6 shadow-sm border">
                      <h4 className="font-bold text-gray-800 mb-3">{trait}</h4>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-bold text-blue-600">{score}</span>
                        <span className="text-sm text-gray-500">/ 7</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                      <div className="mt-2 text-xs text-gray-500">
                        {percentage >= 85 ? 'Very High' : 
                         percentage >= 70 ? 'High' :
                         percentage >= 55 ? 'Moderate' : 
                         percentage >= 40 ? 'Low' : 'Very Low'}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Emotional Associations */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-center text-gray-800">
                  Associated Emotions by Trait
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(traitEmotions).map(([trait, emotions]) => (
                    <div key={trait} className="bg-white rounded-xl p-6 shadow-sm border">
                      <div className="flex items-center mb-3">
                        <Star className="h-5 w-5 text-yellow-500 mr-2" />
                        <h4 className="font-bold text-gray-800">{trait}</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {emotions.map((emotion) => (
                          <span 
                            key={emotion} 
                            className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800"
                          >
                            {emotion}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center mt-8">
                <Button 
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                  onClick={() => navigate("/realizations")}
                >
                  View All Assessments
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PersonalityTest;
