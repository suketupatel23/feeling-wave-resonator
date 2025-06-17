
import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Star } from "lucide-react";
import { PersonalityScores } from "@/types/personality";
import { traitEmotions } from "@/data/personalityQuestions";

interface PersonalityResultsProps {
  scores: PersonalityScores;
  onBackToAssessments: () => void;
}

const PersonalityResults: React.FC<PersonalityResultsProps> = ({
  scores,
  onBackToAssessments,
}) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="p-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
          Assessment Complete!
        </h2>
        <p className="text-gray-600">Your Personality Profile</p>
      </div>

      {/* Personality Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(scores).map(([trait, score]) => {
          const percentage = (score / 7) * 100;
          return (
            <div key={trait} className="bg-white rounded-xl p-6 shadow-sm border">
              <h4 className="font-bold text-gray-800 mb-3">{trait}</h4>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-blue-600">{score}</span>
                <span className="text-sm text-gray-500">/ 7</span>
              </div>
              <Progress value={percentage} className="h-2" />
              <div className="mt-2 text-xs text-gray-500">
                {percentage >= 85 ? 'Very High' : 
                 percentage >= 70 ? 'High' :
                 percentage >= 55 ? 'Moderate' : 
                 percentage >= 40 ? 'Low' : 'Very Low'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Emotional Associations */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-center text-gray-800">
          Associated Emotions by Trait
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(traitEmotions).map(([trait, emotions]) => (
            <div key={trait} className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center mb-3">
                <Star className="h-5 w-5 text-yellow-500 mr-2" />
                <h4 className="font-bold text-gray-800">{trait}</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {emotions.map((emotion) => (
                  <span 
                    key={emotion} 
                    className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800"
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
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
          onClick={onBackToAssessments}
        >
          View All Assessments
        </Button>
      </div>
    </div>
  );
};

export default PersonalityResults;
