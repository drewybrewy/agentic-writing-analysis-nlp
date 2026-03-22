import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, FileText, Upload, Download, History, ChevronLeft, X } from "lucide-react";
import { ReportCard, MasterPlanCard } from "./components/ReportCard";
import axios from "axios";
import { Separator } from '@base-ui/react';
import { ANALYSIS_OPTIONS } from "./lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Auth } from "./components/Auth";
import { Navbar } from "./components/Navbar";
import { EmptyState } from "./components/EmptyState";

interface User {
  token: string;
  userId: string;
  email: string;
}

const AnalysisLoading = () => {
  const [statusIdx, setStatusIdx] = useState(0);
  const loadingStatuses = [
    "Sequencing Linguistic DNA...",
    "Querying Thematic Specialist...",
    "Reviewing Lexical Complexity...",
    "Analyzing Sentiment Resonance...",
    "Measuring Rhythm & Signal...",
    "Finalizing Performance Verdict..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIdx((prev) => (prev + 1) % loadingStatuses.length);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-12 animate-in fade-in zoom-in-95 duration-700">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-[100px]" />
        <div className="relative p-12 bg-card border-none rounded-[3rem] shadow-md flex items-center justify-center overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-primary/5" />
          <Sparkles className="size-16 text-primary" />
        </div>
      </div>
      <div className="text-center space-y-4">
        <h3 className="text-3xl font-black tracking-tighter text-foreground flex items-center justify-center gap-3 leading-none">
          Analyzing <span className="text-primary italic">Source</span>
        </h3>
        <p className="text-sm font-black text-muted-foreground/40 uppercase tracking-[0.4em] min-h-[1em]">
          {loadingStatuses[statusIdx]}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-md opacity-20 grayscale blur-[4px]">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-28 bg-card rounded-2xl border-none animate-pulse" />
        ))}
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState({
    style: "Tech Blog",
    audience: "Junior Developers",
    intent: "Instructional",
    intentDetail: ""
  });
  const [history, setHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [currentReportId, setCurrentReportId] = useState<string | null>(null);
  const [activeFile, setActiveFile] = useState<string | null>(null);

  // Check for existing session
  useEffect(() => {
    const savedUser = localStorage.getItem("griffith_user");
    if (savedUser) {
      const u = JSON.parse(savedUser);
      setUser(u);
      fetchHistory(u.userId);
    }
  }, []);

  const fetchHistory = async (userId: string) => {
    try {
      const res = await axios.get(`http://localhost:8000/users/${userId}/reports`);
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch history");
    }
  };

  const handleLogin = (token: string, userId: string, email: string) => {
    const userData = { token, userId, email };
    setUser(userData);
    localStorage.setItem("griffith_user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("griffith_user");
  };

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await axios.post("http://localhost:8000/analyze/text", {
        text: text,
        ...config
      }, {
        params: { save: true, user_id: user?.userId }
      });

      setResults(response.data.analysis);
      setCurrentReportId(response.data.report_id);
      if (user) fetchHistory(user.userId);
    } catch (err: any) {
      const errMsg = err.response?.data?.detail || "Analysis failed. Check your connection.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFile = () => {
    setActiveFile(null);
    setText("");
    setResults(null);
    setCurrentReportId(null);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setResults(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:8000/extract/file", formData);
      setText(response.data.text || "");
      setActiveFile(response.data.filename);
      setResults(null); // Clear results for new document
      setCurrentReportId(null);
    } catch (err: any) {
      const errMsg = err.response?.data?.detail || "Extraction failed.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async (reportId: string) => {
    try {
      const response = await axios.get(`http://localhost:8000/reports/${reportId}/download`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Griffith_Report_${reportId}.docx`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      setError("Download failed.");
    }
  };

  const downloadReportText = async (reportId: string) => {
    try {
      const response = await axios.get(`http://localhost:8000/reports/${reportId}/export/text`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Griffith_Report_${reportId}.txt`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      setError("Text export failed.");
    }
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="flex flex-col min-h-screen lg:h-screen w-full bg-background text-foreground lg:overflow-hidden font-sans selection:bg-primary/20 selection:text-primary">
      <Navbar userEmail={user.email} onLogout={handleLogout} />

      <div className="flex flex-col lg:flex-row flex-1 overflow-visible lg:overflow-hidden">
        {/* LEFT: EDITOR */}
        <section className="w-full lg:w-1/2 flex flex-col border-b lg:border-b-0 lg:border-r border-border/10 bg-card/10 backdrop-blur-3xl p-6 md:p-8 shadow-sm transition-all">
          <div className="flex-1 flex flex-col min-h-0 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest bg-secondary/40 px-2.5 py-1 rounded">Editor Mode</span>
                <label className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary cursor-pointer hover:bg-primary/20 transition-all shadow-sm">
                  <Upload className="size-3" />
                  {activeFile ? "Change Document" : "Upload Document"}
                  <input type="file" className="hidden" accept=".txt,.docx" onChange={handleFileUpload} />
                </label>
                {activeFile && (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-black uppercase tracking-widest text-emerald-300 animate-in fade-in slide-in-from-left-2 transition-all">
                        <FileText className="size-3" />
                        <span className="max-w-[150px] truncate">{activeFile}</span>
                        <button 
                          onClick={handleRemoveFile}
                          className="ml-1 p-0.5 hover:bg-emerald-500/20 rounded-full transition-colors"
                        >
                          <X className="size-3" />
                        </button>
                    </div>
                )}
              </div>
            </div>

            <div className="flex-1 min-h-0 relative group rounded-[2rem] border-2 border-white/20 bg-secondary/10 p-2 focus-within:border-white/60 focus-within:bg-secondary/20 transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.3)]">
              <div className="absolute inset-0 bg-white/10 rounded-[2rem] blur-3xl opacity-0 group-focus-within:opacity-10 transition-opacity pointer-events-none" />
              <Textarea
                className="h-full w-full resize-none border-none focus-visible:ring-0 text-2xl leading-[1.8] text-white/90 placeholder:text-muted-foreground/30 scroll-smooth px-8 py-6 custom-scrollbar overflow-y-auto"
                placeholder="Paste your document here for deep linguistic analysis..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
          </div>

          {/* DYNAMIC CONFIGURATION ROW */}
          <div className="grid grid-cols-3 gap-4 px-1 mt-8 mb-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1 opacity-70">Style Profile</label>
              <Select value={config.style} onValueChange={(v) => v && setConfig({ ...config, style: v })}>
                <SelectTrigger className="h-12 text-sm border border-border/10 bg-secondary/20 focus:ring-1 focus:ring-primary/10 transition-all rounded-xl">
                  <SelectValue placeholder="Select Style" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/50 bg-card shadow-2xl">
                  {ANALYSIS_OPTIONS.styles.map(s => <SelectItem key={s} value={s} className="text-sm rounded-lg mx-1 focus:bg-primary/10">{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1 opacity-70">Target Audience</label>
              <Select value={config.audience} onValueChange={(v) => v && setConfig({ ...config, audience: v })}>
                <SelectTrigger className="h-12 text-sm border border-border/10 bg-secondary/20 focus:ring-1 focus:ring-primary/10 transition-all rounded-xl">
                  <SelectValue placeholder="Select Audience" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/50 bg-card shadow-2xl">
                  {ANALYSIS_OPTIONS.audiences.map(a => <SelectItem key={a} value={a} className="text-sm rounded-lg mx-1 focus:bg-primary/10">{a}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1 opacity-70">Core Intent</label>
              <Select value={config.intent} onValueChange={(v) => v && setConfig({ ...config, intent: v })}>
                <SelectTrigger className="h-12 text-sm border border-border/10 bg-secondary/20 focus:ring-1 focus:ring-primary/10 transition-all rounded-xl">
                  <SelectValue placeholder="Select Intent" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/50 bg-card shadow-2xl">
                  {ANALYSIS_OPTIONS.intents.map(i => <SelectItem key={i} value={i} className="text-sm rounded-lg mx-1 focus:bg-primary/10">{i}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* DETAILED INTENT INPUT */}
          <div className="px-1 mb-8 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1 opacity-70">
                Describe your intent <span className="text-primary italic font-medium lowercase">(optional)</span>
              </label>
              <span className="text-[10px] font-mono text-muted-foreground/40">{config.intentDetail.length}/200</span>
            </div>
            <Textarea
              className="h-24 resize-none border border-border/10 bg-secondary/20 focus-visible:ring-1 focus-visible:ring-primary/10 text-sm leading-relaxed rounded-xl transition-all p-4"
              placeholder="e.g., 'Ensure my research objectives are clearly stated and the tone is persuasive yet academic...'"
              value={config.intentDetail}
              onChange={(e) => setConfig({ ...config, intentDetail: e.target.value.slice(0, 200) })}
            />
            <p className="text-[10px] font-medium text-muted-foreground/40 ml-1">
              the more clearly you describe your goal, the more accurate the review will be.
            </p>
          </div>

          {error && <div className="p-4 mb-4 text-xs font-medium bg-destructive/5 text-destructive rounded-xl border border-destructive/10 animate-in fade-in slide-in-from-top-1">{error}</div>}

          <div className="flex items-center justify-between pt-8 border-t border-border/40">
            <div className="flex flex-col">
              <span className="font-mono text-xs text-muted-foreground uppercase tracking-[0.2em]">Metrics</span>
              <span className="text-base font-bold tabular-nums">{wordCount} Words</span>
            </div>
            <Button
              onClick={handleAnalyze}
              disabled={loading || wordCount < 30}
              className="bg-primary text-primary-foreground h-14 px-12 rounded-2xl text-base font-black shadow-md transition-all disabled:grayscale disabled:opacity-30"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  <span>ANALYZING...</span>
                </div>
              ) : "ANALYZE TEXT"}
            </Button>
          </div>
        </section>

        {/* RIGHT: REPORT AREA */}
        <section className="w-full lg:w-1/2 bg-background overflow-y-auto p-6 md:p-12 scroll-smooth selection:bg-primary/20">
          <div className="flex items-center justify-between mb-12">
            <Button
              variant="ghost"
              onClick={() => setShowHistory(!showHistory)}
              className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-all flex items-center gap-2"
            >
              {showHistory ? <ChevronLeft className="size-3" /> : <History className="size-3" />}
              {showHistory ? "Back to Analysis" : "View History"}
            </Button>
            {results && currentReportId && (
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => currentReportId && downloadReportText(currentReportId)}
                  className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/60 hover:text-primary transition-all flex items-center gap-2"
                >
                  <FileText className="size-3" />
                  Archive .TXT
                </Button>
                <div className="h-4 w-px bg-border/20" />
                <Button
                  variant="ghost"
                  onClick={() => currentReportId && downloadReport(currentReportId)}
                  className="text-xs font-black uppercase tracking-[0.3em] text-primary hover:text-primary/70 transition-all flex items-center gap-2"
                >
                  <Download className="size-3" />
                  Export Brief
                </Button>
              </div>
            )}
          </div>

          {loading ? (
            <AnalysisLoading />
          ) : showHistory ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-4">
              <div className="space-y-4">
                <span className="text-xs font-black text-primary uppercase tracking-[0.4em]">Historical Catalog</span>
                <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-foreground leading-none lowercase">Saved Reviews</h2>
              </div>

              <div className="grid gap-4 pt-8">
                {history.length > 0 ? history.map((h, i) => (
                  <div key={i} className="group p-6 rounded-2xl bg-card border border-border/10 hover:border-primary/20 transition-all flex items-center justify-between cursor-pointer" onClick={() => { setResults(h.analysis); setCurrentReportId(h.id); setShowHistory(false); }}>
                    <div className="flex items-center gap-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <FileText className="size-4 text-primary opacity-40" />
                          <span className="text-sm font-bold text-foreground leading-none lg:line-clamp-1">{h.title}</span>
                        </div>
                        <p className="text-xs text-muted-foreground/60 line-clamp-1">{h.content_preview}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3 shrink-0">
                      <div className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-widest">{new Date(h.created_at).toLocaleDateString()}</div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="icon" variant="ghost" className="size-8 rounded-lg hover:bg-primary/5 text-muted-foreground hover:text-primary" onClick={(e) => { e.stopPropagation(); downloadReportText(h.id); }}>
                          <FileText className="size-3.5" />
                        </Button>
                        <Button size="icon" variant="ghost" className="size-8 rounded-lg hover:bg-primary/5 text-primary" onClick={(e) => { e.stopPropagation(); downloadReport(h.id); }}>
                          <Download className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="py-20 text-center opacity-30 italic font-black text-xs uppercase tracking-[0.5em]">No saved analysis yet</div>
                )}
              </div>
            </div>
          ) : results ? (
            <div className="max-w-2xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="space-y-4 mb-12 text-center lg:text-left">
                <span className="text-xs font-black text-primary uppercase tracking-[0.4em]">Review Complete</span>
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-foreground leading-none">Executive Summary</h2>
              </div>

              <MasterPlanCard content={results.master_action_plan} />

              <div className="relative py-4">
                <Separator className="opacity-20" />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-4 text-xs font-bold text-muted-foreground uppercase tracking-[0.3em] border border-border/10 rounded-full">Specialized Insights</span>
              </div>

              <div className="grid gap-6">
                <ReportCard type="vision" content={results.vision} />
                <ReportCard type="thematic" content={results.thematic} />
                <ReportCard type="lexical" content={results.lexical} />
                <ReportCard type="sentiment" content={results.sentiment} />
                <ReportCard type="ai_signal" content={results.ai_signal} />
              </div>

              <div className="py-20 text-center">
                <div className="h-px w-20 bg-gradient-to-r from-transparent via-border to-transparent mx-auto mb-6" />
                <span className="text-xs text-muted-foreground uppercase tracking-[0.5em] font-medium opacity-50">End of Griffith Analysis</span>
              </div>
            </div>
          ) : (
            <EmptyState />
          )}
        </section>
      </div>
    </div>
  );
}