"use client";

import { useEffect, useState } from "react";
import { Cookie } from "lucide-react";
import { getStoredConsent, storeConsent, type CookieChoice } from "@/lib/cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    if (!getStoredConsent()) setVisible(true);
  }, []);

  function handleChoice(choice: CookieChoice) {
    storeConsent(choice);
    setVisible(false);
  }

  function handleSaveCustom() {
    handleChoice(analytics || marketing ? "accepted" : "essential");
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] p-4 sm:p-6">
      <div className="glass-card mx-auto max-w-3xl border-electric-500/30 bg-night-900/95 p-5 shadow-glow-lg sm:p-6">
        <div className="flex gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-electric-gradient">
            <Cookie className="h-5 w-5 text-white" />
          </span>
          <div className="flex-1">
            <h2 className="font-display text-sm font-semibold text-white">Respect de votre vie privée</h2>
            <p className="mt-1 text-sm text-slate-400">
              Nous utilisons des cookies essentiels au fonctionnement du site. Avec votre accord, nous utilisons
              aussi des cookies de mesure d&apos;audience et marketing. Vous pouvez changer d&apos;avis à tout
              moment.
            </p>

            {customizing && (
              <div className="mt-4 space-y-3 rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">Cookies essentiels</span>
                  <span className="text-xs text-slate-500">Toujours actifs</span>
                </div>
                <label className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">Mesure d&apos;audience</span>
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                    className="h-4 w-4 accent-electric-500"
                  />
                </label>
                <label className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">Marketing</span>
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={(e) => setMarketing(e.target.checked)}
                    className="h-4 w-4 accent-electric-500"
                  />
                </label>
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-3">
              {customizing ? (
                <button onClick={handleSaveCustom} className="btn-primary !px-4 !py-2 text-sm">
                  Enregistrer mes choix
                </button>
              ) : (
                <>
                  <button onClick={() => handleChoice("accepted")} className="btn-primary !px-4 !py-2 text-sm">
                    Accepter
                  </button>
                  <button onClick={() => handleChoice("refused")} className="btn-secondary !px-4 !py-2 text-sm">
                    Refuser
                  </button>
                  <button
                    onClick={() => setCustomizing(true)}
                    className="rounded-lg px-4 py-2 text-sm text-slate-300 underline-offset-4 hover:text-white hover:underline"
                  >
                    Personnaliser
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
