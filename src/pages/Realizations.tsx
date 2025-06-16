
import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { emotions } from "@/data/emotions";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type Realization = {
  id: string;
  prompt: string;
  emotion: string;
  frequency: number;
  meditation_length: number;
  created_at: string;
};

type PersonalityTestResult = {
  id: string;
  created_at: string;
  scores: Record<string, number>;
};

type EQAssessmentResult = {
  id: string;
  created_at: string;
  scores: Record<string, number>;
  emotional_insights: Record<string, string[]>;
};

const Realizations = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [realizations, setRealizations] = useState<Realization[]>([]);
  const [fetching, setFetching] = useState(true);
  const [personalityTestHistory, setPersonalityTestHistory] = useState<PersonalityTestResult[]>([]);
  const [fetchingHistory, setFetchingHistory] = useState(true);
  const [eqAssessmentHistory, setEqAssessmentHistory] = useState<EQAssessmentResult[]>([]);
  const [fetchingEQHistory, setFetchingEQHistory] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    const fetchRealizations = async () => {
      if (!user) return;
      setFetching(true);
      const { data, error } = await supabase
        .from("realizations")
        .select("id, prompt, emotion, frequency, meditation_length, created_at")
        .order("created_at", { ascending: false });
      if (!error) {
        setRealizations(data || []);
      }
      setFetching(false);
    };

    const fetchPersonalityHistory = async () => {
      if (!user) return;
      setFetchingHistory(true);
      const { data, error } = await supabase
        .from("personality_test_results")
        .select("id, created_at, scores")
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching personality history:", error);
        setPersonalityTestHistory([]);
      } else {
        setPersonalityTestHistory((data as PersonalityTestResult[]) || []);
      }
      setFetchingHistory(false);
    };

    const fetchEQHistory = async () => {
      if (!user) return;
      setFetchingEQHistory(true);
      const { data, error } = await supabase
        .from("eq_assessment_results")
        .select("id, created_at, scores, emotional_insights")
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching EQ assessment history:", error);
        setEqAssessmentHistory([]);
      } else {
        setEqAssessmentHistory((data as EQAssessmentResult[]) || []);
      }
      setFetchingEQHistory(false);
    };

    if (user) {
      fetchRealizations();
      fetchPersonalityHistory();
      fetchEQHistory();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex flex-col items-center py-10">
      <Card className="w-full max-w-4xl p-8 shadow-lg relative">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-6 left-6 flex items-center"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2" />
          Back
        </Button>
        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          My Realizations
        </h2>
        {/* Assessment CTAs */}
        <div className="w-full flex justify-center gap-4 mb-8">
          <Button
            variant="secondary"
            className="text-lg px-6 py-3 rounded-full shadow"
            onClick={() => navigate("/personality")}
          >
            Personality Awareness
          </Button>
          <Button
            variant="secondary"
            className="text-lg px-6 py-3 rounded-full shadow"
            onClick={() => navigate("/eq-assessment")}
          >
            EQ Assessment
          </Button>
        </div>
        {fetching ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin h-7 w-7 text-blue-500" />
          </div>
        ) : realizations.length === 0 ? (
          <div className="text-center text-gray-600 py-8">No realizations found yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Resonate Prompt</TableHead>
                  <TableHead>Emotion</TableHead>
                  <TableHead>Sound</TableHead>
                  <TableHead>Times Felt</TableHead>
                  <TableHead>Meditation Length (min)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {realizations.map((r) => {
                  const emotionData = emotions[r.emotion as keyof typeof emotions];
                  return (
                    <TableRow key={r.id}>
                      <TableCell>{r.prompt}</TableCell>
                      <TableCell>{r.emotion}</TableCell>
                      <TableCell>
                        {emotionData ? (
                          <span className="font-mono text-xs whitespace-nowrap">
                            {emotionData.frequency}Hz
                            {emotionData.beat && ` (+${emotionData.beat}Hz)`}
                          </span>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>{r.frequency}</TableCell>
                      <TableCell>{Math.round(r.meditation_length / 60)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
        
        {/* EQ Assessment History Section */}
        <div className="mt-12">
          <h3 className="text-xl font-bold mb-4 text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            EQ Assessment History
          </h3>
          {fetchingEQHistory ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin h-7 w-7 text-blue-500" />
            </div>
          ) : eqAssessmentHistory.length === 0 ? (
            <div className="text-center text-gray-600 py-8">No EQ assessments taken yet.</div>
          ) : (
            <Accordion type="single" collapsible className="w-full mb-8">
              {eqAssessmentHistory.map((result) => {
                const avgScore = Object.values(result.scores).reduce((a, b) => a + b, 0) / Object.values(result.scores).length;
                const topDomains = Object.entries(result.scores)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 2)
                  .map(([domain, score]) => `${domain}: ${score}/7`)
                  .join(' | ');

                return (
                  <AccordionItem value={result.id} key={result.id}>
                    <AccordionTrigger>
                      <div className="flex justify-between w-full pr-4">
                        <span>{new Date(result.created_at).toLocaleDateString()}</span>
                        <div className="text-sm text-gray-600">
                          <div>Avg: {avgScore.toFixed(1)}/7</div>
                          <div>{topDomains}</div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium mb-2">EQ Domain Scores:</h5>
                          <ul className="space-y-1">
                            {Object.entries(result.scores).map(([domain, score]) => (
                              <li key={domain} className="flex justify-between">
                                <span>{domain}</span>
                                <span className="font-medium">{score} / 7</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium mb-2">Associated Emotions:</h5>
                          <div className="space-y-2">
                            {Object.entries(result.emotional_insights).map(([domain, emotions]) => (
                              <div key={domain}>
                                <div className="text-sm font-medium">{domain}:</div>
                                <div className="flex flex-wrap gap-1">
                                  {emotions.map((emotion) => (
                                    <span key={emotion} className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                                      {emotion}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </div>
        
        {/* Personality Awareness History Section */}
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4 text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Personality Awareness History
          </h3>
          {fetchingHistory ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin h-7 w-7 text-blue-500" />
            </div>
          ) : personalityTestHistory.length === 0 ? (
            <div className="text-center text-gray-600 py-8">No personality tests taken yet.</div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {personalityTestHistory.map((result) => {
                const summary = Object.entries(result.scores)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 2)
                  .map(([trait, score]) => `${trait}: ${score}/7`)
                  .join(' | ');

                return (
                  <AccordionItem value={result.id} key={result.id}>
                    <AccordionTrigger>
                      <div className="flex justify-between w-full pr-4">
                        <span>{new Date(result.created_at).toLocaleDateString()}</span>
                        <span className="text-sm text-gray-600">{summary}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="pl-4 space-y-1">
                        {Object.entries(result.scores).map(([trait, score]) => (
                          <li key={trait} className="flex justify-between pr-4">
                            <span>{trait}</span>
                            <span className="font-medium">{score} / 7</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Realizations;
