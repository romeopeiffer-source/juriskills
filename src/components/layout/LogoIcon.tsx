"use client";

import { useId } from "react";

/**
 * Juriskills brand mark: scales of justice fused with an AI / circuit motif.
 * Self-contained (gradient background included) — drop in at any size.
 * Generated asset; see design brief for the source Python generator if it
 * ever needs to be regenerated at a different fidelity.
 */
export function LogoIcon({ className }: { className?: string }) {
  const uid = useId();
  const bgId = `logo-bg-${uid}`;
  const panFillId = `logo-pan-${uid}`;
  const softId = `logo-soft-${uid}`;

  return (
    <svg viewBox="0 0 512 512" className={className} role="img" aria-label="Juriskills">
      <defs>
        <linearGradient id={bgId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5B21B6" />
          <stop offset="55%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#A78BFA" />
        </linearGradient>
        <linearGradient id={panFillId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#E9E1FF" stopOpacity="0.85" />
        </linearGradient>
        <filter id={softId} x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#2E1065" floodOpacity="0.35" />
        </filter>
      </defs>

      <rect x="0" y="0" width="512" height="512" rx="112" ry="112" fill={`url(#${bgId})`} />
      <path d="M 0 112 A 112 112 0 0 1 112 0 L 317 0 L 0 317 Z" fill="#FFFFFF" opacity="0.06" />

      {/* circuit-trace accents, echoing the AI side of the brand */}
      <path d="M 46 96 L 46 66 L 76 66" fill="none" stroke="#FFFFFF" strokeOpacity="0.3" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="46" cy="96" r="6" fill="#FFFFFF" opacity="0.45" />
      <circle cx="76" cy="66" r="5" fill="#FFFFFF" opacity="0.45" />
      <path d="M 66 116 L 96 116" fill="none" stroke="#FFFFFF" strokeOpacity="0.24" strokeWidth="4" strokeLinecap="round" />
      <circle cx="66" cy="116" r="4.5" fill="#FFFFFF" opacity="0.35" />

      <path d="M 466 416 L 466 446 L 436 446" fill="none" stroke="#FFFFFF" strokeOpacity="0.3" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="466" cy="416" r="6" fill="#FFFFFF" opacity="0.45" />
      <circle cx="436" cy="446" r="5" fill="#FFFFFF" opacity="0.45" />
      <path d="M 446 396 L 416 396" fill="none" stroke="#FFFFFF" strokeOpacity="0.24" strokeWidth="4" strokeLinecap="round" />
      <circle cx="446" cy="396" r="4.5" fill="#FFFFFF" opacity="0.35" />

      {/* scales of justice, crowned with an AI spark, pans reimagined as data nodes */}
      <g filter={`url(#${softId})`}>
        <path d="M 256.00,58.00 L 261.66,72.34 L 276.00,78.00 L 261.66,83.66 L 256.00,98.00 L 250.34,83.66 L 236.00,78.00 L 250.34,72.34 Z" fill="#FFFFFF" />
        <line x1="256.0" y1="100" x2="256.0" y2="152" stroke="#FFFFFF" strokeWidth="14" strokeLinecap="round" />
        <path d="M 226.0 184 L 286.0 184 L 256.0 152 Z" fill="#FFFFFF" />
        <line x1="256.0" y1="184" x2="256.0" y2="372" stroke="#FFFFFF" strokeWidth="16" strokeLinecap="round" />
        <path d="M 192.0 372 L 320.0 372 L 336.0 400 L 176.0 400 Z" fill="#FFFFFF" />
        <path d="M 148 168 Q 256.0 154 364 168" fill="none" stroke="#FFFFFF" strokeWidth="15" strokeLinecap="round" />
        <line x1="148" y1="170" x2="118" y2="244" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
        <line x1="364" y1="170" x2="394" y2="244" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
        <path d="M 118.00,318.00 L 83.36,298.00 L 83.36,258.00 L 118.00,238.00 L 152.64,258.00 L 152.64,298.00 Z" fill={`url(#${panFillId})`} stroke="#FFFFFF" strokeWidth="4" />
        <line x1="118.0" y1="261.2" x2="102.0" y2="289.2" stroke="#6D28D9" strokeWidth="3" strokeOpacity="0.55" />
        <line x1="102.0" y1="289.2" x2="134.0" y2="289.2" stroke="#6D28D9" strokeWidth="3" strokeOpacity="0.55" />
        <line x1="134.0" y1="289.2" x2="118.0" y2="261.2" stroke="#6D28D9" strokeWidth="3" strokeOpacity="0.55" />
        <circle cx="118.0" cy="261.2" r="6.5" fill="#6D28D9" />
        <circle cx="102.0" cy="289.2" r="6.5" fill="#6D28D9" />
        <circle cx="134.0" cy="289.2" r="6.5" fill="#6D28D9" />
        <path d="M 394.00,318.00 L 359.36,298.00 L 359.36,258.00 L 394.00,238.00 L 428.64,258.00 L 428.64,298.00 Z" fill={`url(#${panFillId})`} stroke="#FFFFFF" strokeWidth="4" />
        <line x1="394.0" y1="261.2" x2="378.0" y2="289.2" stroke="#6D28D9" strokeWidth="3" strokeOpacity="0.55" />
        <line x1="378.0" y1="289.2" x2="410.0" y2="289.2" stroke="#6D28D9" strokeWidth="3" strokeOpacity="0.55" />
        <line x1="410.0" y1="289.2" x2="394.0" y2="261.2" stroke="#6D28D9" strokeWidth="3" strokeOpacity="0.55" />
        <circle cx="394.0" cy="261.2" r="6.5" fill="#6D28D9" />
        <circle cx="378.0" cy="289.2" r="6.5" fill="#6D28D9" />
        <circle cx="410.0" cy="289.2" r="6.5" fill="#6D28D9" />
      </g>
    </svg>
  );
}
