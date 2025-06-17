
import React from "react";
import { Progress } from "@/components/ui/progress";

interface PersonalityProgressProps {
  answeredCount: number;
  totalQuestions: number;
}

const PersonalityProgress: React.FC<PersonalityProgressProps> = ({
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
        <span className="text-sm font-medium text-blue-600">
          {Math.round(progress)}% Complete
        </span>
      </div>
      <Progress value={progress} className="h-3" />
    </div>
  );
};

export default PersonalityProgress;
