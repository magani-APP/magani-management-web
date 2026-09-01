"use client";

import Link from "next/link";
import Image from "next/image";
import { Pill, Sparkles } from "lucide-react";

interface AuthTopbarProps {
  panelKey: string; // nouveau
  mobileImage: string;
}

export function AuthTopbar({ panelKey, mobileImage }: AuthTopbarProps) {
  return (
    <>
      <div className="auth-topbar">
        <Link href="/" className="auth-brand" aria-label="Magani — accueil">
          <span className="auth-brand-mark">
            <Pill strokeWidth={2.4} />
          </span>
          <span>
            <strong>Magani</strong>
            <small>Votre pharmacie, maîtrisée.</small>
          </span>
        </Link>
      </div>

      {/* Visuel mobile uniquement, remplace le panneau latéral sur petit écran */}
      <div className="auth-mobile-visual" aria-hidden="true">
        <Image key={panelKey} src={mobileImage} alt="" fill style={{ objectFit: "cover" }} />
        <span>
          <Sparkles strokeWidth={2} />
          Magani
        </span>
      </div>
    </>
  );
}
