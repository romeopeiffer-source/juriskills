import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

export function StudentCountBadge({ count, className }: { count: number; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-sm text-slate-300",
        className
      )}
    >
      <GraduationCap className="h-4 w-4 text-electric-400" />
      <strong className="font-semibold text-white">+{count}</strong> étudiants nous font déjà confiance
    </span>
  );
}
