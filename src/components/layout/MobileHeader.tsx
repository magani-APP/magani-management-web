"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, Plus, HeartPulse } from "lucide-react";

const SECTION_LABELS: { match: string; label: string }[] = [
  { match: "/pos", label: "Caisse" },
  { match: "/inventory", label: "Stock" },
  { match: "/reservations", label: "Réservations" },
  { match: "/reports", label: "Rapports" },
  { match: "/activity", label: "Journal" },
  { match: "/settings", label: "Paramètres" },
  { match: "/help", label: "Aide" },
];

function sectionLabelFor(pathname: string): string {
  const found = SECTION_LABELS.find((entry) => pathname.startsWith(entry.match));
  return found?.label ?? "Vue d'ensemble";
}

export function MobileHeader() {
  const pathname = usePathname();
  const sectionLabel = sectionLabelFor(pathname);

  return (
    <header className="flex lg:hidden flex-col sticky top-0 z-10 bg-[#F5F7F5]/92 backdrop-blur-[20px] saturate-160 border-b border-brand-primary/10">
      <div className="flex items-center justify-between h-[57px] px-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white shrink-0">
            <HeartPulse size={15} />
          </div>
          <div className="min-w-0">
            <h1 className="text-text-primary text-[14px] font-bold leading-none tracking-tight">
              Magani
            </h1>
            <p className="text-text-placeholder text-[10px] font-medium leading-none uppercase tracking-[0.05em] mt-1 truncate">
              {sectionLabel}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            className="relative p-2 rounded-full bg-white text-text-secondary border border-border-main active:scale-95 transition-transform"
          >
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 block w-2 h-2 rounded-full bg-status-danger border-2 border-white" />
          </button>
          <Link
            href="/pos"
            className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-primary text-white shadow-button active:scale-95 transition-transform"
          >
            <Plus size={16} strokeWidth={3} />
          </Link>
        </div>
      </div>

      <div className="px-4 pb-3">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-text-placeholder" />
          </div>
          <input
            type="text"
            className="block w-full py-2 pl-[32px] pr-3 rounded-4xl border border-border-main bg-white/85 text-[12px] font-medium font-geist placeholder:text-text-placeholder focus:outline-none focus:border-brand-primary/40 focus:ring-1 focus:ring-brand-primary/10 transition-colors"
            placeholder="Rechercher un produit, une vente..."
          />
        </div>
      </div>
    </header>
  );
}
