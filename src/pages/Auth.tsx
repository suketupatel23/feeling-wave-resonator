
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";

const Auth = () => {
  const { user, login, signUp, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState<string | null>(null);

  if (user) {
    // Already logged in, redirect to home
    navigate("/");
    return null;
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrMsg(null);
    if (!email.includes("@")) {
      setErrMsg("Please enter a valid email address");
      return;
    }
    if (password.length < 6) {
      setErrMsg("Password must be at least 6 characters");
      return;
    }
    let error;
    if (mode === "login") {
      error = await login(email, password);
      if (error) setErrMsg(error.message);
      else toast({ title: "Welcome back!" });
    } else {
      error = await signUp(email, password);
      if (error) setErrMsg(error.message);
      else toast({ title: "Signup successful!", description: "Please check your email to verify your account." });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">
          {mode === "login" ? "Login" : "Sign Up"}
        </h2>
        <form className="space-y-4" onSubmit={handleAuth}>
          <Input
            type="email"
            placeholder="Email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
          {errMsg && (
            <div className="text-red-500 text-sm">{errMsg}</div>
          )}
          <Button className="w-full" type="submit" disabled={loading}>
            {loading
              ? mode === "login"
                ? "Logging in..."
                : "Signing up..."
              : mode === "login"
                ? "Log In"
                : "Sign Up"}
          </Button>
        </form>
        <div className="mt-6 text-center text-gray-500">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                type="button"
                className="text-primary underline"
                onClick={() => setMode("signup")}
                disabled={loading}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                className="text-primary underline"
                onClick={() => setMode("login")}
                disabled={loading}
              >
                Log in
              </button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};
export default Auth;
