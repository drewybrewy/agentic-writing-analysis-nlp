import { Button } from "@/components/ui/button";
import { LogOut, User as UserIcon } from "lucide-react";

interface NavbarProps {
  userEmail: string;
  onLogout: () => void;
}

export function Navbar({ userEmail, onLogout }: NavbarProps) {
  const userName = userEmail.split("@")[0].charAt(0).toUpperCase() + userEmail.split("@")[0].slice(1);

  return (
    <nav className="flex items-center justify-between border-b border-border/10 bg-card/60 backdrop-blur-2xl px-6 md:px-10 py-4 md:py-5 sticky top-0 z-[100] transition-all">
        <div className="flex flex-col group gap-1 md:gap-1.5 shrink-0">
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-foreground transition-all group-hover:opacity-70 leading-none">
            griffith
          </h1>
          <span className="text-[8px] md:text-[10px] uppercase tracking-[0.4em] font-medium text-primary/60">
            Writing Insights
          </span>
        </div>

      <div className="flex items-center gap-4 md:gap-8">
        <div className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-1.5 md:py-2 rounded-2xl bg-secondary/50 border border-border/20 transition-all hover:bg-secondary/80">
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
            <UserIcon className="h-3 w-3 text-primary" />
          </div>
          <span className="hidden sm:inline text-sm font-bold text-foreground/80 tracking-tight">{userName}</span>
        </div>

        <div className="hidden sm:block h-6 w-px bg-border/40" />

        <Button
          variant="ghost"
          size="sm"
          onClick={onLogout}
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/5 font-bold text-sm uppercase tracking-widest gap-2 transition-all p-2 sm:px-4"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Sign Out</span>
        </Button>
      </div>
    </nav>
  );
}
