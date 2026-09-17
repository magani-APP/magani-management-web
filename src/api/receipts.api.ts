import { listDetailedPosSales, DetailedSale } from "@/api/pos.api";
import { Receipt, ReceiptPaymentMethod } from "@/types/receipts.types";
import { RECEIPTS } from "@/mocks/receipts.mock";

const PROVIDER_TO_METHOD: Record<string, ReceiptPaymentMethod> = {
  CASH: "cash",
  MTN_MOMO: "mtn",
  ORANGE_MONEY: "orange",
  CARD: "card",
};

const CASHIER_AVATAR_COLORS = ["#8B5CF6", "#F43F5E", "#3B82F6", "#0B8F68", "#F59E0B"];

function cashierInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "??";
}

function colorFor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) % CASHIER_AVATAR_COLORS.length;
  return CASHIER_AVATAR_COLORS[Math.abs(hash) % CASHIER_AVATAR_COLORS.length];
}

function toReceipt(sale: DetailedSale): Receipt {
  const date = new Date(sale.createdAt);
  const totalPaid = sale.payments.reduce((s, p) => s + p.amountXaf, 0);
  const primaryPayment = sale.payments[0]?.provider ?? "CASH";
  const cashierName = sale.cashier
    ? `${sale.cashier.firstName} ${sale.cashier.lastName.charAt(0)}.`
    : "—";

  return {
    id: sale.id,
    receiptNumber: sale.receiptNumber,
    // 🚧 Le backend ne modélise pas encore les remboursements/annulations
    // de vente : tant que ces statuts n'existent pas côté API, chaque vente
    // est présentée comme "vente".
    status: "vente",
    client: {
      // Les ventes de caisse ne sont pas rattachées à un patient identifié
      // (contrairement aux réservations) : on les affiche comme client comptoir.
      name: "Client comptoir",
      isWalkIn: true,
      avatarColor: colorFor(sale.id),
    },
    amount: sale.totalXaf,
    discount: sale.discountXaf,
    amountPaid: totalPaid,
    changeGiven: Math.max(0, totalPaid - sale.totalXaf),
    paymentMethod: PROVIDER_TO_METHOD[primaryPayment] ?? "cash",
    date: date.toISOString().slice(0, 10),
    time: new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" }).format(date),
    cashier: {
      initials: sale.cashier ? cashierInitials(sale.cashier.firstName, sale.cashier.lastName) : "—",
      name: cashierName,
    },
    items: sale.items.map((item, index) => ({
      id: `${sale.id}-${index}`,
      name: item.product.nameFr,
      quantity: item.quantity,
      unitPrice: item.unitPriceXaf,
    })),
  };
}

export const getReceipts = async (): Promise<Receipt[]> => {
  try {
    const sales = await listDetailedPosSales();
    return sales.map(toReceipt);
  } catch {
    // Route indisponible côté backend : on retombe sur des reçus de
    // démonstration pour ne pas bloquer l'affichage de la page.
    return RECEIPTS;
  }
};
