"use client";

import { useEffect, useState } from "react";
import { Timer } from "lucide-react";

function formatRemaining(ms: number): string {
  if (ms <= 0) return "";
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days >= 1) return `${days}j ${hours}h`;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function PromoCountdown({ endsAt, size = "sm" }: { endsAt: string; size?: "sm" | "lg" }) {
  const target = new Date(endsAt).getTime();
  const [remaining, setRemaining] = useState(() => target - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(target - Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [target]);

  if (remaining <= 0) return null;

  return (
    <span
      className={
        size === "lg"
          ? "inline-flex items-center gap-1.5 rounded-full border border-discount/30 bg-discount/10 px-3 py-1 text-sm font-medium text-discount"
          : "inline-flex items-center gap-1 rounded-full border border-discount/30 bg-discount/10 px-2 py-0.5 text-xs font-medium text-discount"
      }
    >
      <Timer className={size === "lg" ? "h-4 w-4" : "h-3 w-3"} />
      Se termine dans {formatRemaining(remaining)}
    </span>
  );
}
