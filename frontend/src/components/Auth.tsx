import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import axios from "axios";
import { Layers, MessageSquare, Zap, Activity, Sparkles } from "lucide-react";

const FEATURES = [
  {
    label: "Theme",
    icon: Layers,
    color: "text-purple-500",
    description: "Identifies core logic threads and technical thematic gaps."
  },
  {
    label: "Tone",
    icon: MessageSquare,
    color: "text-amber-500",
    description: "Monitors emotional resonance and professional voice consistency."
  },
  {
    label: "Clarity",
    icon: Zap,
    color: "text-emerald-500",
    description: "Analyzes sentence complexity and sophisticated phrasing."
  },
  {
    label: "Flow",
    icon: Activity,
    color: "text-indigo-500",
    description: "Examines pacing and rhythmic manuscript patterns."
  }
];

interface AuthProps {
  onLogin: (token: string, userId: string, email: string) => void;
}

export function Auth({ onLogin }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const endpoint = isLogin ? "/auth/login" : "/auth/signup";
    try {
      const response = await axios.post(`http://localhost:8000${endpoint}`, {
        email,
        password,
      });

      const { access_token, user_id } = response.data;
      onLogin(access_token, user_id, email);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background font-sans overflow-hidden">
      {/* LEFT SIDE: BRANDING + INFO */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 md:p-16 lg:p-24 bg-card/10 border-b lg:border-b-0 lg:border-r border-border/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 rounded-full blur-[200px] -translate-x-1/2 -translate-y-1/2" />
        
        <div className="relative space-y-12 max-w-xl mx-auto lg:mx-0">
          <div className="space-y-4">
            <div className="flex flex-col group gap-1.5 w-fit">
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground transition-all group-hover:opacity-70 leading-none lowercase">
                griffith
              </h1>
              <span className="text-xs md:text-sm uppercase tracking-[0.4em] font-medium text-primary/60">
                Writing Insights
              </span>
            </div>
            <p className="text-lg md:text-xl font-medium text-muted-foreground/80 leading-relaxed max-w-lg pt-4">
              griffith helps you understand and improve your writing through structured, AI-driven linguistic insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
            {FEATURES.map((feature, i) => (
              <div key={i} className="p-6 rounded-2xl bg-secondary/20 border border-border/10 space-y-3 transition-all hover:bg-secondary/40">
                <div className="flex items-center gap-3">
                  <feature.icon className={`size-5 ${feature.color}`} />
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">{feature.label}</span>
                </div>
                <p className="text-sm font-medium text-muted-foreground/60 leading-relaxed">
                   {feature.description}
                </p>
              </div>
            ))}
          </div>
          
          <div className="flex items-center gap-4 pt-12 opacity-30">
            <Sparkles className="size-4 text-primary" />
            <span className="text-[10px] uppercase font-black tracking-[0.4em]">Academic Precision Engine</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: AUTHENTICATION */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 rounded-full blur-[200px] translate-x-1/2 translate-y-1/2 opacity-30" />
        <Card className="w-full max-w-md shadow-2xl border-border/20 bg-card/60 backdrop-blur-3xl relative z-10">
          <CardHeader className="space-y-4 pt-10 pb-6 px-10">
            <div className="space-y-2">
              <CardTitle className="text-3xl font-black tracking-tighter text-center text-foreground leading-none">
                {isLogin ? "Welcome Back" : "Create Account"}
              </CardTitle>
              <CardDescription className="text-center text-base font-medium text-muted-foreground/60">
                {isLogin
                  ? "Enter your credentials to access your workspace"
                  : "Join Griffith to analyze your academic writing"}
              </CardDescription>
            </div>
          </CardHeader>
        <CardContent className="px-10 pb-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
              <Input
                type="email"
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 text-base bg-secondary/30 border-transparent focus:bg-secondary/50 focus:border-primary/40 transition-all rounded-xl shadow-inner"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Secure Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 text-base bg-secondary/30 border-transparent focus:bg-secondary/50 focus:border-primary/40 transition-all rounded-xl shadow-inner"
              />
            </div>
            {error && (
              <div className="text-sm font-medium text-destructive bg-destructive/5 p-3.5 rounded-xl border border-destructive/10 animate-in fade-in slide-in-from-top-1">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full h-14 text-base font-bold shadow-lg shadow-primary/20 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]" disabled={loading}>
              {loading ? "Authenticating..." : isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pb-10">
          <div className="text-sm font-medium text-center text-muted-foreground">
            {isLogin ? "New to Griffith?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary font-bold hover:text-primary/80 underline-offset-4 hover:underline transition-all"
            >
              {isLogin ? "Create account" : "Sign in instead"}
            </button>
          </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
