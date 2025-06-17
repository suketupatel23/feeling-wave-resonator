
import React from "react";
import { CheckCircle } from "lucide-react";
import { Answers } from "@/types/personality";

interface QuestionNavigationProps {
  questionsCount: number;
  currentQuestion: number;
  answers: Answers;
  onQuestionSelect: (index: number) => void;
}

const QuestionNavigation: React.FC<QuestionNavigationProps> = ({
  questionsCount,
  currentQuestion,
  answers,
  onQuestionSelect,
}) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {Array.from({ length: questionsCount }, (_, idx) => (
        <button
          key={idx}
          onClick={() => onQuestionSelect(idx)}
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
  );
};

export default QuestionNavigation;
