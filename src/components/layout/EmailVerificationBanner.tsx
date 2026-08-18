"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { AlertCircle } from "lucide-react";

export function EmailVerificationBanner() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (status !== "authenticated" || session.user.emailVerified || pathname === "/compte/verification-email") {
    return null;
  }

  return (
    <div className="border-b border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-center text-sm text-amber-300">
      <AlertCircle className="mr-1.5 inline h-4 w-4 -translate-y-0.5" />
      Ton adresse email n&apos;est pas encore vérifiée.{" "}
      <Link href="/compte/verification-email" className="font-medium underline hover:text-amber-200">
        Vérifier maintenant
      </Link>
    </div>
  );
}
