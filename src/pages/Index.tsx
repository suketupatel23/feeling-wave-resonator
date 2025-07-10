
import React, { useState } from "react";
import QuestionSelector from "../components/QuestionSelector";
import EmotionWheel from "../components/EmotionWheel";
import HalftoneWave from "../components/HalftoneWave";
import { useAuth } from "@/hooks/useAuth";
import UserMenu from "@/components/UserMenu";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [selectedQuestion, setSelectedQuestion] = useState<string>("");
  const [selectedEmotion, setSelectedEmotion] = useState<string>("");
  const [showWave, setShowWave] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const handleQuestionSelect = (question: string) => {
    setSelectedQuestion(question);
  };

  const handleEmotionSelect = (emotion: string) => {
    setSelectedEmotion(emotion);
    setShowWave(true);
  };

  const handleWaveExit = async (meditationLength: number) => {
    if (user) {
      try {
        const { count, error: countError } = await supabase
          .from("realizations")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("emotion", selectedEmotion);

        if (countError) throw countError;

        const frequency = (count ?? 0) + 1;

        const { error: insertError } = await supabase.from("realizations").insert({
          user_id: user.id,
          prompt: selectedQuestion,
          emotion: selectedEmotion,
          frequency,
          meditation_length: meditationLength,
        });

        if (insertError) throw insertError;
        
      } catch (error) {
        console.error("Error saving realization:", error);
        // We could add a user-facing notification here in the future.
      }
    }

    setShowWave(false);
    setSelectedEmotion("");
    setSelectedQuestion("");
    navigate("/realizations");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 relative overflow-hidden">
      {showWave && (
        <HalftoneWave 
          selectedQuestion={selectedQuestion}
          selectedEmotion={selectedEmotion}
          onExit={handleWaveExit}
        />
      )}

      <div className="container mx-auto px-4 py-8 relative z-10">
        <header className="text-center mb-12">
          <div className="flex justify-between items-center">
            <div>
              {user && (
                <button
                  className="text-primary underline font-medium mr-5"
                  onClick={() => navigate("/realizations")}
                >
                  My Realizations
                </button>
              )}
            </div>
            <div>
              {loading ? null : user ? (
                <UserMenu />
              ) : (
                <button
                  className="text-primary underline font-medium"
                  onClick={() => navigate("/auth")}
                >
                  Login / Signup
                </button>
              )}
            </div>
          </div>
          <h1 className="text-6xl font-serif font-bold text-primary mb-6 tracking-tight">
            Emotional Sublation
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-4">
            Ruminate and transcend your emotional state through tonal supported meditation
          </p>
          <button
            className="text-primary underline font-medium text-lg hover:text-primary/80 transition-colors"
            onClick={() => navigate("/realizations")}
          >
            Self Realizations
          </button>
        </header>

        {!selectedQuestion ? (
          <QuestionSelector onQuestionSelect={handleQuestionSelect} />
        ) : (
          <EmotionWheel 
            selectedQuestion={selectedQuestion}
            onEmotionSelect={handleEmotionSelect}
            onReset={() => setSelectedQuestion("")}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
