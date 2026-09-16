"use client";

import { X, Store, ChevronRight, CheckCircle2, RotateCcw, Ban, Printer, Share2 } from "lucide-react";
import { TOKENS } from "@/constants/design-tokens.constants";
import { RECEIPT_PHARMACY_INFO } from "@/constants/receipts.constants";
import { Receipt } from "@/types/receipts.types";
import { formatPrice } from "@/utils/format.util";
import { ReceiptAvatar, getReceiptInitials } from "./ReceiptAvatar";
import { PaymentMethodBadge } from "./ReceiptBadges";
import { generateTicketReceiptHtml } from "@/lib/pdf/generateTicketReceiptHtml";

interface ReceiptDetailDrawerProps {
  receipt: Receipt;
  onClose: () => void;
}

const STATUS_CONTENT: Record<
  Receipt["status"],
  { icon: React.ReactNode; iconBg: string; iconColor: string; title: string; subtitle: string }
> = {
  vente: {
    icon: <CheckCircle2 size={20} />,
    iconBg: "#E3F9EE",
    iconColor: "#059669",
    title: "Vente enregistrée",
    subtitle: "Le paiement a été effectué avec succès.",
  },
  rembourse: {
    icon: <RotateCcw size={20} />,
    iconBg: "#FFFBEB",
    iconColor: "#92400E",
    title: "Vente remboursée",
    subtitle: "Le montant a été restitué au client.",
  },
  annule: {
    icon: <Ban size={20} />,
    iconBg: "#FEECEC",
    iconColor: "#DC2626",
    title: "Vente annulée",
    subtitle: "Ce ticket a été annulé et n'a pas été encaissé.",
  },
};

function formatDrawerDate(date: string, time: string): string {
  const formatted = new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
  return `${formatted} à ${time}`;
}

export function ReceiptDetailDrawer({ receipt, onClose }: ReceiptDetailDrawerProps) {
  const status = STATUS_CONTENT[receipt.status];

  const handlePrint = () => {
    const printWindow = window.open("", "_blank", "width=420,height=640");
    if (!printWindow) return;
    printWindow.document.write(generateTicketReceiptHtml(receipt));
    printWindow.document.close();
  };

  const handleShare = async () => {
    const shareText = `Reçu ${receipt.receiptNumber} — ${formatPrice(receipt.amount)} FCFA`;
    if (navigator.share) {
      try {
        await navigator.share({ title: receipt.receiptNumber, text: shareText });
      } catch {
        // Partage annulé par l'utilisateur — rien à faire.
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareText);
    }
  };

  return (
    <>
      <div className="lg:hidden fixed inset-0 z-30 bg-black/30 backdrop-blur-[1px]" onClick={onClose} />
      <aside
        className="fixed inset-x-0 bottom-0 z-40 max-h-[90vh] rounded-t-3xl border shadow-[0_-8px_32px_rgba(0,0,0,0.12)] lg:static lg:z-auto lg:inset-auto lg:max-h-none lg:w-[340px] xl:w-[360px] lg:flex-shrink-0 lg:rounded-2xl lg:shadow-none overflow-y-auto no-scrollbar flex flex-col bg-white"
        style={{ borderColor: TOKENS.borderCard }}
      >
        {/* EN-TÊTE */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b" style={{ borderColor: TOKENS.divider }}>
          <h3 className="text-sm font-bold" style={{ color: TOKENS.foreground }}>
            Détails du reçu
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[#F0F5F2] transition-colors"
            style={{ color: TOKENS.faintText }}
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 no-scrollbar" style={{ scrollbarWidth: "none" }}>
          {/* STATUT */}
          <div className="flex items-start gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: status.iconBg, color: status.iconColor }}
            >
              {status.icon}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold" style={{ color: TOKENS.foreground }}>
                {status.title}
              </p>
              <p className="text-xs font-medium mt-0.5" style={{ color: TOKENS.mutedText }}>
                {status.subtitle}
              </p>
              <p className="text-[10px] font-medium mt-1" style={{ color: TOKENS.faintText }}>
                {formatDrawerDate(receipt.date, receipt.time)}
              </p>
            </div>
          </div>

          {/* PHARMACIE */}
          <div className="flex items-start justify-between gap-3 p-3 rounded-xl bg-[#F5F7F5] border border-[#E8EDEA]">
            <div className="flex items-start gap-2.5 min-w-0">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(11, 143, 104, 0.1)", color: "rgb(11, 143, 104)" }}
              >
                <Store size={14} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold truncate" style={{ color: TOKENS.foreground }}>
                  {RECEIPT_PHARMACY_INFO.name}
                </p>
                <p className="text-[10px] font-medium mt-0.5" style={{ color: TOKENS.faintText }}>
                  {RECEIPT_PHARMACY_INFO.address}
                </p>
                <p className="text-[10px] font-medium" style={{ color: TOKENS.faintText }}>
                  {RECEIPT_PHARMACY_INFO.license}
                </p>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-[9px] font-bold uppercase tracking-[0.06em]" style={{ color: TOKENS.faintText }}>
                N° reçu
              </p>
              <p className="text-[11px] font-bold mt-0.5" style={{ color: TOKENS.foreground }}>
                {receipt.receiptNumber}
              </p>
            </div>
          </div>

          {/* CLIENT */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.07em] mb-2" style={{ color: TOKENS.faintText }}>
              Client
            </h4>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#F5F7F5] border border-[#E8EDEA]">
              <ReceiptAvatar initials={getReceiptInitials(receipt.client.name)} color={receipt.client.avatarColor} size={34} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate" style={{ color: TOKENS.foreground }}>
                  {receipt.client.name}
                </p>
                {receipt.client.phone && (
                  <p className="text-[10px] font-medium mt-0.5" style={{ color: TOKENS.faintText }}>
                    {receipt.client.phone}
                  </p>
                )}
              </div>
              {!receipt.client.isWalkIn && <ChevronRight size={14} style={{ color: TOKENS.faintText }} />}
            </div>
          </div>

          {/* ARTICLES */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.07em] mb-2" style={{ color: TOKENS.faintText }}>
              Articles ({receipt.items.length})
            </h4>
            <div className="space-y-1.5">
              {receipt.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-2 py-1">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold truncate" style={{ color: TOKENS.foreground }}>
                      {item.name}
                    </p>
                    <p className="text-[10px] font-medium" style={{ color: TOKENS.faintText }}>
                      {item.quantity} × {formatPrice(item.unitPrice)} FCFA
                    </p>
                  </div>
                  <p className="text-xs font-bold flex-shrink-0" style={{ color: TOKENS.foreground }}>
                    {formatPrice(item.unitPrice * item.quantity)} FCFA
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* TRANSACTION */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.07em] mb-2" style={{ color: TOKENS.faintText }}>
              Détails de la transaction
            </h4>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-1 py-1">
                <span className="text-xs font-medium" style={{ color: TOKENS.mutedText }}>
                  Montant total
                </span>
                <span className="text-xs font-bold" style={{ color: TOKENS.foreground }}>
                  {formatPrice(receipt.amount)} FCFA
                </span>
              </div>
              <div className="flex items-center justify-between px-1 py-1">
                <span className="text-xs font-medium" style={{ color: TOKENS.mutedText }}>
                  Remise
                </span>
                <span className="text-xs font-bold" style={{ color: TOKENS.foreground }}>
                  {formatPrice(receipt.discount)} FCFA
                </span>
              </div>
              <div className="flex items-center justify-between px-3 py-2 rounded-xl" style={{ background: "#E3F9EE" }}>
                <span className="text-xs font-bold" style={{ color: "#059669" }}>
                  Montant payé
                </span>
                <span className="text-xs font-bold" style={{ color: "#059669" }}>
                  {formatPrice(receipt.amountPaid)} FCFA
                </span>
              </div>
              <div className="flex items-center justify-between px-1 py-1">
                <span className="text-xs font-medium" style={{ color: TOKENS.mutedText }}>
                  Monnaie rendue
                </span>
                <span className="text-xs font-bold" style={{ color: TOKENS.foreground }}>
                  {formatPrice(receipt.changeGiven)} FCFA
                </span>
              </div>
            </div>
          </div>

          {/* MOYEN DE PAIEMENT */}
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-medium" style={{ color: TOKENS.mutedText }}>
              Moyen de paiement
            </span>
            <PaymentMethodBadge method={receipt.paymentMethod} />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-2 px-5 py-4 border-t" style={{ borderColor: TOKENS.divider }}>
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-2xl border text-xs font-bold transition-colors hover:border-[#0B8F68]/30"
            style={{ borderColor: TOKENS.borderCard, color: TOKENS.mutedText }}
          >
            <Printer size={13} /> Imprimer le reçu
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-2xl text-white text-xs font-bold hover:opacity-90 transition-opacity"
            style={{ background: "rgb(11, 143, 104)" }}
          >
            <Share2 size={13} /> Partager
          </button>
        </div>
      </aside>
    </>
  );
}
