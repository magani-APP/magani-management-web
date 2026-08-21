"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { PharmacySettings } from "@/api/settings.api";
import { PHARMACY_FIELDS } from "@/constants/settings.constants";

interface PharmacySettingsCardProps {
  data: PharmacySettings;
  onChange: (field: keyof PharmacySettings, value: string) => void;
  onSave: () => void;
  isSaving: boolean;
  justSaved: boolean;
}

export function PharmacySettingsCard({
  data,
  onChange,
  onSave,
  isSaving,
  justSaved,
}: PharmacySettingsCardProps) {
  return (
    <div className="max-w-[650px]">
      {/* En-tête */}
      <h1 className="text-[20px] font-bold text-text-primary tracking-tight mb-1">
        Informations de la pharmacie
      </h1>
      <p className="text-[13px] font-medium text-text-muted mb-5">
        Apparaissent sur vos reçus et votre application publique.
      </p>

      {/* Carte de champs */}
      <div className="rounded-2xl border border-border-card bg-white overflow-hidden">
        {PHARMACY_FIELDS.map((field, index) => (
          <div
            key={field.key}
            className={cn(
              "grid grid-cols-[160px_1fr] items-center gap-4 px-6 py-4",
              index % 2 === 1 && "bg-surface-alt",
              index !== PHARMACY_FIELDS.length - 1 && "border-b border-border-divider"
            )}
          >
            <label
              htmlFor={field.key}
              className="text-[10px] font-bold text-text-muted uppercase tracking-[0.06em]"
            >
              {field.label}
            </label>
            <input
              id={field.key}
              name={field.key}
              type="text"
              value={data[field.key]}
              onChange={(e) => onChange(field.key, e.target.value)}
              className="w-full bg-transparent text-[13px] font-bold text-text-primary placeholder:text-text-placeholder placeholder:font-medium focus:outline-none rounded-lg -mx-2 px-2 py-1 focus:bg-white focus:ring-1 focus:ring-brand-primary/30 transition-colors"
            />
          </div>
        ))}
      </div>

      {/* Action */}
      <button
        type="button"
        onClick={onSave}
        disabled={isSaving}
        className="mt-6 flex items-center gap-2 px-4 py-2.5 bg-brand-primary text-white rounded-4xl text-[13px] font-bold shadow-button hover:bg-brand-deep active:scale-95 disabled:opacity-60 disabled:active:scale-100 transition-all"
      >
        {justSaved && <Check size={14} strokeWidth={3} />}
        {isSaving
          ? "Enregistrement..."
          : justSaved
          ? "Modifications enregistrées"
          : "Enregistrer les modifications"}
      </button>
    </div>
  );
}
