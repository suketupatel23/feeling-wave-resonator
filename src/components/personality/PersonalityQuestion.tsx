
import React from "react";
import { Button } from "@/components/ui/button";
import { Circle } from "lucide-react";
import { PersonalityQuestion as QuestionType, PersonalityOption, Answers } from "@/types/personality";
import { options } from "@/data/personalityQuestions";

interface PersonalityQuestionProps {
  question: QuestionType;
  questionIndex: number;
  currentAnswer: number | undefined;
  onAnswerSelect: (questionIndex: number, value: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

const PersonalityQuestion: React.FC<PersonalityQuestionProps> = ({
  question,
  questionIndex,
  currentAnswer,
  onAnswerSelect,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <div className="mb-4">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-3">
          {question.trait}
        </span>
        <h3 className="text-lg font-semibold text-gray-800 leading-relaxed">
          {question.q}
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {options.map((opt) => (
          <label
            key={opt.value}
            className={`cursor-pointer p-4 rounded-lg border-2 transition-all hover:border-blue-300 hover:bg-blue-50 ${
              currentAnswer === opt.value
                ? 'border-blue-500 bg-blue-100 ring-2 ring-blue-200'
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-center">
              <input
                type="radio"
                name={`q-${questionIndex}`}
                value={opt.value}
                checked={currentAnswer === opt.value}
                onChange={() => onAnswerSelect(questionIndex, opt.value)}
                className="sr-only"
              />
              <Circle 
                className={`h-5 w-5 mr-3 ${
                  currentAnswer === opt.value 
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

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={!canGoPrevious}
        >
          Previous
        </Button>
        <Button
          onClick={onNext}
          disabled={!canGoNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default PersonalityQuestion;
