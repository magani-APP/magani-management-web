"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Bell,
  Calendar as CalendarIcon,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const MONTHS_FR = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

export function Topbar() {
  const pathname = usePathname();
  const isNewSale = pathname.startsWith("/pos");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Le portail (createPortal) a besoin du DOM du navigateur : on ne l'active
  // qu'une fois le composant monté côté client, pour éviter tout souci
  // d'hydratation SSR.
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Calcule la position du menu par rapport au bouton déclencheur. Le menu
  // est rendu dans un portail (document.body) plutôt qu'à l'intérieur du
  // <header>, car le <header> applique un backdrop-blur : combiné à
  // l'animation (transform/scale) du menu, ce filtre provoque un bug de
  // rendu bien connu de Chromium qui fait disparaître le texte de certaines
  // lignes du calendrier (typiquement la ligne du mois sélectionné, celle
  // qui se re-peint le plus souvent). Sortir le menu du <header> via un
  // portail élimine ce conflit filter + transform à la racine.
  const updateCoords = useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setCoords({ top: rect.bottom + 8, left: rect.left });
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    updateCoords();

    function handleReposition() {
      updateCoords();
    }
    // Le scroll peut se produire dans la zone de contenu (pas la fenêtre) :
    // on ferme simplement le menu plutôt que de risquer un mauvais calage.
    function handleScroll() {
      setIsOpen(false);
    }

    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen, updateCoords]);

  // Ferme le popover au clic en dehors (bouton déclencheur ET menu portalé).
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Ferme le popover si on change de page ou si on appuie sur Échap.
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleSelectMonth = (monthIndex: number) => {
    setSelectedDate(new Date(viewYear, monthIndex, 1));
    setIsOpen(false);
  };

  const formattedLabel = `${MONTHS_FR[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;

  // On découpe les mois en lignes explicites de 3 plutôt que de compter sur
  // le dimensionnement implicite d'une grille CSS : ça évite tout calcul de
  // hauteur ambigu et garantit que les 12 mois s'affichent toujours.
  const MONTH_ROWS: { month: string; index: number }[][] = [];
  for (let i = 0; i < MONTHS_FR.length; i += 3) {
    MONTH_ROWS.push(
      MONTHS_FR.slice(i, i + 3).map((month, offset) => ({ month, index: i + offset }))
    );
  }

  const dropdown =
    isOpen && coords ? (
      <div
        ref={dropdownRef}
        style={{ position: "fixed", top: coords.top, left: coords.left }}
        className="w-64 p-3 bg-white border border-border-main rounded-2xl shadow-xl z-[1000]"
      >
        {/* Header Navigation Année */}
        <div className="flex items-center justify-between mb-3 px-1">
          <button
            onClick={() => setViewYear((prev) => prev - 1)}
            className="p-1 rounded-lg hover:bg-surface-muted text-text-secondary transition-colors"
            type="button"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-[13px] font-bold text-text-main">{viewYear}</span>
          <button
            onClick={() => setViewYear((prev) => prev + 1)}
            className="p-1 rounded-lg hover:bg-surface-muted text-text-secondary transition-colors"
            type="button"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Grille des mois — construite ligne par ligne */}
        <div className="flex flex-col gap-1.5">
          {MONTH_ROWS.map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-3 gap-1.5">
              {row.map(({ month, index }) => {
                const isSelected =
                  selectedDate.getMonth() === index && selectedDate.getFullYear() === viewYear;

                return (
                  <button
                    key={month}
                    onClick={() => handleSelectMonth(index)}
                    type="button"
                    className={`py-2 text-[11px] font-medium rounded-xl transition-colors ${
                      isSelected
                        ? "bg-brand-primary text-white shadow-sm font-semibold"
                        : "text-text-secondary hover:bg-surface-muted hover:text-text-main"
                    }`}
                  >
                    {month.slice(0, 4)}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    ) : null;

  return (
    <header className="sticky top-0 z-10 h-[57px] flex items-center px-6 bg-[#F5F7F5]/88 backdrop-blur-[20px] saturate-160 border-b border-brand-primary/10">
      {/* Global Search */}
      <div className="relative w-full max-w-[580px]">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={16} className="text-text-placeholder" />
        </div>
        <input
          type="text"
          className="block w-full py-2 pl-[32px] pr-12 rounded-4xl border border-border-main bg-white/85 text-[12px] font-medium font-geist placeholder:text-text-placeholder focus:outline-none focus:border-brand-primary/40 focus:ring-1 focus:ring-brand-primary/10 transition-colors"
          placeholder="Rechercher un produit, une vente..."
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <kbd className="hidden sm:inline-block font-mono text-[9px] font-bold text-text-placeholder bg-surface-muted px-1.5 py-0.5 rounded border border-border-card">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 ml-6">
        {/* Period Selector (Popover) */}
        <div className="relative" ref={triggerRef}>
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-4xl bg-white hover:shadow-sm transition-all text-text-secondary text-[12px] font-medium border border-border-main cursor-pointer select-none"
          >
            <CalendarIcon size={12} className="text-brand-primary" />
            <span>{formattedLabel}</span>
            <ChevronDown
              size={14}
              className={`text-text-placeholder transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isMounted && dropdown ? createPortal(dropdown, document.body) : null}
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-full hover:bg-white hover:text-brand-primary transition-colors text-text-secondary border border-border-main">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 block w-2 h-2 rounded-full bg-status-danger border-2 border-white"></span>
        </button>

        {/* New Sale CTA */}
        <Link
          href="/pos"
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-4xl text-[12px] font-bold shadow-button active:scale-95 transition-all ${
            isNewSale
              ? "bg-brand-deep text-white"
              : "bg-brand-primary text-white hover:bg-brand-deep"
          }`}
        >
          <Plus size={14} strokeWidth={3} />
          Nouvelle vente
        </Link>
      </div>
    </header>
  );
}
