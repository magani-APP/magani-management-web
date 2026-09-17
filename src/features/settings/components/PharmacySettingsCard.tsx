"use client";

import { Check, Pencil, Globe2, Building2, FileText, MapPin, Phone, Mail, Clock } from "lucide-react";
import { PharmacySettings } from "@/api/settings.api";
import { PHARMACY_FIELDS } from "@/constants/settings.constants";

interface PharmacySettingsCardProps {
  data: PharmacySettings;
  onChange: (field: keyof PharmacySettings, value: string) => void;
  onSave: () => void;
  isSaving: boolean;
  justSaved: boolean;
}

const FIELD_ICONS: Record<keyof PharmacySettings, React.ReactNode> = {
  name: <Building2 size={14} />,
  licenseNumber: <FileText size={14} />,
  address: <MapPin size={14} />,
  phone: <Phone size={14} />,
  email: <Mail size={14} />,
  hours: <Clock size={14} />,
};

export function PharmacySettingsCard({
  data,
  onChange,
  onSave,
  isSaving,
  justSaved,
}: PharmacySettingsCardProps) {
  return (
    <div className="w-full space-y-5">
      {/* En-tête */}
      <div>
        <h2 className="text-[20px] font-bold text-[#0F1A15]">
          Informations de la pharmacie
        </h2>
        <p className="text-xs text-[#9AAEA3] mt-1 font-medium">
          Apparaissent sur vos reçus et votre application publique.
        </p>
      </div>

      {/* Carte */}
      <div className="bg-white rounded-2xl border border-[#E8EDEA] overflow-hidden">
        {/* En-tête de carte */}
        <div className="flex items-center justify-between gap-4 px-6 py-5 border-b border-[#F0F5F2]">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(11, 143, 104, 0.08)", color: "rgb(11, 143, 104)" }}
            >
              <Building2 size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-[#0F1A15]">Détails de l&apos;établissement</p>
              <p className="text-[11px] text-[#9AAEA3] font-medium mt-0.5">
                Informations principales de votre pharmacie
              </p>
            </div>
          </div>

          <button
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-3xl text-xs font-bold border transition-colors hover:bg-[#F5FAF8]"
            style={{ borderColor: "rgba(11, 143, 104, 0.25)", color: "rgb(11, 143, 104)" }}
          >
            <Globe2 size={13} />
            Informations publiques
          </button>
        </div>

        {/* Champs */}
        <div className="divide-y divide-[#F0F5F2]">
          {PHARMACY_FIELDS.map((field) => (
            <div
              key={field.key}
              className="flex items-center gap-4 px-6 py-4 hover:bg-[#F9FBFA] transition-colors"
            >
              <span className="text-[#9AAEA3] flex-shrink-0">{FIELD_ICONS[field.key]}</span>
              <label
                htmlFor={field.key}
                className="text-[10px] font-bold text-[#9AAEA3] uppercase tracking-[0.07em] w-36 flex-shrink-0"
              >
                {field.label}
              </label>
              <input
                id={field.key}
                name={field.key}
                type="text"
                value={data[field.key]}
                onChange={(e) => onChange(field.key, e.target.value)}
                className="flex-1 text-[13px] text-[#0F1A15] font-semibold bg-transparent outline-none focus:bg-white px-2 py-1 rounded-lg border border-transparent focus:border-[#0B8F68]/30 transition-all"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Action */}
      <button
        type="button"
        onClick={onSave}
        disabled={isSaving}
        className="px-5 py-2.5 rounded-3xl text-white text-xs font-bold hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center gap-2"
        style={{ background: "rgb(11, 143, 104)" }}
      >
        {justSaved ? <Check size={13} strokeWidth={3} /> : <Pencil size={13} />}
        {isSaving
          ? "Enregistrement..."
          : justSaved
          ? "Modifications enregistrées"
          : "Enregistrer les modifications"}
      </button>
    </div>
  );
}
