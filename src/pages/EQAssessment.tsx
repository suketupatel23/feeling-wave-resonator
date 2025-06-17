
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Brain } from "lucide-react";
import { EQAnswers } from "@/types/eq";
import { eqQuestions, domainEmotions } from "@/data/eqQuestions";
import { calculateEQScores } from "@/utils/eqCalculations";
import EQProgress from "@/components/eq/EQProgress";
import EQQuestionNavigation from "@/components/eq/EQQuestionNavigation";
import EQQuestion from "@/components/eq/EQQuestion";
import EQResults from "@/components/eq/EQResults";

const EQAssessment = () => {
  const [answers, setAnswers] = useState<EQAnswers>({});
  const [submitted, setSubmitted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();

  const allAnswered = Object.keys(answers).length === eqQuestions.length;

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

  const handlePrevious = () => {
    setCurrentQuestion(prev => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentQuestion(prev => Math.min(prev + 1, eqQuestions.length - 1));
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
              <EQProgress 
                answeredCount={Object.keys(answers).length}
                totalQuestions={eqQuestions.length}
              />

              <EQQuestionNavigation
                totalQuestions={eqQuestions.length}
                answers={answers}
                currentQuestion={currentQuestion}
                onQuestionSelect={setCurrentQuestion}
              />

              <EQQuestion
                question={eqQuestions[currentQuestion]}
                questionIndex={currentQuestion}
                answers={answers}
                onAnswerSelect={handleAnswerSelect}
                onPrevious={handlePrevious}
                onNext={handleNext}
                isFirst={currentQuestion === 0}
                isLast={currentQuestion === eqQuestions.length - 1}
              />

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
              <EQResults 
                scores={result}
                onBackToAssessments={() => navigate("/realizations")}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EQAssessment;
