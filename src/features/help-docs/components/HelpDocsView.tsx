"use client";

import { ReactNode } from "react";
import {
  Search,
  FileText,
  Monitor,
  Info,
  MessageCircle,
  ChevronRight,
  Rocket,
  Package2,
  Wallet,
  BarChart2,
  Settings,
  ShieldCheck,
  Smartphone,
  Zap,
} from "lucide-react";
import {
  HELP_QUICK_LINKS,
  HELP_POPULAR_ARTICLES,
  HELP_CATEGORIES,
  HelpQuickLink,
  HelpCategory,
} from "@/constants/help-docs.constants";

const QUICK_LINK_ICON: Record<HelpQuickLink["icon"], ReactNode> = {
  guides: <FileText size={18} />,
  videos: <Monitor size={18} />,
  faq: <Info size={18} />,
  support: <MessageCircle size={18} />,
};

const QUICK_LINK_STYLE: Record<HelpQuickLink["icon"], { bg: string; color: string }> = {
  guides: { bg: "rgba(11, 143, 104, 0.1)", color: "rgb(11, 143, 104)" },
  videos: { bg: "rgba(59, 130, 246, 0.1)", color: "rgb(59, 130, 246)" },
  faq: { bg: "rgba(139, 92, 246, 0.1)", color: "rgb(139, 92, 246)" },
  support: { bg: "rgba(245, 158, 11, 0.1)", color: "rgb(245, 158, 11)" },
};

const CATEGORY_ICON: Record<HelpCategory["icon"], ReactNode> = {
  start: <Rocket size={16} />,
  stock: <Package2 size={16} />,
  pos: <Wallet size={16} />,
  reports: <BarChart2 size={16} />,
  settings: <Settings size={16} />,
  security: <ShieldCheck size={16} />,
  mobile: <Smartphone size={16} />,
  integrations: <Zap size={16} />,
};

const CATEGORY_STYLE: Record<HelpCategory["icon"], { bg: string; color: string }> = {
  start: { bg: "rgba(11, 143, 104, 0.1)", color: "rgb(11, 143, 104)" },
  stock: { bg: "rgba(59, 130, 246, 0.1)", color: "rgb(59, 130, 246)" },
  pos: { bg: "rgba(245, 158, 11, 0.1)", color: "rgb(245, 158, 11)" },
  reports: { bg: "rgba(139, 92, 246, 0.1)", color: "rgb(139, 92, 246)" },
  settings: { bg: "rgba(244, 63, 94, 0.1)", color: "rgb(244, 63, 94)" },
  security: { bg: "rgba(20, 184, 166, 0.1)", color: "rgb(20, 184, 166)" },
  mobile: { bg: "rgba(34, 197, 94, 0.1)", color: "rgb(34, 197, 94)" },
  integrations: { bg: "rgba(107, 114, 128, 0.1)", color: "rgb(107, 114, 128)" },
};

export function HelpDocsView() {
  return (
    <div className="h-full flex flex-col p-4 md:p-8 gap-6 overflow-hidden">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 flex-shrink-0">
        <div>
          <h1 className="text-[20px] font-bold text-[#0F1A15]">Aide &amp; documentation</h1>
          <p className="text-xs text-[#9AAEA3] mt-1 font-medium">
            Trouvez rapidement des réponses et apprenez à mieux utiliser PharmaOS.
          </p>
        </div>

        <div className="relative w-full md:w-[320px]">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AAEA3]" />
          <input
            type="text"
            placeholder="Rechercher dans la documentation..."
            className="w-full pl-10 pr-4 py-2.5 rounded-3xl text-xs font-medium text-[#0F1A15] bg-white border border-[#E8EDEA] outline-none focus:border-[#0B8F68]/40 transition-colors placeholder:text-[#9AAEA3]"
          />
        </div>
      </div>

      {/* Liens rapides */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-shrink-0">
        {HELP_QUICK_LINKS.map((link) => (
          <button
            key={link.id}
            type="button"
            className="relative text-left bg-white rounded-2xl border border-[#E8EDEA] p-4 hover:shadow-sm transition-shadow"
          >
            <ChevronRight size={14} className="absolute top-4 right-4 text-[#C8D5CC]" />
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center mb-3"
              style={{ background: QUICK_LINK_STYLE[link.icon].bg, color: QUICK_LINK_STYLE[link.icon].color }}
            >
              {QUICK_LINK_ICON[link.icon]}
            </div>
            <p className="text-sm font-bold text-[#0F1A15]">{link.title}</p>
            <p className="text-[11px] text-[#9AAEA3] font-medium mt-0.5">{link.description}</p>
          </button>
        ))}
      </div>

      {/* Articles populaires + Catégories — occupe tout l'espace restant */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-4 flex-1 min-h-0">
        {/* Articles populaires */}
        <div className="bg-white rounded-2xl border border-[#E8EDEA] overflow-hidden flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0F5F2] flex-shrink-0">
            <p className="text-sm font-bold text-[#0F1A15]">Articles populaires</p>
            <button
              type="button"
              className="flex items-center gap-1 text-xs font-bold hover:underline"
              style={{ color: "rgb(11, 143, 104)" }}
            >
              Voir tous les articles
              <ChevronRight size={13} />
            </button>
          </div>

          <div className="flex-1 min-h-0 flex flex-col divide-y divide-[#F0F5F2] overflow-y-auto no-scrollbar">
            {HELP_POPULAR_ARTICLES.map((article) => (
              <button
                key={article.id}
                type="button"
                className="w-full flex-1 flex items-center gap-4 px-6 py-3.5 text-left hover:bg-[#F9FBFA] transition-colors"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#F5F7F5] text-[#6B7A6F]">
                  <FileText size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#0F1A15] truncate">{article.title}</p>
                  <p className="text-[10px] text-[#9AAEA3] font-medium mt-0.5 truncate">
                    {article.description}
                  </p>
                </div>
                <ChevronRight size={14} className="text-[#C8D5CC] flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Catégories */}
        <div className="bg-white rounded-2xl border border-[#E8EDEA] p-5 flex flex-col h-full">
          <p className="text-sm font-bold text-[#0F1A15] mb-4 flex-shrink-0">Catégories</p>
          <div className="flex-1 min-h-0 grid grid-cols-2 grid-rows-4 gap-3">
            {HELP_CATEGORIES.map((category) => (
              <button
                key={category.id}
                type="button"
                className="flex items-center gap-2.5 rounded-xl p-3 text-left transition-opacity hover:opacity-90"
                style={{ background: CATEGORY_STYLE[category.icon].bg }}
              >
                <span
                  className="flex-shrink-0"
                  style={{ color: CATEGORY_STYLE[category.icon].color }}
                >
                  {CATEGORY_ICON[category.icon]}
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-[#0F1A15] truncate">{category.title}</p>
                  <p className="text-[10px] text-[#6B7A6F] font-medium">{category.count} articles</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bannière contact support */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl p-6 border flex-shrink-0"
        style={{ background: "rgba(11, 143, 104, 0.06)", borderColor: "rgba(11, 143, 104, 0.15)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(11, 143, 104, 0.12)", color: "rgb(11, 143, 104)" }}
          >
            <MessageCircle size={18} />
          </div>
          <div>
            <p className="text-sm font-bold text-[#0F1A15]">Vous ne trouvez pas la réponse ?</p>
            <p className="text-xs text-[#6B7A6F] font-medium mt-0.5">
              Notre équipe est là pour vous aider. Contactez-nous et nous vous répondrons rapidement.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="flex items-center gap-2 px-5 py-2.5 rounded-3xl text-white text-xs font-bold hover:opacity-90 transition-opacity flex-shrink-0"
          style={{ background: "rgb(11, 143, 104)" }}
        >
          <MessageCircle size={13} />
          Contacter le support
        </button>
      </div>
    </div>
  );
}
