"use client";

import { useState } from "react";
import { CheckCircle2, Download, Loader2, Mail } from "lucide-react";

type Status = "idle" | "loading" | "success" | "already" | "error";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot, must stay empty
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [freePromptUrl, setFreePromptUrl] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, category: "NEWSLETTER", website }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Une erreur est survenue.");
      if (data.freePromptUrl) setFreePromptUrl(data.freePromptUrl);
      setStatus(data.alreadySubscribed ? "already" : "success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    }
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="glass-card flex flex-col items-center gap-4 px-8 py-12 text-center">
        <h2 className="font-display text-xl font-semibold text-white sm:text-2xl">
          Un prompt gratuit, juste pour toi
        </h2>
        <p className="max-w-xl text-sm text-slate-400">
          Inscris-toi à la newsletter Juriskills et reçois immédiatement, gratuitement, le prompt « Fiche
          d&apos;arrêt guidée pour étudiant en L1 » — le même que dans notre Pack rentrée L1 payant. En prime, tu
          seras prévenu·e en avant-première des nouveaux prompts, skills et agents.
        </p>
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-electric-gradient shadow-glow">
          <Mail className="h-7 w-7 text-white" />
        </span>

        {status === "success" || status === "already" ? (
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              {status === "already" ? "Tu es déjà inscrit·e — voici ton prompt gratuit :" : "Inscription confirmée ! Ton prompt gratuit t'attend :"}
            </div>
            {freePromptUrl && (
              <a href={freePromptUrl} target="_blank" rel="noopener noreferrer" className="btn-primary !px-5">
                <Download className="h-4 w-4" />
                Télécharger le prompt gratuit
              </a>
            )}
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
              Recevoir mon prompt gratuit
            </button>
          </form>
        )}

        {status === "error" && error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    </section>
  );
}
