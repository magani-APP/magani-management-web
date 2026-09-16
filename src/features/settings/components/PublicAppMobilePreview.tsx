"use client";

import { Heart, Menu, Search, Pill, Syringe, Sparkles, HandHeart, LayoutGrid, Package, CalendarCheck, User } from "lucide-react";
import { PublicAppPreviewDevice, PublicAppSettings } from "@/types/public-app.types";
import { mockPublicAppPreviewCategories, mockPublicAppPreviewProducts } from "@/mocks/public-app.mock";
import { formatPrice } from "@/utils/format.util";

const CATEGORY_ICONS = {
  pill: Pill,
  syringe: Syringe,
  vitamin: Sparkles,
  care: HandHeart,
};

interface PublicAppMobilePreviewProps {
  settings: PublicAppSettings;
  device: PublicAppPreviewDevice;
}

function PreviewContent({ settings }: { settings: PublicAppSettings }) {
  return (
    <div className="bg-[#F9FBFA] h-full overflow-y-auto no-scrollbar" style={{ scrollbarWidth: "none" }}>
      {/* EN-TÊTE */}
      <div className="flex items-center gap-2.5 px-4 pt-4 pb-3 bg-white">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: settings.secondaryColor }}
        >
          <Heart size={16} style={{ color: settings.primaryColor }} fill={settings.primaryColor} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-bold text-[#0F1A15] truncate">{settings.pharmacyName || "Ma pharmacie"}</p>
          <p className="text-[9px] text-[#9AAEA3] font-medium truncate">Votre santé, notre priorité</p>
        </div>
        <Menu size={16} className="text-[#4A5E54] flex-shrink-0" />
      </div>

      <div className="px-4 pb-4 space-y-4">
        {/* RECHERCHE */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-[#E8EDEA]">
          <Search size={12} className="text-[#9AAEA3]" />
          <span className="text-[10px] text-[#9AAEA3] font-medium">chercher un médicament</span>
        </div>

        {settings.features.catalog && (
          <>
            {/* BANNIÈRE */}
            <div className="rounded-2xl px-4 py-3.5 text-white" style={{ background: settings.primaryColor }}>
              <p className="text-[12px] font-bold leading-tight">Des produits de qualité à portée de main</p>
              <p className="text-[9px] font-medium mt-1 opacity-90 leading-snug">
                Réservez vos médicaments en ligne et retirez-les en pharmacie.
              </p>
              <div className="flex gap-1 mt-2.5">
                <span className="w-3 h-1 rounded-full bg-white" />
                <span className="w-1 h-1 rounded-full bg-white/50" />
                <span className="w-1 h-1 rounded-full bg-white/50" />
              </div>
            </div>

            {/* CATÉGORIES */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-bold text-[#0F1A15]">Catégories</p>
                <p className="text-[9px] font-semibold" style={{ color: settings.primaryColor }}>
                  Voir tout
                </p>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {mockPublicAppPreviewCategories.map((cat) => {
                  const Icon = CATEGORY_ICONS[cat.icon];
                  return (
                    <div key={cat.id} className="flex flex-col items-center gap-1">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center"
                        style={{ background: settings.secondaryColor }}
                      >
                        <Icon size={14} style={{ color: settings.primaryColor }} />
                      </div>
                      <p className="text-[8px] font-medium text-[#4A5E54] text-center leading-tight">{cat.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* PRODUITS POPULAIRES */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-bold text-[#0F1A15]">Produits populaires</p>
                <p className="text-[9px] font-semibold" style={{ color: settings.primaryColor }}>
                  Voir tout
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {mockPublicAppPreviewProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-xl border border-[#E8EDEA] p-2">
                    <div className="w-full h-12 rounded-lg mb-1.5" style={{ background: product.swatch }} />
                    <p className="text-[9px] font-bold text-[#0F1A15] truncate">{product.name}</p>
                    <p className="text-[8px] text-[#9AAEA3] font-medium">{product.subtitle}</p>
                    <p className="text-[10px] font-bold text-[#0F1A15] mt-1">{formatPrice(product.price)} FCFA</p>
                    {settings.features.reservations && (
                      <button
                        type="button"
                        className="w-full mt-1.5 py-1 rounded-lg text-[8px] font-bold text-white"
                        style={{ background: settings.primaryColor }}
                      >
                        Réserver
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {!settings.features.catalog && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Package size={20} className="text-[#C8D5CC] mb-2" />
            <p className="text-[10px] font-medium text-[#9AAEA3]">Le catalogue est désactivé pour l&apos;app publique.</p>
          </div>
        )}
      </div>

      {/* NAV BASSE */}
      <div className="flex items-center justify-around px-2 py-2.5 bg-white border-t border-[#F0F5F2] sticky bottom-0">
        {[
          { icon: LayoutGrid, label: "Accueil", active: true },
          { icon: Package, label: "Produits", active: false },
          { icon: CalendarCheck, label: "Réservations", active: false },
          { icon: User, label: "Profil", active: false },
        ].map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-0.5">
            <item.icon size={14} style={{ color: item.active ? settings.primaryColor : "#9AAEA3" }} />
            <p
              className="text-[7px] font-bold"
              style={{ color: item.active ? settings.primaryColor : "#9AAEA3" }}
            >
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PublicAppMobilePreview({ settings, device }: PublicAppMobilePreviewProps) {
  if (device === "desktop") {
    return (
      <div className="rounded-2xl border border-[#E8EDEA] overflow-hidden bg-white shadow-sm">
        <div className="flex items-center gap-1.5 px-3 py-2 bg-[#F5F7F5] border-b border-[#E8EDEA]">
          <span className="w-2 h-2 rounded-full bg-[#FCA5A5]" />
          <span className="w-2 h-2 rounded-full bg-[#FDE68A]" />
          <span className="w-2 h-2 rounded-full bg-[#BBF7D0]" />
          <span className="flex-1 text-center text-[9px] font-medium text-[#9AAEA3] truncate">
            pharmaos.cm/{settings.slug}
          </span>
        </div>
        <div className="h-[420px]">
          <PreviewContent settings={settings} />
        </div>
      </div>
    );
  }

  return (
    <div
      className="mx-auto rounded-[2rem] border-[6px] border-[#0F1A15] overflow-hidden bg-white shadow-lg"
      style={{ width: 220 }}
    >
      <div className="flex items-center justify-between px-4 pt-2 pb-1 bg-white">
        <span className="text-[9px] font-bold text-[#0F1A15]">9:41</span>
        <span className="w-3 h-3 rounded-full bg-[#0F1A15]" />
      </div>
      <div className="h-[440px]">
        <PreviewContent settings={settings} />
      </div>
    </div>
  );
}
