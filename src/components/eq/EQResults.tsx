
import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle } from "lucide-react";
import { EQScores } from "@/types/eq";
import { domainEmotions } from "@/data/eqQuestions";

interface EQResultsProps {
  scores: EQScores;
  onBackToAssessments: () => void;
}

const EQResults: React.FC<EQResultsProps> = ({ scores, onBackToAssessments }) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="p-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
          Assessment Complete!
        </h2>
        <p className="text-gray-600">Your Emotional Intelligence Profile</p>
      </div>

      {/* EQ Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(scores).map(([domain, score]) => {
          const percentage = (score / 7) * 100;
          return (
            <div key={domain} className="bg-white rounded-xl p-6 shadow-sm border">
              <h4 className="font-bold text-gray-800 mb-3">{domain}</h4>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-indigo-600">{score}</span>
                <span className="text-sm text-gray-500">/ 7</span>
              </div>
              <Progress value={percentage} className="h-2" />
              <div className="mt-2 text-xs text-gray-500">
                {percentage >= 85 ? 'Excellent' : 
                 percentage >= 70 ? 'Strong' :
                 percentage >= 55 ? 'Developing' : 'Growth Area'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Emotional Insights */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-center text-gray-800">
          Your Emotional Landscape
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(domainEmotions).map(([domain, emotions]) => (
            <div key={domain} className="bg-white rounded-xl p-6 shadow-sm border">
              <h4 className="font-bold text-gray-800 mb-3">{domain}</h4>
              <div className="flex flex-wrap gap-2">
                {emotions.map((emotion) => (
                  <span 
                    key={emotion} 
                    className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800"
                  >
                    {emotion}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <Button 
          className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
          onClick={onBackToAssessments}
        >
          View All Assessments
        </Button>
      </div>
    </div>
  );
};

export default EQResults;
