"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Calendar, ChevronDown, ChevronLeft, ChevronRight, FileText, FileX, FileClock } from "lucide-react";
import { TOKENS } from "@/constants/design-tokens.constants";
import {
  RECEIPT_TABS,
  RECEIPT_MONTH_OPTIONS,
  RECEIPT_PAYMENT_FILTER_OPTIONS,
  RECEIPT_CASHIER_FILTER_OPTIONS,
} from "@/constants/receipts.constants";
import { ReceiptPaymentMethod, ReceiptTabId } from "@/types/receipts.types";
import { formatPrice } from "@/utils/format.util";
import { useReceipts } from "@/hooks/settings/useReceipts";
import { ReceiptAvatar, getReceiptInitials } from "./ReceiptAvatar";
import { PaymentMethodBadge, ReceiptStatusBadge } from "./ReceiptBadges";
import { ReceiptDetailDrawer } from "./ReceiptDetailDrawer";

/** Icône + couleur de la vignette "N° reçu" selon le statut du ticket. */
function ReceiptIcon({ status }: { status: "vente" | "rembourse" | "annule" }) {
  if (status === "annule") return <FileX size={13} style={{ color: "#DC2626" }} />;
  if (status === "rembourse") return <FileClock size={13} style={{ color: "#92400E" }} />;
  return <FileText size={13} style={{ color: TOKENS.faintText }} />;
}

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

export function ReceiptsSettingsCard() {
  const {
    activeTab,
    setActiveTab,
    tabCounts,
    searchQuery,
    setSearch,
    monthFilter,
    setMonth,
    paymentFilter,
    setPayment,
    cashierFilter,
    setCashier,
    paginatedReceipts,
    filteredReceipts,
    currentPage,
    totalPages,
    setPage,
    rangeStart,
    rangeEnd,
    selectedReceipt,
    toggleReceiptDetail,
    closeDetail,
  } = useReceipts();

  return (
    <div className="w-full">
      {/* EN-TÊTE */}
      <div className="mb-5">
        <h2 className="text-base font-bold text-[#0F1A15]">Tickets & Reçus</h2>
        <p className="text-xs text-[#9AAEA3] mt-1 font-medium">
          Consultez et gérez tous les tickets de vente et reçus émis dans votre pharmacie.
        </p>
      </div>

      <div className="flex items-start gap-5">
        {/* COLONNE PRINCIPALE */}
        <div className="flex-1 min-w-0">
          {/* ONGLETS */}
          <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar" style={{ scrollbarWidth: "none" }}>
            {RECEIPT_TABS.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as ReceiptTabId)}
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
          <div className="flex flex-col lg:flex-row lg:items-center gap-2 mb-4">
            <div className="relative flex-1 lg:max-w-[280px]">
              <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9AAEA3]" />
              <input
                placeholder="Rechercher un reçu, un client..."
                value={searchQuery}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-2xl text-xs font-medium outline-none bg-white border border-[#E8EDEA] placeholder:text-[#9AAEA3] text-[#0F1A15] focus:border-[#0B8F68]/40 transition-colors"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <GenericDropdown
                icon={<Calendar size={12} className="text-[#9AAEA3]" />}
                value={monthFilter}
                options={RECEIPT_MONTH_OPTIONS.map((m) => ({ id: m, label: m }))}
                onChange={setMonth}
              />
              <GenericDropdown<ReceiptPaymentMethod | "all">
                value={paymentFilter}
                options={RECEIPT_PAYMENT_FILTER_OPTIONS}
                onChange={setPayment}
              />
              <GenericDropdown value={cashierFilter} options={RECEIPT_CASHIER_FILTER_OPTIONS} onChange={setCashier} />
            </div>
          </div>

          {/* TABLEAU */}
          <div className="bg-white rounded-2xl border border-[#E8EDEA] overflow-hidden overflow-x-auto no-scrollbar">
            <table className="w-full">
              <thead style={{ background: "rgb(245, 247, 245)" }}>
                <tr>
                  {["N° reçu", "Client", "Montant", "Moyen de paiement", "Date", "Heure", "Caissier"].map((header) => (
                    <th
                      key={header}
                      className="px-4 py-3 text-left text-[9px] font-bold text-[#9AAEA3] uppercase tracking-[0.08em] whitespace-nowrap"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedReceipts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16">
                      <div className="flex flex-col items-center justify-center">
                        <Search size={24} style={{ color: TOKENS.hairline }} className="mb-2" />
                        <p className="text-sm font-bold" style={{ color: TOKENS.mutedText }}>
                          Aucun reçu trouvé
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedReceipts.map((receipt) => {
                    const isSelected = receipt.id === selectedReceipt?.id;
                    return (
                      <tr
                        key={receipt.id}
                        onClick={() => toggleReceiptDetail(receipt.id)}
                        className={`border-t border-[#F0F5F2] cursor-pointer transition-colors text-xs hover:bg-[#F9FBFA] ${
                          isSelected ? "bg-[#F0FAF6]" : ""
                        }`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <ReceiptIcon status={receipt.status} />
                            <span className="text-[11px] font-bold text-[#0F1A15] whitespace-nowrap">
                              {receipt.receiptNumber}
                            </span>
                            <ReceiptStatusBadge status={receipt.status} />
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <ReceiptAvatar
                              initials={getReceiptInitials(receipt.client.name)}
                              color={receipt.client.avatarColor}
                              size={26}
                            />
                            <span
                              className={`text-[11px] font-semibold whitespace-nowrap ${
                                receipt.client.isWalkIn ? "italic text-[#9AAEA3]" : "text-[#0F1A15]"
                              }`}
                            >
                              {receipt.client.name}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-3 text-[11px] font-bold text-[#0F1A15] font-mono whitespace-nowrap">
                          {formatPrice(receipt.amount)} FCFA
                        </td>

                        <td className="px-4 py-3">
                          <PaymentMethodBadge method={receipt.paymentMethod} />
                        </td>

                        <td className="px-4 py-3 text-[10px] text-[#6B7A6F] font-medium whitespace-nowrap">
                          {formatTableDate(receipt.date)}
                        </td>

                        <td className="px-4 py-3 text-[10px] text-[#6B7A6F] font-medium whitespace-nowrap">
                          {receipt.time}
                        </td>

                        <td className="px-4 py-3">
                          <ReceiptAvatar initials={receipt.cashier.initials} color="rgb(11, 143, 104)" size={24} />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {filteredReceipts.length > 0 && (
            <div className="flex items-center justify-between mt-3 px-1">
              <p className="text-[11px] font-medium text-[#9AAEA3]">
                Affichage de {rangeStart} à {rangeEnd} sur {filteredReceipts.length} reçus
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
        {selectedReceipt && <ReceiptDetailDrawer receipt={selectedReceipt} onClose={closeDetail} />}
      </div>
    </div>
  );
}
