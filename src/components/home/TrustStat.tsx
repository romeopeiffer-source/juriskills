import type { ReactNode } from "react";

export function TrustStat({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 rounded-[3px] border border-trust/[0.22] bg-night-800/50 p-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[3px] border border-trust/[0.22] bg-night-800 text-trust">
        {icon}
      </span>
      <div>
        <p className="font-display text-sm font-semibold text-white">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  );
}
