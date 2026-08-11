import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function TestedByAIBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-electric-500/30 bg-electric-500/10 px-2.5 py-0.5 text-xs text-electric-400",
        className
      )}
    >
      <Sparkles className="h-3 w-3" />
      Testé par nos agents IA
    </span>
  );
}
