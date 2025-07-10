
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

  const circleColors = [
    "from-violet-400 to-purple-600",
    "from-blue-400 to-indigo-600", 
    "from-teal-400 to-cyan-600",
    "from-emerald-400 to-green-600",
    "from-amber-400 to-orange-600",
    "from-rose-400 to-pink-600"
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Choose what resonates with you right now
        </h2>
        <p className="text-gray-600 text-lg">
          Select the statement that best describes your current emotional state
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 place-items-center">
        {questions.map((question, index) => (
          <div
            key={index}
            onClick={() => onQuestionSelect(question)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={`
              w-40 h-40 rounded-full cursor-pointer transition-all duration-500 transform
              bg-gradient-to-br ${circleColors[index]}
              hover:scale-110 hover:shadow-2xl hover:shadow-purple-300/50
              flex items-center justify-center text-center p-4
              ${hoveredIndex === index ? 'scale-105 shadow-xl shadow-purple-200/60' : ''}
            `}
          >
            <span className="text-white font-medium text-lg leading-tight drop-shadow-lg">
              {question}...
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionSelector;
