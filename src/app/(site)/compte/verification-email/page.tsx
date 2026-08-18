"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { CheckCircle2, Loader2, MailCheck } from "lucide-react";

export default function VerificationEmailPage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [resendState, setResendState] = useState<"idle" | "loading" | "sent">("idle");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/compte/connexion?callbackUrl=/compte/verification-email");
    }
    // Skip the "already verified, redirect away" check once we've just verified in this
    // page — otherwise the session refresh after a successful check bounces the user home
    // before the success screen below ever gets a chance to render.
    if (status === "authenticated" && session.user.emailVerified && !verified) {
      router.push("/");
    }
  }, [status, session, router, verified]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Une erreur est survenue.");

      await update();
      setVerified(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResendState("loading");
    setError(null);
    try {
      const res = await fetch("/api/verify-email/resend", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Une erreur est survenue.");
      setResendState("sent");
    } catch (err) {
      setResendState("idle");
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    }
  }

  if (status === "loading" || status === "unauthenticated") {
    return null;
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
      <div className="glass-card p-8 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-electric-gradient shadow-glow">
          <MailCheck className="h-7 w-7 text-white" />
        </span>

        {verified ? (
          <>
            <h1 className="mt-6 font-display text-xl font-bold text-white">Email vérifié !</h1>
            <p className="mt-3 flex items-center justify-center gap-2 text-sm text-emerald-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Ton compte est maintenant pleinement actif. Un email de bienvenue vient de t&apos;être envoyé.
            </p>
            <Link href="/prompts" className="btn-primary mt-6 w-full">
              Découvrir le catalogue
            </Link>
          </>
        ) : (
          <>
            <h1 className="mt-6 font-display text-xl font-bold text-white">Vérifie ton adresse email</h1>
            <p className="mt-3 text-sm text-slate-400">
              On t&apos;a envoyé un code à 6 chiffres à <strong className="text-slate-300">{session?.user?.email}</strong>.
              Saisis-le ci-dessous pour activer ton compte.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                required
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                className="input-field text-center text-2xl tracking-[0.5em]"
              />

              {error && <p className="text-sm text-red-400">{error}</p>}

              <button type="submit" disabled={loading || code.length !== 6} className="btn-primary w-full">
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Vérifier mon email
              </button>
            </form>

            <p className="mt-6 text-sm text-slate-500">
              Pas reçu de code ?{" "}
              {resendState === "sent" ? (
                <span className="text-emerald-400">Un nouveau code vient d&apos;être envoyé.</span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendState === "loading"}
                  className="font-medium text-electric-400 hover:underline disabled:opacity-50"
                >
                  Renvoyer le code
                </button>
              )}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
