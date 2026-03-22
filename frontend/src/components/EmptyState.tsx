import {
  Layers,
  MessageSquare,
  Zap,
  Activity,
  Sparkles
} from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const PREVIEW_NODES = [
  {
    label: "Theme",
    icon: Layers,
    color: "text-purple-500",
    headline: "Central Logic Check",
    signals: ["Rich Evidence", "Deep Themes"],
    verdict: "Stable",
    description: "Evaluates the consistency of your central argument and the strength of supporting evidence throughout the manuscript. Look for these insights to identify technical or thematic gaps that may require additional depth."
  },
  {
    label: "Tone",
    icon: MessageSquare,
    color: "text-amber-500",
    headline: "Consistent Voice",
    signals: ["Professional", "Formal"],
    verdict: "Consistent",
    description: "Monitors your emotional resonance and professional voice to ensure it matches your intended audience and purpose. Use this to maintain a reliable and consistent atmosphere across your entire document."
  },
  {
    label: "Clarity",
    icon: Zap,
    color: "text-emerald-500",
    headline: "Sophisticated Syntax",
    signals: ["Clear", "Precise"],
    verdict: "High Clarity",
    description: "Analyzes sentence complexity and structure to identify opportunities for more direct phrasing. Focus on these results to improve overall readability and reduce cognitive load for your readers."
  },
  {
    label: "Flow",
    icon: Activity,
    color: "text-indigo-500",
    headline: "Smooth Pacing",
    signals: ["Varied Sentences", "Natural Rhythm"],
    verdict: "Well-paced",
    description: "Examines the pacing and rhythmic patterns between your ideas to ensure a natural writing flow. Look for alerts regarding repetitive structures or transitions that might disrupt your manuscript's momentum."
  }
];

export function EmptyState() {
  return (
    <div className="max-w-xl mx-auto py-8 md:py-12 px-6 md:px-0 space-y-12 md:space-y-16 animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <div className="text-center space-y-6">
        <div className="relative inline-block opacity-40">
          <div className="relative w-20 h-20 bg-card border border-border/10 rounded-[2rem] flex items-center justify-center mx-auto transition-transform duration-500">
            <Sparkles className="size-10 text-primary opacity-60" />
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-foreground leading-none lowercase">
            prepare your manuscript for review
          </h2>
          <p className="text-muted-foreground font-medium text-base md:text-xl leading-relaxed max-w-sm mx-auto opacity-70">
            Paste your document in the workstation. Griffith is prepared to conduct a deep linguistic analysis of your writing.
          </p>
        </div>

        <div className="max-w-md mx-auto p-6 md:p-8 rounded-2xl bg-secondary/20 border border-border/10 space-y-4 transition-all">
          <div className="flex items-center gap-3 justify-center text-primary/60">
            <div className="h-px w-8 bg-current" />
            <span className="text-xs font-black uppercase tracking-[0.4em]">Calibration Note</span>
            <div className="h-px w-8 bg-current" />
          </div>
          <p className="text-base font-medium leading-relaxed text-muted-foreground/80 lowercase">
            the depth of your review depends on how clearly you define your intentions and readers. specifying your <span className="text-foreground">intent</span> and <span className="text-foreground">audience</span> ensures the linguistic analysis is calibrated to your specific objectives.
          </p>
        </div>
      </div>

      {/* PREVIEW CARDS GRID */}
      <div className="grid grid-cols-1 gap-6">
        <div className="relative">
          <div className="flex flex-col items-center gap-3 mb-8 md:mb-10">
            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.5em] text-primary/40 block">Your review will focus on:</span>
            <div className="h-px w-12 md:w-16 bg-primary/20" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {PREVIEW_NODES.map((node: any, i) => (
              <Card key={i} className={`border border-border/10 shadow-sm bg-card/40 opacity-50 hover:opacity-100 transition-all cursor-default group duration-500`}>
                <CardHeader className="py-5 px-6 flex flex-row items-center justify-between border-b border-border/5">
                  <div className="flex items-center gap-3">
                    <node.icon className={`size-5 ${node.color}`} />
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">{node.label}</span>
                  </div>
                  <span className="text-[10px] font-black uppercase text-primary/40 tracking-widest">{node.verdict}</span>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <h4 className="text-lg font-bold text-foreground/80 leading-tight">
                    {node.headline}
                  </h4>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {node.signals.map((s: string, j: number) => (
                      <span key={j} className="text-xs px-2.5 py-1 bg-secondary/30 rounded-full font-bold text-muted-foreground uppercase tracking-widest border border-border/5">
                        {s}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed font-medium text-muted-foreground/60">
                    {node.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER CALL TO ACTION */}
      <div className="pt-10 flex flex-col items-center gap-6">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        <div className="flex items-center gap-4">
          <div className="p-3 bg-secondary/50 rounded-2xl border border-border/20">
            <div className="flex gap-1.5 item-center">
              {[1, 2, 3, 4].map(i => <div key={i} className="w-1 h-3 rounded-full bg-primary/20 animate-wiggle" style={{ animationDelay: `${i * 0.15}s` }} />)}
            </div>
          </div>
          <p className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-500/40">Awaiting Primary Input Stream...</p>
        </div>
      </div>
    </div>
  );
}
