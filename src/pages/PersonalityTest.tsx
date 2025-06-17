
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, User } from "lucide-react";
import { Answers } from "@/types/personality";
import { questions } from "@/data/personalityQuestions";
import { calcScores } from "@/utils/personalityCalculations";
import PersonalityProgress from "@/components/personality/PersonalityProgress";
import QuestionNavigation from "@/components/personality/QuestionNavigation";
import PersonalityQuestion from "@/components/personality/PersonalityQuestion";
import PersonalityResults from "@/components/personality/PersonalityResults";

const PersonalityTest = () => {
  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
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
              <PersonalityProgress 
                answeredCount={Object.keys(answers).length}
                totalQuestions={questions.length}
              />

              {/* Question Navigation */}
              <QuestionNavigation
                questionsCount={questions.length}
                currentQuestion={currentQuestion}
                answers={answers}
                onQuestionSelect={setCurrentQuestion}
              />

              {/* Current Question */}
              <PersonalityQuestion
                question={questions[currentQuestion]}
                questionIndex={currentQuestion}
                currentAnswer={answers[currentQuestion]}
                onAnswerSelect={handleAnswerSelect}
                onPrevious={() => setCurrentQuestion(prev => Math.max(prev - 1, 0))}
                onNext={() => setCurrentQuestion(prev => Math.min(prev + 1, questions.length - 1))}
                canGoPrevious={currentQuestion > 0}
                canGoNext={currentQuestion < questions.length - 1}
              />

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
              <PersonalityResults 
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

export default PersonalityTest;
