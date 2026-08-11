"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";
import type { ProductCategory } from "@prisma/client";
import { CATEGORY_LABELS } from "@/lib/utils";

type Status = "idle" | "loading" | "success" | "already" | "error";

export function EmptyStateWaitlist({ category }: { category: ProductCategory }) {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot, must stay empty
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const categoryLabel = CATEGORY_LABELS[category];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, category, website }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Une erreur est survenue.");
      if (data.alreadySubscribed) {
        setStatus("already");
        return;
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    }
  }

  return (
    <div className="glass-card mx-auto flex max-w-xl flex-col items-center gap-4 px-8 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-electric-gradient shadow-glow">
        <Sparkles className="h-7 w-7 text-white" />
      </span>
      <h2 className="font-display text-xl font-semibold text-white">{categoryLabel} arrivent très bientôt</h2>
      <p className="text-sm text-slate-400">
        On prépare une sélection rigoureuse, testée par nos propres agents IA avant publication — on ne met rien en
        ligne qui n&apos;a pas été validé. Laisse ton email pour être prévenu·e en avant-première.
      </p>

      {status === "success" || status === "already" ? (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {status === "already"
            ? "Tu es déjà sur la liste, on te prévient dès que c'est prêt !"
            : "C'est noté ! On te prévient dès que c'est prêt."}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-3 sm:flex-row">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ton@email.fr"
            className="input-field flex-1"
          />
          {/* Honeypot field — hidden from real users, bots tend to fill every input */}
          <input
            type="text"
            name="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />
          <button type="submit" disabled={status === "loading"} className="btn-primary shrink-0 !px-5">
            {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
            Me prévenir en avant-première
          </button>
        </form>
      )}

      {status === "error" && error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
