"use client";

import { ReactNode, useState } from "react";
import { Copy, Check, ExternalLink, Globe2, ShoppingBag, CalendarClock, Info, Eye } from "lucide-react";
import { TOKENS } from "@/constants/design-tokens.constants";
import { PUBLIC_APP_BASE_URL, PUBLIC_APP_COLOR_OPTIONS, PUBLIC_APP_SECONDARY_COLOR_OPTIONS, PUBLIC_APP_TABS } from "@/constants/public-app.constants";
import { PublicAppPreviewDevice, PublicAppSettings, PublicAppTabId } from "@/types/public-app.types";
import { usePublicAppSettings } from "@/hooks/settings/usePublicAppSettings";
import { Toggle } from "./Toggle";
import { PublicAppMobilePreview } from "./PublicAppMobilePreview";

/** Sélecteur de couleur simple (rond + code hex), utilisé pour les couleurs de marque. */
function ColorPicker({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (hex: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-2.5 rounded-2xl border border-[#E8EDEA] bg-white text-xs font-medium text-[#0F1A15] w-full"
      >
        <span className="w-4 h-4 rounded-full border border-black/5 flex-shrink-0" style={{ background: value }} />
        <span className="flex-1 text-left uppercase">{value}</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 z-20 flex flex-wrap gap-2 p-3 rounded-xl border border-[#E8EDEA] bg-white shadow-lg w-[180px]">
          {options.map((hex) => (
            <button
              key={hex}
              type="button"
              onClick={() => {
                onChange(hex);
                setIsOpen(false);
              }}
              className="w-6 h-6 rounded-full border-2 flex-shrink-0"
              style={{ background: hex, borderColor: hex === value ? TOKENS.foreground : "transparent" }}
              aria-label={hex}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/** Placeholder partagé par les sous-onglets pas encore développés (Produits, Réservations, Informations, Aperçu). */
function PublicAppComingSoon({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 border border-emerald-100"
        style={{ background: "rgb(240, 250, 246)" }}
      >
        <span style={{ color: "rgb(11, 143, 104)" }}>{icon}</span>
      </div>
      <h3 className="text-sm font-bold text-[#0F1A15] mb-1.5">{title}</h3>
      <p className="text-xs text-[#9AAEA3] font-medium leading-relaxed max-w-xs">
        Cette section est en cours de configuration et sera disponible prochainement.
      </p>
    </div>
  );
}

interface GeneralTabProps {
  settings: PublicAppSettings;
  updateField: <K extends keyof PublicAppSettings>(field: K, value: PublicAppSettings[K]) => void;
  updateFeature: (feature: keyof PublicAppSettings["features"], value: boolean) => void;
  toggleOnline: () => void;
  isSaving: boolean;
  justSaved: boolean;
  save: () => void;
}

function GeneralTab({ settings, updateField, updateFeature, toggleOnline, isSaving, justSaved, save }: GeneralTabProps) {
  const [copied, setCopied] = useState(false);

  const appUrl = `${PUBLIC_APP_BASE_URL}/${settings.slug}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      {/* STATUT */}
      <div className="bg-white rounded-2xl border border-[#E8EDEA] p-5 flex items-center gap-4">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(11, 143, 104, 0.08)" }}
        >
          <Globe2 size={16} style={{ color: "rgb(11, 143, 104)" }} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-[#0F1A15]">Statut de l&apos;app</p>
          <p className="text-xs text-[#9AAEA3] mt-0.5 font-medium">
            {settings.isOnline
              ? "Votre application publique est en ligne"
              : "Votre application n'est pas accessible aux clients pour le moment."}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Toggle checked={settings.isOnline} onChange={toggleOnline} label="Statut de l'application publique" />
          <span className="text-[9px] font-bold" style={{ color: settings.isOnline ? "#059669" : "#9AAEA3" }}>
            {settings.isOnline ? "En ligne" : "Hors ligne"}
          </span>
        </div>
      </div>

      {/* LIEN */}
      <div className="bg-white rounded-2xl border border-[#E8EDEA] p-5">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(11, 143, 104, 0.08)" }}
          >
            <ExternalLink size={16} style={{ color: "rgb(11, 143, 104)" }} />
          </div>
          <p className="text-sm font-bold text-[#0F1A15]">Lien de l&apos;application</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-[#E8EDEA] bg-[#F9FBFA]">
          <span className="flex-1 text-xs font-medium text-[#4A5E54] truncate">{appUrl}</span>
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded-lg hover:bg-white transition-colors flex-shrink-0"
            aria-label="Copier le lien"
          >
            {copied ? <Check size={14} className="text-[#059669]" /> : <Copy size={14} className="text-[#9AAEA3]" />}
          </button>
        </div>
        <p className="text-[10px] text-[#9AAEA3] font-medium mt-2">
          Partagez ce lien avec vos clients pour accéder à votre pharmacie en ligne.
        </p>
      </div>

      {/* PERSONNALISATION */}
      <div className="bg-white rounded-2xl border border-[#E8EDEA] p-5">
        <p className="text-sm font-bold text-[#0F1A15] mb-4">Personnalisation</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-[9px] font-bold text-[#9AAEA3] uppercase tracking-[0.06em]">Nom de la pharmacie</label>
            <input
              value={settings.pharmacyName}
              onChange={(e) => updateField("pharmacyName", e.target.value)}
              className="mt-1.5 w-full px-3 py-2.5 rounded-2xl border border-[#E8EDEA] text-xs font-medium text-[#0F1A15] outline-none focus:border-[#0B8F68]/40"
            />
          </div>
          <div>
            <label className="text-[9px] font-bold text-[#9AAEA3] uppercase tracking-[0.06em]">Logo</label>
            <button
              type="button"
              className="mt-1.5 w-full flex items-center gap-2 px-3 py-2 rounded-2xl border border-[#E8EDEA] text-xs font-semibold text-[#0F1A15]"
            >
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: settings.secondaryColor, color: settings.primaryColor }}
              >
                ♥
              </span>
              <span className="text-left">
                <span className="block">Changer le logo</span>
                <span className="block text-[9px] text-[#9AAEA3] font-medium">PNG, JPG (max. 2 Mo)</span>
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[9px] font-bold text-[#9AAEA3] uppercase tracking-[0.06em]">Couleur principale</label>
            <div className="mt-1.5">
              <ColorPicker
                value={settings.primaryColor}
                options={PUBLIC_APP_COLOR_OPTIONS}
                onChange={(hex) => updateField("primaryColor", hex)}
              />
            </div>
          </div>
          <div>
            <label className="text-[9px] font-bold text-[#9AAEA3] uppercase tracking-[0.06em]">Couleur secondaire</label>
            <div className="mt-1.5">
              <ColorPicker
                value={settings.secondaryColor}
                options={PUBLIC_APP_SECONDARY_COLOR_OPTIONS}
                onChange={(hex) => updateField("secondaryColor", hex)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* FONCTIONNALITÉS */}
      <div className="bg-white rounded-2xl border border-[#E8EDEA] p-5">
        <p className="text-sm font-bold text-[#0F1A15] mb-4">Fonctionnalités activées</p>
        <div className="divide-y divide-[#F0F5F2]">
          <div className="flex items-center gap-3 py-3">
            <ShoppingBag size={15} className="text-[#4A5E54] flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-[#0F1A15]">Catalogue des produits</p>
              <p className="text-[10px] text-[#9AAEA3] font-medium">Les clients peuvent consulter vos produits et voir leur disponibilité.</p>
            </div>
            <Toggle checked={settings.features.catalog} onChange={() => updateFeature("catalog", !settings.features.catalog)} />
          </div>
          <div className="flex items-center gap-3 py-3">
            <CalendarClock size={15} className="text-[#4A5E54] flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-[#0F1A15]">Réservations en ligne</p>
              <p className="text-[10px] text-[#9AAEA3] font-medium">Les clients peuvent réserver des produits.</p>
            </div>
            <Toggle
              checked={settings.features.reservations}
              onChange={() => updateFeature("reservations", !settings.features.reservations)}
            />
          </div>
          <div className="flex items-center gap-3 py-3">
            <Info size={15} className="text-[#4A5E54] flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-[#0F1A15]">Informations de la pharmacie</p>
              <p className="text-[10px] text-[#9AAEA3] font-medium">Horaires, contact, adresse et localisation.</p>
            </div>
            <Toggle checked={settings.features.info} onChange={() => updateFeature("info", !settings.features.info)} />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={save}
        disabled={isSaving}
        className="px-5 py-2.5 rounded-2xl text-white text-xs font-bold hover:opacity-90 transition-opacity disabled:opacity-60"
        style={{ background: justSaved ? "#059669" : "rgb(11, 143, 104)" }}
      >
        {isSaving ? "Enregistrement..." : justSaved ? "Modifications enregistrées ✓" : "Enregistrer les modifications"}
      </button>
    </div>
  );
}

export function PublicAppSettingsCard() {
  const [activeTab, setActiveTab] = useState<PublicAppTabId>("general");
  const [device, setDevice] = useState<PublicAppPreviewDevice>("mobile");
  const { settings, updateField, updateFeature, toggleOnline, isSaving, justSaved, save } = usePublicAppSettings();

  const renderTab = () => {
    switch (activeTab) {
      case "general":
        return (
          <GeneralTab
            settings={settings}
            updateField={updateField}
            updateFeature={updateFeature}
            toggleOnline={toggleOnline}
            isSaving={isSaving}
            justSaved={justSaved}
            save={save}
          />
        );
      case "products":
        return <PublicAppComingSoon icon={<ShoppingBag size={20} />} title="Produits" />;
      case "reservations":
        return <PublicAppComingSoon icon={<CalendarClock size={20} />} title="Réservations" />;
      case "info":
        return <PublicAppComingSoon icon={<Info size={20} />} title="Informations" />;
      case "preview":
        return <PublicAppComingSoon icon={<Eye size={20} />} title="Aperçu" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {/* EN-TÊTE */}
      <div className="flex items-start justify-between gap-3 mb-5">
        <div>
          <h2 className="text-base font-bold text-[#0F1A15]">App publique</h2>
          <p className="text-xs text-[#9AAEA3] mt-1 font-medium">
            Personnalisez l&apos;application publique de votre pharmacie.
          </p>
        </div>
        <a
          href={`${PUBLIC_APP_BASE_URL}/${settings.slug}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-xs font-bold whitespace-nowrap"
          style={{ color: "rgb(11, 143, 104)" }}
        >
          Voir l&apos;app en ligne <ExternalLink size={12} />
        </a>
      </div>

      <div className="flex flex-col xl:flex-row items-start gap-6">
        {/* COLONNE PRINCIPALE */}
        <div className="flex-1 min-w-0 w-full">
          {/* SOUS-ONGLETS */}
          <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar" style={{ scrollbarWidth: "none" }}>
            {PUBLIC_APP_TABS.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`shrink-0 px-3.5 py-2 rounded-2xl text-xs font-bold transition-colors ${
                    isActive ? "text-white" : "bg-white border border-[#E8EDEA] text-[#6B7A6F] hover:text-[#0F1A15]"
                  }`}
                  style={isActive ? { background: "rgb(11, 143, 104)" } : undefined}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {renderTab()}
        </div>

        {/* APERÇU MOBILE */}
        <div className="w-full xl:w-[300px] flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-bold text-[#0F1A15]">Aperçu de l&apos;application</p>
              <p className="text-[10px] text-[#9AAEA3] font-medium mt-0.5">
                Voici un aperçu de votre app publique telle que la verront vos clients.
              </p>
            </div>
          </div>
          <div className="flex gap-1.5 mb-4 p-1 rounded-2xl bg-[#F0F5F2] w-fit">
            {(["mobile", "desktop"] as PublicAppPreviewDevice[]).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setDevice(option)}
                className={`px-3 py-1.5 rounded-2xl text-[10px] font-bold capitalize transition-colors ${
                  device === option ? "text-white" : "text-[#6B7A6F]"
                }`}
                style={device === option ? { background: "rgb(11, 143, 104)" } : undefined}
              >
                {option === "mobile" ? "Mobile" : "Desktop"}
              </button>
            ))}
          </div>

          <PublicAppMobilePreview settings={settings} device={device} />

          <div className="flex items-start gap-2 mt-4 px-3 py-2.5 rounded-xl bg-[#F5F7F5] border border-[#E8EDEA]">
            <span className="text-[#9AAEA3] flex-shrink-0">ⓘ</span>
            <p className="text-[9px] text-[#9AAEA3] font-medium leading-relaxed">
              Ceci est un aperçu. Les contenus peuvent varier selon la configuration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
