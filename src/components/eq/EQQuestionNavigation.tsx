
import React from "react";
import { CheckCircle } from "lucide-react";
import { EQAnswers } from "@/types/eq";

interface EQQuestionNavigationProps {
  totalQuestions: number;
  answers: EQAnswers;
  currentQuestion: number;
  onQuestionSelect: (index: number) => void;
}

const EQQuestionNavigation: React.FC<EQQuestionNavigationProps> = ({
  totalQuestions,
  answers,
  currentQuestion,
  onQuestionSelect,
}) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {Array.from({ length: totalQuestions }, (_, idx) => (
        <button
          key={idx}
          onClick={() => onQuestionSelect(idx)}
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
  );
};

export default EQQuestionNavigation;
