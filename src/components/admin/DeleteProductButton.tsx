"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";

export function DeleteProductButton({ productId }: { productId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Supprimer ce produit ? Cette action est irréversible.")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data.unpublishedOnly) {
        alert(
          "Ce produit a déjà été acheté par au moins un client : il ne peut pas être supprimé définitivement " +
            "(cela casserait l'historique d'achat et les factures de ces clients). Il a donc été masqué du " +
            "catalogue à la place — il reste visible ici avec le statut « Masqué »."
        );
      }
      router.refresh();
    } catch {
      alert("Impossible de supprimer ce produit.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      Supprimer
    </button>
  );
}
