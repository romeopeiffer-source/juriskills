"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  value,
  onChange,
  size = 18,
  readOnly = false,
}: {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
  readOnly?: boolean;
}) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(star)}
          className={cn(!readOnly && "cursor-pointer transition-transform hover:scale-110", readOnly && "cursor-default")}
          aria-label={`${star} étoile${star > 1 ? "s" : ""}`}
        >
          <Star
            size={size}
            className={star <= Math.round(value) ? "fill-discount text-discount" : "fill-transparent text-slate-600"}
          />
        </button>
      ))}
    </div>
  );
}
