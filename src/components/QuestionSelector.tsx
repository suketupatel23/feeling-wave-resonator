
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface QuestionSelectorProps {
  onQuestionSelect: (question: string) => void;
}

const QuestionSelector = ({ onQuestionSelect }: QuestionSelectorProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const questions = [
    "I feel like",
    "I want to feel",
    "I believe I'm",
    "I don't know why I feel",
    "I can't believe how",
    "I don't understand why I'm feeling"
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Choose what resonates with you right now
        </h2>
        <p className="text-gray-600">
          Select the statement that best describes your current emotional state
        </p>
      </div>
      
      <div className="grid gap-4">
        {questions.map((question, index) => (
          <Button
            key={index}
            onClick={() => onQuestionSelect(question)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            variant="outline"
            className={`
              h-16 text-lg font-medium transition-all duration-300 transform
              hover:scale-105 hover:shadow-lg border-2
              ${hoveredIndex === index 
                ? 'border-purple-400 bg-purple-50 text-purple-700' 
                : 'border-gray-200 hover:border-purple-300'
              }
            `}
          >
            {question}...
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuestionSelector;
