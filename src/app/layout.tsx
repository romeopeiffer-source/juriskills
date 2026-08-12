import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";

export const metadata: Metadata = {
  title: "Juriskills — Marketplace IA pour juristes",
  description:
    "Créé par des étudiants, pour des étudiants : prompts, skills et agents IA testés pour le droit, qualité garantie, prix étudiant, paiement 100% sécurisé.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="flex min-h-screen flex-col font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
