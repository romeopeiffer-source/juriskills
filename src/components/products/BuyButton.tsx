"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { CreditCard, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/pricing";

export function BuyButton({
  productId,
  productSlug,
  productName,
  price,
}: {
  productId: string;
  productSlug: string;
  productName: string;
  price: number;
}) {
  const { status } = useSession();
  const router = useRouter();
  const [showRecap, setShowRecap] = useState(false);
  const [withdrawalWaived, setWithdrawalWaived] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleShowRecap() {
    if (status !== "authenticated") {
      router.push(`/compte/connexion?callbackUrl=/produits/${productSlug}`);
      return;
    }
    setShowRecap(true);
  }

  async function handleBuy() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, withdrawalWaived: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Une erreur est survenue.");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Une erreur est survenue.");
      setLoading(false);
    }
  }

  if (!showRecap) {
    return (
      <button onClick={handleShowRecap} className="btn-primary w-full sm:w-auto">
        <CreditCard className="h-4 w-4" />
        Acheter maintenant
      </button>
    );
  }

  return (
    <div className="glass-card w-full space-y-3 p-4 sm:max-w-sm">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-300">{productName}</span>
        <span className="font-semibold text-white">{formatPrice(price)} TTC</span>
      </div>
      <p className="text-xs text-slate-500">
        Accès immédiat au contenu numérique dès la confirmation du paiement.
      </p>

      <label className="flex items-start gap-2 text-xs text-slate-400">
        <input
          type="checkbox"
          checked={withdrawalWaived}
          onChange={(e) => setWithdrawalWaived(e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-electric-500"
        />
        <span>
          Je demande l&apos;exécution immédiate de ce contenu numérique et renonce expressément à mon droit
          de rétractation de 14 jours.
        </span>
      </label>

      <button onClick={handleBuy} disabled={!withdrawalWaived || loading} className="btn-primary w-full">
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Commande avec obligation de paiement
      </button>

      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
