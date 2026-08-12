"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductResult } from "@prisma/client";
import { X } from "lucide-react";
import { TestedByAIBadge } from "@/components/ui/TestedByAIBadge";

export function ProductResultsSection({ results }: { results: ProductResult[] }) {
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  return (
    <div className="mt-16">
      <div className="flex items-center gap-2">
        <h2 className="font-display text-xl font-bold text-white">Aperçu des résultats</h2>
        <TestedByAIBadge />
      </div>

      {results.length === 0 ? (
        <div className="glass-card mt-5 flex flex-col items-center gap-2 px-8 py-10 text-center">
          <p className="text-sm text-slate-400">Aperçu à venir</p>
          <p className="text-xs text-slate-600">
            Des exemples concrets de résultats seront bientôt ajoutés pour ce produit.
          </p>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {results.map((result) =>
            result.type === "IMAGE" && result.imageUrl ? (
              <button
                key={result.id}
                onClick={() => setLightboxUrl(result.imageUrl)}
                className="glass-card group relative aspect-video overflow-hidden text-left"
              >
                <Image
                  src={result.imageUrl}
                  alt={result.caption ?? "Exemple de résultat"}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {result.caption && (
                  <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night-950/90 to-transparent px-3 py-2 text-xs text-slate-200">
                    {result.caption}
                  </p>
                )}
              </button>
            ) : (
              <div key={result.id} className="glass-card flex flex-col gap-2 border-trust/[0.22] bg-white/[0.03] p-4">
                <span className="w-fit rounded-[3px] bg-trust/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-trust">
                  Exemple de résultat
                </span>
                <p className="whitespace-pre-line font-mono text-xs leading-relaxed text-slate-300">
                  {result.textContent}
                </p>
                {result.caption && <p className="text-xs text-slate-500">{result.caption}</p>}
              </div>
            )
          )}
        </div>
      )}

      {lightboxUrl && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-night-950/90 p-6 backdrop-blur-sm"
          onClick={() => setLightboxUrl(null)}
        >
          <button
            className="absolute right-6 top-6 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            onClick={() => setLightboxUrl(null)}
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="relative h-full w-full max-w-4xl">
            <Image src={lightboxUrl} alt="Exemple de résultat en grand" fill className="object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
