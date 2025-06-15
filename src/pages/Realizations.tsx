
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

type Realization = {
  id: string;
  prompt: string;
  emotion: string;
  frequency: number;
  meditation_length: number;
  created_at: string;
};

const Realizations = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [realizations, setRealizations] = useState<Realization[]>([]);
  const [fetching, setFetching] = useState(true);

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
    if (user) fetchRealizations();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex flex-col items-center py-10">
      <Card className="w-full max-w-3xl p-8 shadow-lg relative">
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
        {/* Personality Awareness CTA */}
        <div className="w-full flex justify-center mb-8">
          <Button
            variant="secondary"
            className="text-lg px-6 py-3 rounded-full shadow"
            onClick={() => navigate("/personality")}
          >
            Personality Awareness
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
                  <TableHead>Frequency</TableHead>
                  <TableHead>Meditation Length (min)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {realizations.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.prompt}</TableCell>
                    <TableCell>{r.emotion}</TableCell>
                    <TableCell>{r.frequency}</TableCell>
                    <TableCell>{Math.round(r.meditation_length / 60)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Realizations;
