import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Brain, CheckCircle, Circle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

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
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();

  const allAnswered = Object.keys(answers).length === eqQuestions.length;
  const progress = (Object.keys(answers).length / eqQuestions.length) * 100;

  const handleSubmit = async () => {
    if (!user || !allAnswered) return;

    const scores = calculateEQScores(answers);
    
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

  const handleAnswerSelect = (questionIndex: number, value: number) => {
    setAnswers((a) => ({ ...a, [questionIndex]: value }));
    
    // Auto-advance to next question if not on last question
    if (questionIndex < eqQuestions.length - 1 && questionIndex === currentQuestion) {
      setTimeout(() => {
        setCurrentQuestion(prev => Math.min(prev + 1, eqQuestions.length - 1));
      }, 300);
    }
  };

  const result = calculateEQScores(answers);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
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
                <div className="p-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500">
                  <Brain className="h-8 w-8 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Emotional Intelligence Assessment
              </h1>
              <p className="text-gray-600 mt-2">
                Discover your emotional strengths and insights
              </p>
            </CardHeader>
            
            <CardContent className="space-y-8">
              {/* Progress Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">
                    Progress: {Object.keys(answers).length} of {eqQuestions.length} questions
                  </span>
                  <span className="text-sm font-medium text-indigo-600">
                    {Math.round(progress)}% Complete
                  </span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>

              {/* Question Navigation */}
              <div className="flex flex-wrap gap-2 justify-center">
                {eqQuestions.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentQuestion(idx)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      answers[idx] !== undefined
                        ? 'bg-green-500 text-white'
                        : currentQuestion === idx
                        ? 'bg-indigo-500 text-white'
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
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mb-3">
                    {eqQuestions[currentQuestion].domain}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-800 leading-relaxed">
                    {eqQuestions[currentQuestion].q}
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {options.map((opt) => (
                    <label
                      key={opt.value}
                      className={`cursor-pointer p-4 rounded-lg border-2 transition-all hover:border-indigo-300 hover:bg-indigo-50 ${
                        answers[currentQuestion] === opt.value
                          ? 'border-indigo-500 bg-indigo-100 ring-2 ring-indigo-200'
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
                              ? 'text-indigo-500 fill-current' 
                              : 'text-gray-400'
                          }`} 
                        />
                        <div className="flex-1 flex justify-between items-center">
                          <span className="font-medium text-gray-700">{opt.label}</span>
                          <span className="text-2xl font-bold text-indigo-500">{opt.value}</span>
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
                    onClick={() => setCurrentQuestion(prev => Math.min(prev + 1, eqQuestions.length - 1))}
                    disabled={currentQuestion === eqQuestions.length - 1}
                  >
                    Next
                  </Button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center pt-4">
                <Button
                  disabled={!allAnswered}
                  className="px-8 py-3 text-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                  onClick={handleSubmit}
                >
                  {allAnswered ? 'Complete Assessment' : `Answer ${eqQuestions.length - Object.keys(answers).length} more questions`}
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
                <p className="text-gray-600">Your Emotional Intelligence Profile</p>
              </div>

              {/* EQ Scores */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {Object.entries(result).map(([domain, score]) => {
                  const percentage = (score / 7) * 100;
                  return (
                    <div key={domain} className="bg-white rounded-xl p-6 shadow-sm border">
                      <h4 className="font-bold text-gray-800 mb-3">{domain}</h4>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-bold text-indigo-600">{score}</span>
                        <span className="text-sm text-gray-500">/ 7</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                      <div className="mt-2 text-xs text-gray-500">
                        {percentage >= 85 ? 'Excellent' : 
                         percentage >= 70 ? 'Strong' :
                         percentage >= 55 ? 'Developing' : 'Growth Area'}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Emotional Insights */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-center text-gray-800">
                  Your Emotional Landscape
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(domainEmotions).map(([domain, emotions]) => (
                    <div key={domain} className="bg-white rounded-xl p-6 shadow-sm border">
                      <h4 className="font-bold text-gray-800 mb-3">{domain}</h4>
                      <div className="flex flex-wrap gap-2">
                        {emotions.map((emotion) => (
                          <span 
                            key={emotion} 
                            className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800"
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
                  className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
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

export default EQAssessment;
