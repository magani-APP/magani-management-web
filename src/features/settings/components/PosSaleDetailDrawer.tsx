"use client";

import { X, FileText, Printer, Share2, ShoppingCart } from "lucide-react";
import { TOKENS } from "@/constants/design-tokens.constants";
import { PosSale } from "@/types/pos-sales.types";
import { formatPrice } from "@/utils/format.util";
import { ReceiptAvatar, getReceiptInitials } from "./ReceiptAvatar";
import { PosPaymentMethodBadge, PosSaleStatusBadge } from "./PosBadges";

interface PosSaleDetailDrawerProps {
  sale: PosSale;
  onClose: () => void;
}

function formatDrawerDate(date: string): string {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(date));
}

export function PosSaleDetailDrawer({ sale, onClose }: PosSaleDetailDrawerProps) {
  const subtotal = sale.amount + sale.discount;

  const handlePrint = () => {
    const printWindow = window.open("", "_blank", "width=420,height=640");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head><title>Reçu ${sale.receiptNumber}</title></head>
        <body style="font-family: sans-serif; padding: 24px;">
          <h2>${sale.receiptNumber}</h2>
          <p>${formatDrawerDate(sale.date)} à ${sale.time}</p>
          <hr />
          <p><strong>Client :</strong> ${sale.client.name}</p>
          <ul>
            ${sale.items
              .map(
                (item) =>
                  `<li>${item.name} — ${item.quantity} × ${formatPrice(item.unitPrice)} FCFA = ${formatPrice(
                    item.unitPrice * item.quantity
                  )} FCFA</li>`
              )
              .join("")}
          </ul>
          <hr />
          <p><strong>Total payé : ${formatPrice(sale.amount)} FCFA</strong></p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleShare = async () => {
    const shareText = `Encaissement ${sale.reference} — ${formatPrice(sale.amount)} FCFA`;
    if (navigator.share) {
      try {
        await navigator.share({ title: sale.reference, text: shareText });
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
            Détail de l&apos;encaissement
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
          {/* RÉFÉRENCE + STATUT */}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold" style={{ color: TOKENS.foreground }}>
                #{sale.reference}
              </span>
              <PosSaleStatusBadge status={sale.status} />
            </div>
            <p className="text-[10px] font-medium mt-1" style={{ color: TOKENS.faintText }}>
              {formatDrawerDate(sale.date)} à {sale.time}
            </p>
          </div>

          {/* CLIENT */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.07em] mb-2" style={{ color: TOKENS.faintText }}>
              Client
            </h4>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#F5F7F5] border border-[#E8EDEA]">
              <ReceiptAvatar initials={getReceiptInitials(sale.client.name)} color={sale.client.avatarColor} size={34} />
              <div className="flex-1 min-w-0">
                <p
                  className={`text-xs font-bold truncate ${sale.client.isWalkIn ? "italic" : ""}`}
                  style={{ color: TOKENS.foreground }}
                >
                  {sale.client.name}
                </p>
                {sale.client.phone && (
                  <p className="text-[10px] font-medium mt-0.5" style={{ color: TOKENS.faintText }}>
                    {sale.client.phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ARTICLES */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.07em] mb-2" style={{ color: TOKENS.faintText }}>
              Articles ({sale.items.length})
            </h4>
            <div className="space-y-1.5">
              {sale.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-2 py-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(11, 143, 104, 0.08)" }}
                    >
                      <ShoppingCart size={12} style={{ color: TOKENS.primary }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: TOKENS.foreground }}>
                        {item.name}
                      </p>
                      <p className="text-[10px] font-medium" style={{ color: TOKENS.faintText }}>
                        {item.quantity} × {formatPrice(item.unitPrice)} FCFA
                      </p>
                    </div>
                  </div>
                  <p className="text-xs font-bold flex-shrink-0" style={{ color: TOKENS.foreground }}>
                    {formatPrice(item.unitPrice * item.quantity)} FCFA
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* MONTANTS */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between px-1 py-1">
              <span className="text-xs font-medium" style={{ color: TOKENS.mutedText }}>
                Sous-total
              </span>
              <span className="text-xs font-bold" style={{ color: TOKENS.foreground }}>
                {formatPrice(subtotal)} FCFA
              </span>
            </div>
            <div className="flex items-center justify-between px-1 py-1">
              <span className="text-xs font-medium" style={{ color: TOKENS.mutedText }}>
                Remise
              </span>
              <span className="text-xs font-bold" style={{ color: TOKENS.foreground }}>
                {formatPrice(sale.discount)} FCFA
              </span>
            </div>
            <div className="flex items-center justify-between px-3 py-2 rounded-xl" style={{ background: "#E3F9EE" }}>
              <span className="text-xs font-bold" style={{ color: "#059669" }}>
                Total payé
              </span>
              <span className="text-xs font-bold" style={{ color: "#059669" }}>
                {formatPrice(sale.amount)} FCFA
              </span>
            </div>
          </div>

          {/* PAIEMENT */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.07em] mb-2" style={{ color: TOKENS.faintText }}>
              Paiement
            </h4>
            <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#F5F7F5] border border-[#E8EDEA]">
              <PosPaymentMethodBadge method={sale.paymentMethod} />
              <span className="text-xs font-bold" style={{ color: TOKENS.foreground }}>
                {formatPrice(sale.amount)} FCFA
              </span>
            </div>
            <p className="text-[10px] font-medium mt-1.5 px-1" style={{ color: TOKENS.faintText }}>
              Réf. transaction : {sale.transactionRef}
            </p>
          </div>

          {/* ENCAISSÉ PAR */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.07em] mb-2" style={{ color: TOKENS.faintText }}>
              Encaissé par
            </h4>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#F5F7F5] border border-[#E8EDEA]">
              <ReceiptAvatar initials={sale.cashier.initials} color={sale.cashier.avatarColor} size={32} />
              <div>
                <p className="text-xs font-bold" style={{ color: TOKENS.foreground }}>
                  {sale.cashier.name}
                </p>
                <p className="text-[10px] font-medium" style={{ color: TOKENS.faintText }}>
                  Caissier
                </p>
              </div>
            </div>
          </div>

          {/* REÇU */}
          <div className="flex items-center gap-2 px-1">
            <FileText size={13} style={{ color: TOKENS.faintText }} />
            <span className="text-[10px] font-medium" style={{ color: TOKENS.faintText }}>
              N° {sale.receiptNumber}
            </span>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="px-5 py-4 border-t space-y-2" style={{ borderColor: TOKENS.divider }}>
          <div className="flex items-center gap-2">
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
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-2xl border text-xs font-bold transition-colors hover:border-[#0B8F68]/30"
              style={{ borderColor: TOKENS.borderCard, color: TOKENS.mutedText }}
            >
              <Share2 size={13} /> Partager
            </button>
          </div>
          <button
            type="button"
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-2xl text-white text-xs font-bold hover:opacity-90 transition-opacity"
            style={{ background: "rgb(11, 143, 104)" }}
          >
            Voir la vente
          </button>
        </div>
      </aside>
    </>
  );
}
