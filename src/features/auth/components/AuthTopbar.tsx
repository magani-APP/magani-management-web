"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Pill, LayoutDashboard, ArrowRight, Sparkles } from "lucide-react";

interface AuthTopbarProps {
  panelKey: string; // nouveau
  mobileImage: string;
}

export function AuthTopbar({ panelKey, mobileImage }: AuthTopbarProps) {
  const router = useRouter();

  return (
    <>
      <div className="auth-topbar">
        <Link href="/" className="auth-brand" aria-label="PharmaOS — accueil">
          <span className="auth-brand-mark">
            <Pill strokeWidth={2.4} />
          </span>
          <span>
            <strong>PharmaOS</strong>
            <small>Votre pharmacie, maîtrisée.</small>
          </span>
        </Link>

        <button type="button" className="auth-dashboard-shortcut" onClick={() => router.push("/")}>
          <LayoutDashboard strokeWidth={2} />
          <span>Voir le dashboard</span>
          <ArrowRight strokeWidth={2} />
        </button>
      </div>

      {/* Visuel mobile uniquement, remplace le panneau latéral sur petit écran */}
      <div className="auth-mobile-visual" aria-hidden="true">
        <Image key={panelKey} src={mobileImage} alt="" fill style={{ objectFit: "cover" }} />
        <span>
          <Sparkles strokeWidth={2} />
          PharmaOS
        </span>
      </div>
    </>
  );
}
