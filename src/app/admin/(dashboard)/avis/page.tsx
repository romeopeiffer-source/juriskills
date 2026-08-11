import { prisma } from "@/lib/prisma";
import { StarRating } from "@/components/reviews/StarRating";
import { DeleteReviewButton } from "@/components/admin/DeleteReviewButton";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    include: { user: true, product: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white">Avis & commentaires</h1>

      {reviews.length === 0 ? (
        <p className="mt-10 text-slate-400">Aucun avis pour l&apos;instant.</p>
      ) : (
        <div className="mt-8 space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="glass-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium text-white">
                    {review.user.name} <span className="font-normal text-slate-500">— {review.product.name}</span>
                  </p>
                  <div className="mt-1 flex items-center gap-3">
                    <StarRating value={review.rating} readOnly size={14} />
                    <span className="text-xs text-slate-500">{review.createdAt.toLocaleDateString("fr-FR")}</span>
                  </div>
                </div>
                <DeleteReviewButton reviewId={review.id} />
              </div>
              <p className="mt-3 text-sm text-slate-400">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
