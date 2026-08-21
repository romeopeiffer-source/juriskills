"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import type { Product } from "@prisma/client";

function toDateInputValue(date: Date | null | undefined) {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 16);
}

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFree, setIsFree] = useState(product?.isFree ?? false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("isPublished", formData.get("isPublished") ? "true" : "false");
    formData.set("isFree", isFree ? "true" : "false");
    if (isFree) formData.set("price", "0");

    try {
      const res = await fetch(product ? `/api/admin/products/${product.id}` : "/api/admin/products", {
        method: product ? "PUT" : "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Une erreur est survenue.");
      router.push("/admin/produits");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card space-y-5 p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Catégorie</label>
          <select name="category" defaultValue={product?.category ?? "PROMPT"} className="input-field" required>
            <option value="PROMPT">Prompt IA</option>
            <option value="SKILL">Skill IA</option>
            <option value="AGENT">Agent IA</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Slug (URL)</label>
          <input name="slug" defaultValue={product?.slug} placeholder="mon-produit" required className="input-field" />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-300">Nom du produit</label>
        <input name="name" defaultValue={product?.name} required className="input-field" />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-300">Description complète</label>
        <textarea
          name="description"
          defaultValue={product?.description}
          rows={5}
          required
          className="input-field resize-none"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Prix (en centimes)</label>
          <input
            type="number"
            name="price"
            defaultValue={product?.price}
            min={0}
            required={!isFree}
            disabled={isFree}
            className="input-field disabled:opacity-50"
          />
          <p className="mt-1 text-xs text-slate-500">
            {isFree ? "Ignoré tant que « Produit gratuit » est coché." : "Ex : 4900 pour 49,00 €"}
          </p>
        </div>
        <div className="flex items-center gap-3 pt-7">
          <input
            type="checkbox"
            id="isPublished"
            name="isPublished"
            defaultChecked={product?.isPublished ?? true}
            className="h-4 w-4 accent-electric-500"
          />
          <label htmlFor="isPublished" className="text-sm text-slate-300">
            Produit publié (visible sur le site)
          </label>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/5 p-4">
        <input
          type="checkbox"
          id="isFree"
          checked={isFree}
          onChange={(e) => setIsFree(e.target.checked)}
          className="h-4 w-4 accent-red-500"
        />
        <label htmlFor="isFree" className="text-sm text-slate-300">
          Produit gratuit — affiché avec un contour rouge et le badge « GRATUIT » côté client, sans passer
          par Stripe.
        </label>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <p className="mb-3 text-sm font-semibold text-white">Réduction (optionnel)</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs text-slate-400">Pourcentage (%)</label>
            <input
              type="number"
              name="discountPercent"
              defaultValue={product?.discountPercent ?? ""}
              min={0}
              max={100}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-slate-400">Ou montant fixe (centimes)</label>
            <input
              type="number"
              name="discountAmount"
              defaultValue={product?.discountAmount ?? ""}
              min={0}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-slate-400">Début (optionnel)</label>
            <input
              type="datetime-local"
              name="discountStart"
              defaultValue={toDateInputValue(product?.discountStart)}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-slate-400">Fin (optionnel)</label>
            <input
              type="datetime-local"
              name="discountEnd"
              defaultValue={toDateInputValue(product?.discountEnd)}
              className="input-field"
            />
            <p className="mt-1 text-xs text-slate-500">
              Une fois cette date renseignée, un compte à rebours s&apos;affiche automatiquement côté client.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Bannière (image)</label>
          <input type="file" name="image" accept="image/*" className="input-field" />
          {product?.imageUrl && <p className="mt-1 text-xs text-slate-500">Une image existe déjà — remplacez-la si besoin.</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Fichier livrable</label>
          <input type="file" name="file" className="input-field" />
          {product?.fileUrl && <p className="mt-1 text-xs text-slate-500">Un fichier existe déjà — remplacez-le si besoin.</p>}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-300">
          Vidéo de démonstration <span className="font-normal text-slate-500">(optionnel)</span>
        </label>
        <input type="file" name="video" accept="video/*" className="input-field" />
        {product?.videoUrl && (
          <p className="mt-1 text-xs text-slate-500">Une vidéo existe déjà — remplacez-la si besoin.</p>
        )}
        <p className="mt-1 text-xs text-slate-500">
          Affichée sur la page produit pour montrer le produit en conditions réelles avant achat.
        </p>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        {product ? "Enregistrer les modifications" : "Créer le produit"}
      </button>
    </form>
  );
}
