
import React from "react";
import { Progress } from "@/components/ui/progress";

interface EQProgressProps {
  answeredCount: number;
  totalQuestions: number;
}

const EQProgress: React.FC<EQProgressProps> = ({
  answeredCount,
  totalQuestions,
}) => {
  const progress = (answeredCount / totalQuestions) * 100;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-600">
          Progress: {answeredCount} of {totalQuestions} questions
        </span>
        <span className="text-sm font-medium text-indigo-600">
          {Math.round(progress)}% Complete
        </span>
      </div>
      <Progress value={progress} className="h-3" />
    </div>
  );
};

export default EQProgress;
