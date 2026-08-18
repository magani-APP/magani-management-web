"use client";

import { useState, useRef, useEffect } from "react";
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
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const popoverRef = useRef<HTMLDivElement>(null);

  // close the popover when we click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectMonth = (monthIndex: number) => {
    setSelectedDate(new Date(viewYear, monthIndex, 1));
    setIsOpen(false);
  };

  const formattedLabel = `${MONTHS_FR[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;

  return (
    <header className="sticky top-0 z-10 h-[57px] flex items-center px-6 bg-[#F5F7F5]/88 backdrop-blur-[20px] saturate-160 border-b border-brand-primary/10">
      {/* Global Search */}
      <div className="relative w-full max-w-[580px]">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={16} className="text-text-placeholder" />
        </div>
        <input
          type="text"
          className="block w-full py-2 pl-[32px] pr-12 rounded-xl border border-border-main bg-white/85 text-[12px] font-medium font-geist placeholder:text-text-placeholder focus:outline-none focus:border-brand-primary/40 focus:ring-1 focus:ring-brand-primary/10 transition-colors"
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
        <div className="relative" ref={popoverRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:shadow-sm transition-all text-text-secondary text-[12px] font-medium border border-border-main cursor-pointer select-none"
          >
            <CalendarIcon size={15} className="text-brand-primary" />
            <span>{formattedLabel}</span>
            <ChevronDown
              size={14}
              className={`text-text-placeholder transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                }`}
            />
          </button>

          {/* Calendrier / Sélecteur de mois */}
          {isOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 p-3 bg-white border border-border-main rounded-2xl shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
              {/* Header Navigation Année */}
              <div className="flex items-center justify-between mb-3 px-1">
                <button
                  onClick={() => setViewYear((prev) => prev - 1)}
                  className="p-1 rounded-lg hover:bg-surface-muted text-text-secondary transition-colors"
                  type="button"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-[13px] font-bold text-text-main">
                  {viewYear}
                </span>
                <button
                  onClick={() => setViewYear((prev) => prev + 1)}
                  className="p-1 rounded-lg hover:bg-surface-muted text-text-secondary transition-colors"
                  type="button"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Grille des mois */}
              <div className="grid grid-cols-3 gap-1.5">
                {MONTHS_FR.map((month, index) => {
                  const isSelected =
                    selectedDate.getMonth() === index &&
                    selectedDate.getFullYear() === viewYear;

                  return (
                    <button
                      key={month}
                      onClick={() => handleSelectMonth(index)}
                      type="button"
                      className={`py-2 text-[11px] font-medium rounded-xl transition-all ${isSelected
                          ? "bg-brand-primary text-white shadow-sm font-semibold"
                          : "text-text-secondary hover:bg-surface-muted hover:text-text-main"
                        }`}
                    >
                      {month.slice(0, 4)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-full hover:bg-white hover:text-brand-primary transition-colors text-text-secondary border border-transparent hover:border-border-main">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 block w-2 h-2 rounded-full bg-status-danger border-2 border-white"></span>
        </button>

        {/* New Sale CTA */}
        <button className="flex items-center gap-1.5 px-3.5 py-2 bg-brand-primary text-white rounded-xl text-[12px] font-bold shadow-button hover:bg-brand-deep active:scale-95 transition-all">
          <Plus size={14} strokeWidth={3} />
          Nouvelle vente
        </button>
      </div>
    </header>
  );
}