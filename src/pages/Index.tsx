
import { useState } from "react";
import QuestionSelector from "../components/QuestionSelector";
import EmotionWheel from "../components/EmotionWheel";
import HalftoneWave from "../components/HalftoneWave";

const Index = () => {
  const [selectedQuestion, setSelectedQuestion] = useState<string>("");
  const [selectedEmotion, setSelectedEmotion] = useState<string>("");
  const [showWave, setShowWave] = useState(false);

  const handleQuestionSelect = (question: string) => {
    setSelectedQuestion(question);
  };

  const handleEmotionSelect = (emotion: string) => {
    setSelectedEmotion(emotion);
    setShowWave(true);
    
    // Reset after animation
    setTimeout(() => {
      setShowWave(false);
      setSelectedEmotion("");
      setSelectedQuestion("");
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 relative overflow-hidden">
      {showWave && (
        <HalftoneWave 
          selectedQuestion={selectedQuestion}
          selectedEmotion={selectedEmotion}
        />
      )}
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            SelfAware
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore your emotions through an interactive healing experience
          </p>
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
