
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Mail, Eye, EyeOff, ArrowLeft } from "lucide-react";

const Auth = () => {
  const { user, login, signUp, signInWithGoogle, forgotPassword, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  useEffect(() => {
    // Check for reset mode from URL params
    const resetMode = searchParams.get('mode');
    if (resetMode === 'reset') {
      setMode('forgot');
    }
  }, [searchParams]);

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

    if (mode === "forgot") {
      const error = await forgotPassword(email);
      if (error) {
        setErrMsg(error.message);
      } else {
        toast({ 
          title: "Password reset sent!", 
          description: "Check your email for reset instructions." 
        });
        setMode("login");
      }
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
      else toast({ title: "Welcome back!", description: "You have successfully signed in." });
    } else {
      error = await signUp(email, password);
      if (error) setErrMsg(error.message);
      else toast({ 
        title: "Account created!", 
        description: "Please check your email to verify your account." 
      });
    }
  };

  const handleGoogleSignIn = async () => {
    setErrMsg(null);
    const error = await signInWithGoogle();
    if (error) {
      setErrMsg(error.message);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case "login": return "Welcome Back";
      case "signup": return "Create Account";
      case "forgot": return "Reset Password";
      default: return "Welcome";
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case "login": return "Sign in to continue your journey";
      case "signup": return "Begin your emotional transformation";
      case "forgot": return "Enter your email to reset your password";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-60 h-60 bg-primary/15 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-primary mb-2">
            Emotional Sublation
          </h1>
          <p className="text-muted-foreground text-sm">
            Transcend through mindful meditation
          </p>
        </div>

        <Card className="backdrop-blur-sm bg-card/80 border-primary/20 shadow-elevated">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-semibold">{getTitle()}</CardTitle>
            <CardDescription className="text-muted-foreground">
              {getSubtitle()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form className="space-y-4" onSubmit={handleAuth}>
              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                    className="pl-10 h-12 border-primary/20 focus:border-primary"
                  />
                </div>
                
                {mode !== "forgot" && (
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      required
                      className="pr-10 h-12 border-primary/20 focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                )}
              </div>

              {errMsg && (
                <div className="text-destructive text-sm bg-destructive/10 p-3 rounded-md border border-destructive/20">
                  {errMsg}
                </div>
              )}

              <Button 
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium" 
                type="submit" 
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    <span>
                      {mode === "login" ? "Signing in..." : 
                       mode === "signup" ? "Creating account..." : 
                       "Sending reset..."}
                    </span>
                  </div>
                ) : (
                  mode === "login" ? "Sign In" : 
                  mode === "signup" ? "Create Account" : 
                  "Send Reset Link"
                )}
              </Button>
            </form>

            {mode !== "forgot" && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-primary/20"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full h-12 border-primary/20 hover:bg-primary/5 hover:border-primary/40"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </Button>
              </>
            )}

            <div className="text-center space-y-2">
              {mode === "login" && (
                <>
                  <button
                    type="button"
                    className="text-primary hover:text-primary/80 text-sm underline"
                    onClick={() => setMode("forgot")}
                    disabled={loading}
                  >
                    Forgot your password?
                  </button>
                  <div className="text-muted-foreground text-sm">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      className="text-primary hover:text-primary/80 underline"
                      onClick={() => setMode("signup")}
                      disabled={loading}
                    >
                      Sign up
                    </button>
                  </div>
                </>
              )}
              
              {mode === "signup" && (
                <div className="text-muted-foreground text-sm">
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="text-primary hover:text-primary/80 underline"
                    onClick={() => setMode("login")}
                    disabled={loading}
                  >
                    Sign in
                  </button>
                </div>
              )}

              {mode === "forgot" && (
                <button
                  type="button"
                  className="flex items-center justify-center space-x-2 text-primary hover:text-primary/80 text-sm underline mx-auto"
                  onClick={() => setMode("login")}
                  disabled={loading}
                >
                  <ArrowLeft className="h-3 w-3" />
                  <span>Back to sign in</span>
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default Auth;
