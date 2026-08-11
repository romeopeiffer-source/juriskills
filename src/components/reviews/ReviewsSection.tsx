"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, MessageSquare } from "lucide-react";
import { StarRating } from "@/components/reviews/StarRating";

type Review = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  userName: string;
};

export function ReviewsSection({ productId, reviews }: { productId: string; reviews: Review[] }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [list, setList] = useState(reviews);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setError("Merci de choisir une note.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Impossible d'enregistrer votre avis.");
      setList((prev) => [
        { id: data.id, rating, comment, createdAt: new Date().toISOString(), userName: session?.user?.name ?? "Vous" },
        ...prev,
      ]);
      setRating(0);
      setComment("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-white">Avis & commentaires</h2>

      <div className="glass-card mt-6 p-6">
        {status === "authenticated" ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium text-slate-300">Votre note</p>
              <StarRating value={rating} onChange={setRating} size={24} />
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Partagez votre expérience avec ce produit..."
              rows={3}
              required
              className="input-field resize-none"
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button type="submit" disabled={submitting} className="btn-primary text-sm">
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Publier mon avis
            </button>
          </form>
        ) : (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <MessageSquare className="h-8 w-8 text-slate-500" />
            <p className="text-sm text-slate-400">Connectez-vous pour noter et commenter ce produit.</p>
            <button onClick={() => router.push("/compte/connexion")} className="btn-secondary text-sm">
              Se connecter
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 space-y-5">
        {list.length === 0 ? (
          <p className="text-sm text-slate-500">Aucun avis pour l&apos;instant. Soyez le premier à donner votre avis.</p>
        ) : (
          list.map((review) => (
            <div key={review.id} className="glass-card p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-white">{review.userName}</span>
                  <StarRating value={review.rating} readOnly size={14} />
                </div>
                <span className="text-xs text-slate-500">
                  {new Date(review.createdAt).toLocaleDateString("fr-FR")}
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-400">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
