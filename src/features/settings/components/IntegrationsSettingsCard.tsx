"use client";

import { Plus, Search } from "lucide-react";
import { TOKENS } from "@/constants/design-tokens.constants";
import { INTEGRATION_TABS, INTEGRATION_CATEGORY_LABELS } from "@/constants/integrations.constants";
import { IntegrationTabId } from "@/types/integrations.types";
import { useIntegrations } from "@/hooks/settings/useIntegrations";
import { IntegrationCard } from "./IntegrationCard";
import { IntegrationDetailDrawer } from "./IntegrationDetailDrawer";
import { MtnMobileMoneyConfigDrawer } from "./MtnMobileMoneyConfigDrawer";

export function IntegrationsSettingsCard() {
  const {
    activeTab,
    setActiveTab,
    tabCounts,
    searchQuery,
    setSearchQuery,
    sections,
    selectedIntegration,
    toggleDetail,
    closeDetail,
  } = useIntegrations();

  return (
    <div className="w-full">
      {/* EN-TÊTE */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="text-base font-bold text-[#0F1A15]">Intégrations</h2>
          <p className="text-xs text-[#9AAEA3] mt-1 font-medium">
            Connectez PharmaOS aux services utilisés par votre pharmacie.
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-white text-xs font-bold whitespace-nowrap hover:opacity-90 transition-opacity"
          style={{ background: "rgb(11, 143, 104)" }}
        >
          <Plus size={14} />
          Ajouter une intégration
        </button>
      </div>

      <div className="flex items-start gap-5">
        {/* COLONNE PRINCIPALE */}
        <div className="flex-1 min-w-0">
          {/* RECHERCHE */}
          <div className="relative mb-3">
            <Search size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AAEA3]" />
            <input
              placeholder="Rechercher une intégration..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-2xl text-xs font-medium outline-none bg-white border border-[#E8EDEA] placeholder:text-[#9AAEA3] text-[#0F1A15] focus:border-[#0B8F68]/40 transition-colors"
            />
          </div>

          {/* ONGLETS */}
          <div className="flex flex-wrap gap-2 mb-6">
            {INTEGRATION_TABS.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as IntegrationTabId)}
                  className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition-colors ${
                    isActive ? "text-white" : "bg-white border border-[#E8EDEA] text-[#6B7A6F] hover:text-[#0F1A15]"
                  }`}
                  style={isActive ? { background: "rgb(11, 143, 104)" } : undefined}
                >
                  {tab.label}
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                      isActive ? "bg-white/20 text-white" : "bg-[#F5F7F5] text-[#9AAEA3]"
                    }`}
                  >
                    {tabCounts[tab.id]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* SECTIONS PAR CATÉGORIE */}
          {sections.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Search size={24} style={{ color: TOKENS.hairline }} className="mb-2" />
              <p className="text-sm font-bold" style={{ color: TOKENS.mutedText }}>
                Aucune intégration trouvée
              </p>
            </div>
          ) : (
            <div className="space-y-7">
              {sections.map((section) => (
                <div key={section.category}>
                  <h3 className="text-sm font-bold mb-3" style={{ color: TOKENS.foreground }}>
                    {INTEGRATION_CATEGORY_LABELS[section.category]}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {section.items.map((integration) => (
                      <IntegrationCard
                        key={integration.id}
                        integration={integration}
                        isSelected={integration.id === selectedIntegration?.id}
                        onClick={() => toggleDetail(integration.id)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PANNEAU DÉTAIL / CONFIGURATION */}
        {selectedIntegration &&
          (selectedIntegration.hasCustomConfig ? (
            <MtnMobileMoneyConfigDrawer integration={selectedIntegration} onClose={closeDetail} />
          ) : (
            <IntegrationDetailDrawer integration={selectedIntegration} onClose={closeDetail} />
          ))}
      </div>
    </div>
  );
}
