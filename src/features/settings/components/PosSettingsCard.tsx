"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Calendar, ChevronDown, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { TOKENS } from "@/constants/design-tokens.constants";
import {
  POS_SALE_TABS,
  POS_SALE_DATE_FILTER_OPTIONS,
  POS_SALE_PAYMENT_FILTER_OPTIONS,
  POS_SALE_PAYMENT_PILLS,
  POS_SALE_CASHIER_FILTER_OPTIONS,
} from "@/constants/pos-sales.constants";
import { PosSalePaymentMethod } from "@/types/pos-sales.types";
import { formatPrice } from "@/utils/format.util";
import { usePosSales } from "@/hooks/settings/usePosSales";
import { ReceiptAvatar, getReceiptInitials } from "./ReceiptAvatar";
import { PosPaymentMethodBadge, PosSaleStatusBadge } from "./PosBadges";
import { PosSaleDetailDrawer } from "./PosSaleDetailDrawer";

function formatTableDate(date: string): string {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(date));
}

interface GenericDropdownProps<T extends string> {
  icon?: React.ReactNode;
  value: T;
  options: { id: T; label: string }[];
  onChange: (value: T) => void;
}

function GenericDropdown<T extends string>({ icon, value, options, onChange }: GenericDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const activeLabel = options.find((o) => o.id === value)?.label ?? "";

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-medium bg-white border border-[#E8EDEA] text-[#4A5E54] hover:border-[#0B8F68]/30 transition-colors whitespace-nowrap"
      >
        {icon}
        {activeLabel}
        <ChevronDown size={12} className={`text-[#9AAEA3] transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 z-20 min-w-[180px] rounded-xl border border-[#E8EDEA] bg-white shadow-lg py-1">
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                onChange(option.id);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors ${
                option.id === value ? "text-[#0B8F68] bg-[#F0FAF6]" : "text-[#4A5E54] hover:bg-[#F5F7F5]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function PosSettingsCard() {
  const {
    activeTab,
    setActiveTab,
    tabCounts,
    searchQuery,
    setSearch,
    dateFilter,
    setDateFilter,
    paymentFilter,
    setPaymentFilter,
    cashierFilter,
    setCashierFilter,
    paginatedSales,
    filteredSales,
    currentPage,
    totalPages,
    setPage,
    rangeStart,
    rangeEnd,
    selectedSale,
    toggleSaleDetail,
    closeDetail,
    handleExport,
  } = usePosSales();

  return (
    <div className="w-full">
      {/* EN-TÊTE */}
      <div className="flex items-start justify-between gap-3 mb-5">
        <div>
          <h2 className="text-base font-bold text-[#0F1A15]">Caisse</h2>
          <p className="text-xs text-[#9AAEA3] mt-1 font-medium">
            Suivez les encaissements réalisés dans votre pharmacie.
          </p>
        </div>
        <button
          type="button"
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold border border-[#E8EDEA] text-[#4A5E54] hover:border-[#0B8F68]/30 transition-colors whitespace-nowrap"
        >
          <Download size={13} /> Exporter
        </button>
      </div>

      <div className="flex items-start gap-5">
        {/* COLONNE PRINCIPALE */}
        <div className="flex-1 min-w-0">
          {/* ONGLETS STATUT */}
          <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar" style={{ scrollbarWidth: "none" }}>
            {POS_SALE_TABS.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
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

          {/* RECHERCHE + FILTRES */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-2 mb-3">
            <div className="relative flex-1 lg:max-w-[480px]">
              <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9AAEA3]" />
              <input
                placeholder="Rechercher une vente, un client ou une référence..."
                value={searchQuery}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-2xl text-xs font-medium outline-none bg-white border border-[#E8EDEA] placeholder:text-[#9AAEA3] text-[#0F1A15] focus:border-[#0B8F68]/40 transition-colors"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <GenericDropdown
                icon={<Calendar size={12} className="text-[#9AAEA3]" />}
                value={dateFilter}
                options={POS_SALE_DATE_FILTER_OPTIONS.map((d) => ({ id: d, label: d }))}
                onChange={setDateFilter}
              />
              <GenericDropdown<PosSalePaymentMethod | "all">
                value={paymentFilter}
                options={POS_SALE_PAYMENT_FILTER_OPTIONS}
                onChange={setPaymentFilter}
              />
              <GenericDropdown value={cashierFilter} options={POS_SALE_CASHIER_FILTER_OPTIONS} onChange={setCashierFilter} />
            </div>
          </div>

          {/* PASTILLES MOYEN DE PAIEMENT */}
          <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar" style={{ scrollbarWidth: "none" }}>
            {POS_SALE_PAYMENT_PILLS.map((pill) => {
              const isActive = pill.id === paymentFilter;
              return (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setPaymentFilter(pill.id)}
                  className={`shrink-0 px-3.5 py-2 rounded-2xl text-xs font-bold transition-colors ${
                    isActive ? "text-white" : "bg-white border border-[#E8EDEA] text-[#6B7A6F] hover:text-[#0F1A15]"
                  }`}
                  style={isActive ? { background: "rgb(11, 143, 104)" } : undefined}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>

          {/* TABLEAU */}
          <div className="bg-white rounded-2xl border border-[#E8EDEA] overflow-hidden overflow-x-auto no-scrollbar">
            <table className="w-full">
              <thead style={{ background: "rgb(245, 247, 245)" }}>
                <tr>
                  {["Référence", "Client", "Achat", "Montant", "Mode de paiement", "Date", "Heure", "Caissier", "Statut"].map(
                    (header) => (
                      <th
                        key={header}
                        className="px-4 py-3 text-left text-[9px] font-bold text-[#9AAEA3] uppercase tracking-[0.08em] whitespace-nowrap"
                      >
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {paginatedSales.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-16">
                      <div className="flex flex-col items-center justify-center">
                        <Search size={24} style={{ color: TOKENS.hairline }} className="mb-2" />
                        <p className="text-sm font-bold" style={{ color: TOKENS.mutedText }}>
                          Aucune vente trouvée
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedSales.map((sale) => {
                    const isSelected = sale.id === selectedSale?.id;
                    const isSingleItem = sale.items.length === 1;
                    return (
                      <tr
                        key={sale.id}
                        onClick={() => toggleSaleDetail(sale.id)}
                        className={`border-t border-[#F0F5F2] cursor-pointer transition-colors text-xs hover:bg-[#F9FBFA] ${
                          isSelected ? "bg-[#F0FAF6]" : ""
                        }`}
                      >
                        <td className="px-4 py-3">
                          <span className="text-[11px] font-bold text-[#0F1A15] whitespace-nowrap">#{sale.reference}</span>
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <ReceiptAvatar
                              initials={getReceiptInitials(sale.client.name)}
                              color={sale.client.avatarColor}
                              size={26}
                            />
                            <div>
                              <p
                                className={`text-[11px] font-semibold whitespace-nowrap ${
                                  sale.client.isWalkIn ? "italic text-[#9AAEA3]" : "text-[#0F1A15]"
                                }`}
                              >
                                {sale.client.name}
                              </p>
                              {sale.client.phone && (
                                <p className="text-[9px] text-[#9AAEA3] font-medium whitespace-nowrap">{sale.client.phone}</p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          {isSingleItem ? (
                            <div>
                              <p className="text-[11px] font-semibold text-[#0F1A15] whitespace-nowrap">{sale.items[0].name}</p>
                              <p className="text-[9px] text-[#9AAEA3] font-medium">x{sale.items[0].quantity}</p>
                            </div>
                          ) : (
                            <p className="text-[11px] font-medium text-[#4A5E54] whitespace-nowrap">
                              {sale.items.length} articles
                            </p>
                          )}
                        </td>

                        <td className="px-4 py-3 text-[11px] font-bold text-[#0F1A15] font-mono whitespace-nowrap">
                          {formatPrice(sale.amount)} FCFA
                        </td>

                        <td className="px-4 py-3">
                          <PosPaymentMethodBadge method={sale.paymentMethod} />
                        </td>

                        <td className="px-4 py-3 text-[10px] text-[#6B7A6F] font-medium whitespace-nowrap">
                          {formatTableDate(sale.date)}
                        </td>

                        <td className="px-4 py-3 text-[10px] text-[#6B7A6F] font-medium whitespace-nowrap">{sale.time}</td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <ReceiptAvatar initials={sale.cashier.initials} color={sale.cashier.avatarColor} size={24} />
                            <span className="text-[10px] text-[#4A5E54] font-medium whitespace-nowrap">{sale.cashier.name}</span>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <PosSaleStatusBadge status={sale.status} />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {filteredSales.length > 0 && (
            <div className="flex items-center justify-between mt-3 px-1">
              <p className="text-[11px] font-medium text-[#9AAEA3]">
                Affichage de {rangeStart} à {rangeEnd} sur {filteredSales.length} transactions
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setPage(currentPage - 1)}
                  className="w-7 h-7 rounded-full flex items-center justify-center border border-[#E8EDEA] text-[#9AAEA3] hover:text-[#0F1A15] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Page précédente"
                >
                  <ChevronLeft size={13} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setPage(pageNumber)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors ${
                      pageNumber === currentPage ? "text-white" : "text-[#6B7A6F] hover:bg-[#F5F7F5]"
                    }`}
                    style={pageNumber === currentPage ? { background: "rgb(11, 143, 104)" } : undefined}
                  >
                    {pageNumber}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage(currentPage + 1)}
                  className="w-7 h-7 rounded-full flex items-center justify-center border border-[#E8EDEA] text-[#9AAEA3] hover:text-[#0F1A15] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Page suivante"
                >
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* PANNEAU DÉTAIL */}
        {selectedSale && <PosSaleDetailDrawer sale={selectedSale} onClose={closeDetail} />}
      </div>
    </div>
  );
}
