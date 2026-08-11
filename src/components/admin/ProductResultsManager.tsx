"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { ProductResult } from "@prisma/client";
import { ArrowDown, ArrowUp, ImageIcon, Loader2, Plus, Trash2, Type } from "lucide-react";

export function ProductResultsManager({
  productId,
  results,
}: {
  productId: string;
  results: ProductResult[];
}) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [resultType, setResultType] = useState<"IMAGE" | "TEXT">("IMAGE");
  const [textContent, setTextContent] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("type", resultType);

    try {
      const res = await fetch(`/api/admin/products/${productId}/results`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Une erreur est survenue.");
      setAdding(false);
      setTextContent("");
      setCaption("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  async function handleMove(resultId: string, direction: "up" | "down") {
    setPendingId(resultId);
    try {
      await fetch(`/api/admin/products/${productId}/results/${resultId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ direction }),
      });
      router.refresh();
    } finally {
      setPendingId(null);
    }
  }

  async function handleDelete(resultId: string) {
    if (!confirm("Supprimer cet exemple de résultat ?")) return;
    setPendingId(resultId);
    try {
      await fetch(`/api/admin/products/${productId}/results/${resultId}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold text-white">Aperçu des résultats</h2>
          <p className="mt-1 text-sm text-slate-500">
            Ajoute des exemples concrets (image ou texte) de ce que produit ce produit. Optionnel.
          </p>
        </div>
        {!adding && (
          <button onClick={() => setAdding(true)} className="btn-secondary !px-4 !py-2 text-sm">
            <Plus className="h-4 w-4" />
            Ajouter un exemple
          </button>
        )}
      </div>

      {adding && (
        <form onSubmit={handleAdd} className="mt-5 space-y-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setResultType("IMAGE")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm ${
                resultType === "IMAGE" ? "bg-electric-gradient text-white" : "bg-white/5 text-slate-300"
              }`}
            >
              <ImageIcon className="h-4 w-4" />
              Image
            </button>
            <button
              type="button"
              onClick={() => setResultType("TEXT")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm ${
                resultType === "TEXT" ? "bg-electric-gradient text-white" : "bg-white/5 text-slate-300"
              }`}
            >
              <Type className="h-4 w-4" />
              Texte
            </button>
          </div>

          {resultType === "IMAGE" ? (
            <input type="file" name="image" accept="image/*" required className="input-field" />
          ) : (
            <textarea
              name="textContent"
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              rows={5}
              placeholder="Colle ici un exemple de résultat produit par le prompt/skill/agent..."
              required
              className="input-field resize-none font-mono text-sm"
            />
          )}

          <input
            name="caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Légende courte (optionnel)"
            className="input-field"
          />

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="btn-primary !px-4 !py-2 text-sm">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Enregistrer l&apos;exemple
            </button>
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="rounded-lg px-4 py-2 text-sm text-slate-400 hover:text-white"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {results.length === 0 ? (
        <p className="mt-5 text-sm text-slate-500">Aucun exemple ajouté pour l&apos;instant.</p>
      ) : (
        <div className="mt-5 space-y-3">
          {results.map((result, index) => (
            <div key={result.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3">
              <div className="flex shrink-0 items-center gap-1">
                <button
                  onClick={() => handleMove(result.id, "up")}
                  disabled={index === 0 || pendingId === result.id}
                  className="rounded p-1 text-slate-400 hover:text-white disabled:opacity-30"
                  aria-label="Monter"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleMove(result.id, "down")}
                  disabled={index === results.length - 1 || pendingId === result.id}
                  className="rounded p-1 text-slate-400 hover:text-white disabled:opacity-30"
                  aria-label="Descendre"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
              </div>

              {result.type === "IMAGE" && result.imageUrl ? (
                <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-night-800">
                  <Image src={result.imageUrl} alt={result.caption ?? ""} fill className="object-cover" />
                </div>
              ) : (
                <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-lg bg-night-800">
                  <Type className="h-5 w-5 text-slate-500" />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-slate-300">
                  {result.type === "IMAGE" ? "Exemple image" : result.textContent}
                </p>
                {result.caption && <p className="truncate text-xs text-slate-500">{result.caption}</p>}
              </div>

              <button
                onClick={() => handleDelete(result.id)}
                disabled={pendingId === result.id}
                className="shrink-0 rounded-lg p-2 text-red-400 hover:bg-red-500/10"
                aria-label="Supprimer"
              >
                {pendingId === result.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
