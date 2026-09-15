import { listDetailedPosSales, DetailedSale } from "@/api/pos.api";
import { PosSale, PosSalePaymentMethod } from "@/types/pos-sales.types";

const PROVIDER_TO_METHOD: Record<string, PosSalePaymentMethod> = {
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

function shortReference(sale: DetailedSale): string {
  // Le reçu est déjà formaté "MG-AAAAMMJJ-XXXX" côté backend ; on en tire
  // une référence courte de type "V-XXXX" pour l'affichage en tableau.
  const tail = sale.receiptNumber.split("-").pop() ?? sale.id.slice(0, 6);
  return `V-${tail}`;
}

function toPosSale(sale: DetailedSale): PosSale {
  const date = new Date(sale.createdAt);
  const cashierName = sale.cashier ? `${sale.cashier.firstName} ${sale.cashier.lastName.charAt(0)}.` : "—";
  const methods = new Set(sale.payments.map((p) => PROVIDER_TO_METHOD[p.provider] ?? "cash"));
  const paymentMethod: PosSalePaymentMethod = methods.size > 1 ? "mixed" : [...methods][0] ?? "cash";

  return {
    id: sale.id,
    reference: shortReference(sale),
    receiptNumber: sale.receiptNumber,
    // 🚧 Le backend ne modélise pas encore les remboursements/annulations :
    // toute vente enregistrée est donc présentée comme "encaissée".
    status: "encaisse",
    client: {
      name: "Client comptoir",
      isWalkIn: true,
      avatarColor: colorFor(sale.id),
    },
    items: sale.items.map((item, index) => ({
      id: `${sale.id}-${index}`,
      name: item.product.nameFr,
      quantity: item.quantity,
      unitPrice: item.unitPriceXaf,
    })),
    amount: sale.totalXaf,
    discount: sale.discountXaf,
    paymentMethod,
    // 🚧 Pas de référence de transaction opérateur (MTN/Orange) exposée par
    // l'API de paiement caisse pour l'instant.
    transactionRef: sale.id.slice(0, 8).toUpperCase(),
    date: date.toISOString().slice(0, 10),
    time: new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" }).format(date),
    cashier: {
      initials: sale.cashier ? cashierInitials(sale.cashier.firstName, sale.cashier.lastName) : "—",
      name: cashierName,
      avatarColor: colorFor(sale.cashier?.id ?? "cashier"),
    },
  };
}

export const getPosSales = async (): Promise<PosSale[]> => {
  const sales = await listDetailedPosSales();
  return sales.map(toPosSale);
};
