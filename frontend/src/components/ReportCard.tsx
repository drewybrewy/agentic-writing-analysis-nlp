import { useState } from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import ReactMarkdown from 'react-markdown';
import {
    Eye,
    Layers,
    MessageSquare,
    Zap,
    Activity,
    CheckCircle2,
    AlertCircle,
    XCircle,
    ChevronRight,
    ArrowRight,
    ChevronDown,
    ChevronUp
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const nodeConfig: any = {
    vision: { icon: Eye, color: "text-blue-600", bg: "bg-blue-50/50", label: "Core Strategy" },
    thematic: { icon: Layers, color: "text-purple-600", bg: "bg-purple-50/50", label: "Thematic Focus" },
    sentiment: { icon: MessageSquare, color: "text-amber-600", bg: "bg-amber-50/50", label: "Tone Review" },
    lexical: { icon: Zap, color: "text-emerald-600", bg: "bg-emerald-50/50", label: "Clarity Review" },
    ai_signal: { icon: Activity, color: "text-indigo-600", bg: "bg-indigo-50/50", label: "Rhythm & Flow" },
};

const MarkdownStyles = {
    h1: ({ children }: any) => <h1 className="text-2xl font-black tracking-tighter mb-4 mt-8 first:mt-0 text-foreground underline decoration-primary/20 decoration-4 underline-offset-4 leading-none">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-xl font-black tracking-tighter mb-3 mt-6 text-foreground/90 leading-none">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-base font-black uppercase tracking-[0.4em] mb-2 mt-4 text-primary">{children}</h3>,
    p: ({ children }: any) => <p className="leading-relaxed mb-6 text-[17px] font-medium text-foreground/90">{children}</p>,
    ul: ({ children }: any) => <ul className="space-y-4 mb-6 mt-2">{children}</ul>,
    ol: ({ children }: any) => <ol className="list-decimal list-inside space-y-4 mb-6 mt-2">{children}</ol>,
    li: ({ children, ordered }: any) => (
        <li className="flex items-start gap-3 group">
            {!ordered && <ChevronRight className="size-5 text-primary shrink-0 mt-0.5 opacity-40 group-hover:opacity-100 transition-opacity" />}
            <span className={`text-[17px] font-medium leading-relaxed ${ordered ? 'ml-1' : ''}`}>{children}</span>
        </li>
    ),
    strong: ({ children }: any) => <strong className="font-extrabold text-primary/80 bg-primary/10 px-1.5 rounded">{children}</strong>,
    blockquote: ({ children }: any) => (
        <blockquote className="border-l-4 border-primary/20 pl-4 py-2 italic bg-secondary/30 rounded-r-lg mb-6">
            {children}
        </blockquote>
    )
};

export const ReportCard = ({ type, content }: { type: string, content: any }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const config = nodeConfig[type];
    if (!config || !content) return null;

    const isStructured = typeof content === 'object' && content !== null;
    const Icon = config.icon;

    // Helper for Verdict Badge colors
    const getVerdictStyle = (verdict: string) => {
        const v = verdict?.toLowerCase() || "";
        if (v.includes("well") || v.includes("clear") || v.includes("consistent") || v.includes("reliable") || v.includes("pacing")) {
            return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 ring-emerald-500/0";
        }
        if (v.includes("depth") || v.includes("mismatch") || v.includes("revisions") || v.includes("repetitive") || v.includes("uneven") || v.includes("aligned")) {
            return "bg-amber-500/10 text-amber-400 border-amber-500/20 ring-amber-500/0";
        }
        return "bg-slate-500/10 text-slate-400 border-slate-500/20 ring-slate-500/0";
    };

    return (
        <Card className="border border-border/10 overflow-hidden bg-card transition-all hover:bg-card/80 shadow-2xl p-0">
            {/* A. HEADER */}
            <CardHeader className={`${config.bg.replace('/50', '/10')} py-6 px-8 flex flex-row items-center justify-between border-b border-border/5 m-0 rounded-none`}>
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl bg-background border border-border/20`}>
                        <Icon className={`size-4 ${config.color}`} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">
                        {config.label}
                    </span>
                </div>
                {isStructured && content.verdict && (
                    <Badge variant="outline" className={`${getVerdictStyle(content.verdict)} border uppercase tracking-widest text-[10px] font-black px-3 py-1 rounded-lg transition-colors`}>
                        {content.verdict}
                    </Badge>
                )}
            </CardHeader>

            <CardContent className="p-10 space-y-8">
                {isStructured ? (
                    <>
                        {/* B. HEADLINE */}
                        <div className="space-y-1">
                            <h3 className="text-2xl font-black tracking-tighter text-foreground leading-tight">
                                {content.headline}
                            </h3>
                        </div>

                        {/* C. SIGNALS */}
                        <div className="flex flex-wrap gap-2.5">
                            {content.signals?.map((signal: string, i: number) => (
                                <span key={i} className="text-xs font-bold text-muted-foreground bg-secondary/80 px-4 py-1.5 rounded-full uppercase tracking-wider border border-border/10">
                                    {signal}
                                </span>
                            ))}
                        </div>

                        {/* SPECIAL SECTION: HIGHLIGHTS */}
                        {content.highlight && (
                            <div className="space-y-4 pt-2">
                                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-primary/40">Flow Highlights</span>
                                <div className="grid gap-4">
                                    {content.highlight.good && (
                                        <div className="p-5 bg-emerald-500/5 border-l-4 border-emerald-500/30 rounded-r-xl">
                                            <p className="text-[15px] font-medium text-emerald-400/90 italic leading-relaxed">
                                                "{content.highlight.good}"
                                            </p>
                                        </div>
                                    )}
                                    {content.highlight.issue && (
                                        <div className="p-5 bg-amber-500/5 border-l-4 border-amber-500/30 rounded-r-xl">
                                            <p className="text-[15px] font-medium text-amber-400/90 italic leading-relaxed">
                                                "{content.highlight.issue}"
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* E. ANALYSIS (EXPANDABLE) */}
                        <div className="pt-4 border-t border-border/5">
                             <button 
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="w-full flex items-center justify-between text-xs font-black uppercase tracking-[0.3em] text-primary hover:text-primary/70 transition-colors py-3"
                             >
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                    <span>Detailed Analysis</span>
                                </div>
                                {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                             </button>
                             
                             {isExpanded && (
                                <div className="mt-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="prose prose-slate prose-lg max-w-none">
                                        <ReactMarkdown components={MarkdownStyles as any}>
                                            {content.analysis}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                             )}
                        </div>
                    </>
                ) : (
                    /* FALLBACK / EMPTY STATE (LEGACY STRING) */
                    <div className="prose prose-slate prose-lg max-w-none">
                        <ReactMarkdown components={MarkdownStyles as any}>
                            {content}
                        </ReactMarkdown>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export const MasterPlanCard = ({ content }: { content: any }) => {
    if (!content) return null;

    const isStructured = typeof content === 'object' && content !== null;
    const verdict = isStructured ? (content.verdict || "REVIEWED") : content;
    const headline = isStructured ? content.headline : "Executive Verdict";
    const bodyText = isStructured ? content.analysis : content;

    const isGood = verdict.includes("GOOD TO GO");
    const isMinor = verdict.includes("MINOR REVISIONS");

    const statusLabel = isGood ? "RELIABLE" : isMinor ? "CAUTION" : "CRITICAL";

    const statusConfig = isGood
        ? { icon: CheckCircle2, color: "text-emerald-600", border: "border-emerald-200/50", bg: "bg-emerald-50/10", badge: "bg-emerald-500/10 text-emerald-400" }
        : isMinor
            ? { icon: AlertCircle, color: "text-amber-600", border: "border-amber-200/50", bg: "bg-amber-50/10", badge: "bg-amber-500/10 text-amber-400" }
            : { icon: XCircle, color: "text-rose-600", border: "border-rose-200/50", bg: "bg-rose-50/10", badge: "bg-rose-500/10 text-rose-400" };

    const StatusIcon = statusConfig.icon;

    return (
        <Card className="border border-border/10 overflow-hidden bg-card transition-all hover:bg-card/80 shadow-2xl p-0">
            <CardHeader className={`${statusConfig.bg} py-6 px-8 flex flex-row items-center justify-between border-b border-border/5 m-0 rounded-none`}>
                <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl bg-background border border-border/10`}>
                        <StatusIcon className={`size-5 ${statusConfig.color}`} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60 leading-none mb-1">Final Verdict</span>
                        <h3 className="text-sm font-black uppercase tracking-widest text-foreground leading-none">Manuscript Quality</h3>
                    </div>
                </div>
                <Badge variant="outline" className={`${statusConfig.badge} border-none font-black text-[10px] tracking-[0.2em] px-4 py-1.5 rounded-xl transition-all shadow-sm`}>
                    {statusLabel}
                </Badge>
            </CardHeader>

            <CardContent className="p-10 md:p-12 space-y-10">
                <div className="space-y-4">
                    <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-foreground leading-tight">
                        {headline}
                    </h2>
                    
                    {isStructured && content.signals && (
                        <div className="flex flex-wrap gap-2 pt-2">
                             {content.signals.map((s: string, i: number) => (
                                <span key={i} className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 bg-secondary/40 px-3 py-1 rounded-full border border-border/5">
                                    {s}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="prose prose-slate prose-lg max-w-none text-foreground/90 leading-relaxed">
                    <ReactMarkdown
                        components={{
                            ...MarkdownStyles,
                            p: ({ children }) => <p className="text-[1.1rem] lg:text-[1.25rem] font-medium leading-[1.7] mb-8 last:mb-0">{children}</p>,
                            strong: ({ children }) => (
                                <span className="inline-flex items-center gap-1.5 text-primary font-bold bg-primary/5 px-2 py-0.5 rounded-lg border border-primary/10 transition-colors hover:bg-primary/10">
                                    <ArrowRight className="size-3.5" />
                                    {children}
                                </span>
                            )
                        }}
                    >
                        {bodyText}
                    </ReactMarkdown>
                </div>

                <div className="pt-8 border-t border-border/10 flex items-center justify-between opacity-30">
                     <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em]">
                        <Activity className="size-3" />
                        Executive Intelligence
                     </div>
                     <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Griffith &copy; 2026</span>
                </div>
            </CardContent>
        </Card>
    );
};