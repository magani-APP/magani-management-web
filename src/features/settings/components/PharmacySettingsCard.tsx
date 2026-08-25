"use client";

import { Check } from "lucide-react";
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
    <div className="max-w-xl space-y-5">
      {/* En-tête */}
      <div>
        <h2 className="text-base font-bold text-[#0F1A15]">
          Informations de la pharmacie
        </h2>
        <p className="text-xs text-[#9AAEA3] mt-1 font-medium">
          Apparaissent sur vos reçus et votre application publique.
        </p>
      </div>

      {/* Carte de champs */}
      <div className="bg-white rounded-2xl border border-[#E8EDEA] overflow-hidden divide-y divide-[#F0F5F2]">
        {PHARMACY_FIELDS.map((field) => (
          <div
            key={field.key}
            className="flex items-center gap-4 px-5 py-4 hover:bg-[#F9FBFA] transition-colors"
          >
            <label
              htmlFor={field.key}
              className="text-[10px] font-bold text-[#9AAEA3] uppercase tracking-[0.07em] w-32 flex-shrink-0"
            >
              {field.label}
            </label>
            <input
              id={field.key}
              name={field.key}
              type="text"
              value={data[field.key]}
              onChange={(e) => onChange(field.key, e.target.value)}
              className="flex-1 text-xs text-[#0F1A15] font-semibold bg-transparent outline-none focus:bg-white px-2 py-1 rounded-lg border border-transparent focus:border-[#0B8F68]/30 transition-all"
            />
          </div>
        ))}
      </div>

      {/* Action */}
      <button
        type="button"
        onClick={onSave}
        disabled={isSaving}
        className="px-5 py-2.5 rounded-3xl text-white text-xs font-bold hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center gap-2"
        style={{ background: "rgb(11, 143, 104)" }}
      >
        {justSaved && <Check size={13} strokeWidth={3} />}
        {isSaving
          ? "Enregistrement..."
          : justSaved
          ? "Modifications enregistrées"
          : "Enregistrer les modifications"}
      </button>
    </div>
  );
}
