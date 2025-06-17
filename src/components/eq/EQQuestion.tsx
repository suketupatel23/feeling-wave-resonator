
import React from "react";
import { Button } from "@/components/ui/button";
import { Circle } from "lucide-react";
import { EQQuestion as EQQuestionType, EQAnswers } from "@/types/eq";
import { eqOptions } from "@/data/eqQuestions";

interface EQQuestionProps {
  question: EQQuestionType;
  questionIndex: number;
  answers: EQAnswers;
  onAnswerSelect: (questionIndex: number, value: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const EQQuestion: React.FC<EQQuestionProps> = ({
  question,
  questionIndex,
  answers,
  onAnswerSelect,
  onPrevious,
  onNext,
  isFirst,
  isLast,
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <div className="mb-4">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mb-3">
          {question.domain}
        </span>
        <h3 className="text-lg font-semibold text-gray-800 leading-relaxed">
          {question.q}
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {eqOptions.map((opt) => (
          <label
            key={opt.value}
            className={`cursor-pointer p-4 rounded-lg border-2 transition-all hover:border-indigo-300 hover:bg-indigo-50 ${
              answers[questionIndex] === opt.value
                ? 'border-indigo-500 bg-indigo-100 ring-2 ring-indigo-200'
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-center">
              <input
                type="radio"
                name={`q-${questionIndex}`}
                value={opt.value}
                checked={answers[questionIndex] === opt.value}
                onChange={() => onAnswerSelect(questionIndex, opt.value)}
                className="sr-only"
              />
              <Circle 
                className={`h-5 w-5 mr-3 ${
                  answers[questionIndex] === opt.value 
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

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={isFirst}
        >
          Previous
        </Button>
        <Button
          onClick={onNext}
          disabled={isLast}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default EQQuestion;
