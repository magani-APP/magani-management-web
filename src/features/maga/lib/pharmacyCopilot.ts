import { mockAlerts, mockKpis, mockOwnerStats, mockPaymentData } from "@/mocks/dashboard.mock";
import { mockInventoryProducts, mockInventoryStats } from "@/mocks/inventory.mock";
import { mockReservations } from "@/mocks/reservations.mock";
import { mockCurrentUser, mockPharmacy } from "@/mocks/core.mock";
import type { MagaCard, MagaChatResult, MagaMood } from "@/api/maga.api";
import {
  formatDaily,
  formatDays,
  likelyToFinish,
  mostConsumed,
  quarterCaption,
  riskLabel,
  rowForProduct,
  type ConsumptionRow,
} from "./stockIntelligence";

const SUGGEST = [
  "Plus consommés ce trimestre",
  "Risque de rupture",
  "Stock critique",
  "Réservations du jour",
];

function pack(reply: string, mood: MagaMood, extra?: Partial<MagaChatResult>): MagaChatResult {
  return {
    sessionId: "pharmacy-desk",
    reply,
    mood,
    locale: "fr",
    suggestions: extra?.suggestions ?? SUGGEST,
    cards: extra?.cards ?? [],
  };
}

function fold(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function money(n: number) {
  return `${Math.round(n).toLocaleString("fr-FR")} F`;
}

function findProducts(text: string) {
  const q = fold(text).replace(/[^a-z0-9+\s]/g, " ").replace(/\s+/g, " ").trim();
  if (q.length < 3) return [];
  const stop = new Set(["plus", "consomme", "consommes", "trimestre", "stock", "rupture", "risque", "va", "finir", "statistique", "statistiques"]);
  const words = q.split(" ").filter((w) => w.length > 2 && !stop.has(w));
  if (!words.length) return [];
  return mockInventoryProducts.filter((p) => {
    const hay = fold(`${p.name} ${p.code} ${p.category}`);
    return words.some((w) => hay.includes(w));
  });
}

function productCards(list: typeof mockInventoryProducts): MagaCard[] {
  return list.slice(0, 5).map((p) => ({
    kind: "product",
    title: p.name,
    subtitle: `${p.stock} ${p.unit} · ${p.status.replace("-", " ")}`,
    meta: `${money(p.salePrice)} · expire ${p.expirationDate}`,
    href: "/inventory",
  }));
}

function coverCards(rows: ConsumptionRow[]): MagaCard[] {
  return rows.map((r) => ({
    kind: "product",
    title: r.product.name,
    subtitle: `Stock ${r.product.stock} u. · ${formatDaily(r.daily)} · ${riskLabel(r.risk)}`,
    meta: `Couverture ${formatDays(r.daysCover)}${r.orderQty ? ` · commander ~${r.orderQty} u.` : ""} · T3 ${r.sales.q3.toLocaleString("fr-FR")} u.`,
    href: "/inventory",
  }));
}

export async function askPharmacyMaga(message: string): Promise<MagaChatResult> {
  await new Promise((r) => setTimeout(r, 220));
  const raw = message.trim();
  const q = fold(raw);
  const who = mockCurrentUser.name.split(" ")[0];
  const officine = mockPharmacy.name;

  if (/^(salut|bonjour|bonsoir|hello|hey|bjr|coucou)\b/.test(q) || q.includes("qui es tu") || q.includes("tu es qui")) {
    return pack(
      `Salut ${who}. Je suis Maga, copilote de ${officine}. Je relie la consommation aux stocks : top du trimestre, produits qui vont finir, ruptures, caisse et réservations. Je ne diagnostique pas.`,
      "happy",
    );
  }

  if (/^(merci|ok|okay|daccord|d'accord|super|parfait|oui|ouais)\b/.test(q)) {
    return pack("Avec plaisir. Consommation, couverture de stock, caisse — tu n’as qu’à demander.", "happy");
  }

  if (/^(au revoir|bye|a plus|à plus|cest bon|c'est bon)\b/.test(q)) {
    return pack("Je reste dans le coin. Clique-moi si un produit accélère trop par rapport au stock.", "talk");
  }

  if (/\b(diagnos|symptome|que (lui|lui )?(donner|prescrire)|pour soigner|quel medicament pour|j ai mal|fievre du patient)\b/.test(q)) {
    return pack(
      "Je ne choisis pas un traitement. Donne-moi le nom du produit : je te dis le stock, le rythme de vente du trimestre, et dans combien de jours il risque de manquer.",
      "warn",
      { suggestions: ["Risque de rupture", "Plus consommés ce trimestre", "Stock critique"] },
    );
  }

  if (/\b(va finir|vont finir|likely|rupture prochaine|risque de rupture|couverture|jours de stock|observer|consommation|bientot en rupture|bientôt en rupture|stock.?out)\b/.test(q)
    && !/\b(plus consomme|plus vendu|trimestre|statistique)\b/.test(q)) {
    const rows = likelyToFinish(6);
    const worst = rows[0];
    return pack(
      worst
        ? `${officine} — au rythme du ${quarterCaption()}, ${rows.length} lignes n’ont plus assez de stock. Le plus urgent : ${worst.product.name} (${worst.product.stock} u. en rayon, ${formatDaily(worst.daily)}, couverture ${formatDays(worst.daysCover)}). Je calcule stock ÷ ventes T3.`
        : "Aucune ligne tendue pour l’instant : le stock couvre plus de 3 semaines au rythme actuel.",
      rows.some((r) => r.risk === "rupture") ? "warn" : "think",
      {
        cards: coverCards(rows),
        suggestions: ["Plus consommés ce trimestre", "Stock critique", "Commander le Diclofénac"],
      },
    );
  }

  if (/\b(trimestre|quarter|plus consomme|plus consommes|statistique|statistiques|stats? med|consommation du|top conso|les plus vendus|plus vendu)\b/.test(q)) {
    const rows = mostConsumed(6);
    const head = rows.slice(0, 3).map((r) => `${r.product.name} (${r.sales.q3.toLocaleString("fr-FR")} u., stock ${r.product.stock})`).join(" ; ");
    return pack(
      `Médicaments les plus consommés — ${quarterCaption()}, croisés avec le stock actuel de ${officine} : ${head}. Un gros volume avec un petit stock = rupture proche.`,
      "talk",
      {
        cards: coverCards(rows),
        suggestions: ["Risque de rupture", "Stock critique", "Chiffre du mois"],
      },
    );
  }

  if (/\b(critique|rupture|alerte|stock bas|a commander|commander)\b/.test(q)) {
    const named = findProducts(raw);
    if (named.length && !/^(stock critique|alertes?|ruptures?|stock bas)$/.test(q.trim())) {
      const intel = named.map((p) => rowForProduct(p.id)).filter((r): r is ConsumptionRow => Boolean(r));
      const r = intel[0];
      const p = named[0];
      return pack(
        r
          ? `${p.name} : ${p.stock} u. en rayon, ${formatDaily(r.daily)}, couverture ${formatDays(r.daysCover)} (${riskLabel(r.risk)}).${r.orderQty ? ` Commander ~${r.orderQty} u. pour 45 jours de couverture.` : ""}`
          : `${p.name} : ${p.stock} u.`,
        r?.risk === "rupture" ? "warn" : "talk",
        {
          cards: intel.length ? coverCards(intel) : productCards(named),
          suggestions: ["Risque de rupture", "Plus consommés ce trimestre"],
        },
      );
    }
    const hot = mockInventoryProducts.filter((p) => p.status === "critique" || p.status === "stock-bas" || p.status === "expire");
    const alerts = mockAlerts.filter((a) => a.severity !== "info");
    const pace = likelyToFinish(3);
    return pack(
      `${officine} : ${mockInventoryStats.criticalStock} lignes marquées critiques au statut. Attention : d’autres produits « en stock » peuvent quand même finir vite (ex. ${pace[0]?.product.name ?? "les plus vendus"}).`,
      "warn",
      {
        cards: [
          ...productCards(hot),
          ...alerts.slice(0, 2).map((a) => ({
            kind: "product" as const,
            title: a.message,
            subtitle: a.actionLabel,
            href: "/inventory",
          })),
        ],
        suggestions: ["Risque de rupture", "Plus consommés ce trimestre", "Péremptions"],
      },
    );
  }

  if (/\b(perim|pérem|expir|lot )\b/.test(q)) {
    const expiring = mockInventoryProducts.filter((p) => p.status === "expire" || p.expirationDate <= "2026-10-01");
    return pack(
      "Lots à surveiller : retirés ou bientôt périmés. Archive-les depuis Produits & Stock pour ne pas les vendre.",
      "warn",
      {
        cards: productCards(expiring),
        suggestions: ["Stock critique", "Comment encaisser", "Chiffre du mois"],
      },
    );
  }

  if (/\b(chiffre|ca\b|chiffre d|ventes|kpi|panier|marge|objectif|profit)\b/.test(q)) {
    const ca = mockKpis.revenue;
    const owner = mockOwnerStats;
    return pack(
      `Ce mois : ${ca.value} de CA (${ca.percentage} vs mois dernier), marge ${mockKpis.margin.value}, ${mockKpis.transactions.value} ventes, panier ${mockKpis.basket.value}. Objectif ${owner.goalText} — ${owner.monthlyGoalProgress} % atteint.`,
      "happy",
      {
        cards: [
          { kind: "product", title: "Chiffre d’affaires", subtitle: ca.value, meta: ca.subText, href: "/" },
          { kind: "product", title: "Résultat net", subtitle: owner.netProfit, meta: owner.subText, href: "/reports" },
          { kind: "product", title: "Équipe", subtitle: `${owner.activeEmployees} actifs`, meta: `Taux de service ${owner.serviceRate} %`, href: "/settings" },
        ],
        suggestions: ["Plus consommés ce trimestre", "Paiements", "Rapports"],
      },
    );
  }

  if (/\b(top produit|meilleurs ventes|meilleures ventes)\b/.test(q)) {
    const rows = mostConsumed(6);
    return pack(
      `Top consommation ${quarterCaption()}, avec le stock actuel à côté. Ce n’est pas juste le CA : un produit très vendu avec peu d’unités en rayon part en premier.`,
      "happy",
      {
        cards: coverCards(rows),
        suggestions: ["Risque de rupture", "Plus consommés ce trimestre"],
      },
    );
  }

  if (/\b(paiement|momo|orange money|especes|espèces|mobile money)\b/.test(q)) {
    return pack(
      "Répartition des encaissements ce mois. En caisse tu peux mixer espèces + MoMo.",
      "talk",
      {
        cards: mockPaymentData.map((p) => ({
          kind: "product" as const,
          title: p.name,
          subtitle: `${p.value} % des ventes`,
          href: "/pos",
        })),
        suggestions: ["Comment encaisser", "Chiffre du mois"],
      },
    );
  }

  if (/\b(reservation|réservation|retrait|commande client|a preparer|à préparer)\b/.test(q)) {
    const open = mockReservations.filter((r) => r.status === "Nouvelle" || r.status === "Confirmée" || r.status === "Préparée");
    return pack(
      `${open.length} réservation(s) encore à traiter. Ouvre Réservations pour confirmer, préparer, puis remettre au client.`,
      "talk",
      {
        cards: open.map((r) => ({
          kind: "product" as const,
          title: `${r.reference} · ${r.customer.firstName} ${r.customer.lastName}`,
          subtitle: r.status,
          meta: `${r.items.map((i) => i.name).join(", ")} · ${money(r.totalAmount)}`,
          href: "/reservations",
        })),
        suggestions: ["Stock critique", "Comment encaisser"],
      },
    );
  }

  if (/\b(caisse|encaiss|pos|nouvelle vente|comment vendre|ticket)\b/.test(q)) {
    return pack(
      "Pour encaisser : menu Caisse POS → cherche le produit → ajoute au panier → choisis Espèces, MTN MoMo, Orange Money ou mixte → valide. Maga se range pendant la caisse pour ne pas gêner le comptoir.",
      "talk",
      {
        cards: [{ kind: "product", title: "Ouvrir la caisse", subtitle: "Nouvelle vente", href: "/pos" }],
        suggestions: ["Stock critique", "Paiements", "Réservations du jour"],
      },
    );
  }

  if (/\b(rapport|export|pdf)\b/.test(q)) {
    return pack(
      "Les rapports (ventes, paiements, marges, pertes, stock) sont dans Rapports. Je peux aussi te résumer le CA ici.",
      "talk",
      {
        cards: [{ kind: "product", title: "Rapports", subtitle: "Ventes, marges, stock", href: "/reports" }],
        suggestions: ["Plus consommés ce trimestre", "Top produits"],
      },
    );
  }

  if (/\b(equipe|équipe|staff|employe|employé|parametre|paramètre|horaire)\b/.test(q)) {
    return pack(
      `${ownerLine()} L’équipe et les horaires se règlent dans Paramètres.`,
      "talk",
      {
        cards: [{ kind: "product", title: "Paramètres", subtitle: "Équipe, paiements, stock", href: "/settings" }],
      },
    );
  }

  if (/\b(journal|activite|activité|historique)\b/.test(q)) {
    return pack(
      "Le journal d’activité liste qui a vendu, reçu un stock ou modifié une réservation. Utile si un écart apparaît en caisse.",
      "talk",
      { cards: [{ kind: "product", title: "Journal d’activité", subtitle: "Traçabilité de l’officine", href: "/activity" }] },
    );
  }

  if (/\b(aide|comment ca marche|comment ça marche|que peux.tu|tu fais quoi|navigation)\b/.test(q)) {
    return pack(
      `Je suis Maga, copilote de ${officine}. Demande les plus consommés du trimestre, ceux qui vont finir d’après le rythme de vente, le stock d’un produit, les réservations ou comment encaisser.`,
      "talk",
    );
  }

  const hits = findProducts(raw);
  if (hits.length) {
    const intel = hits.map((p) => rowForProduct(p.id)).filter((r): r is ConsumptionRow => Boolean(r));
    const r = intel[0];
    const p = hits[0];
    const mood: MagaMood =
      r?.risk === "rupture" || p.status === "expire" ? "warn" : r?.risk === "tendu" || p.status === "stock-bas" ? "think" : "happy";
    const trend =
      r?.q3vsQ2Pct == null
        ? ""
        : r.q3vsQ2Pct > 0
          ? ` T3 vs T2 : +${r.q3vsQ2Pct} %.`
          : r.q3vsQ2Pct < 0
            ? ` T3 vs T2 : ${r.q3vsQ2Pct} %.`
            : " T3 stable vs T2.";
    return pack(
      r
        ? `${p.name} : ${p.stock} u. en rayon, ${formatDaily(r.daily)} sur ${quarterCaption()}. Couverture ${formatDays(r.daysCover)} (${riskLabel(r.risk)}). T3 ${r.sales.q3.toLocaleString("fr-FR")} u. · T2 ${r.sales.q2.toLocaleString("fr-FR")} u.${trend}${r.orderQty ? ` Suggestion : commander ~${r.orderQty} u. pour 45 jours.` : ""}`
        : `${p.name} : ${p.stock} ${p.unit}, ${money(p.salePrice)}.`,
      mood,
      {
        cards: intel.length ? coverCards(intel) : productCards(hits),
        suggestions: ["Risque de rupture", "Plus consommés ce trimestre", "Stock critique"],
      },
    );
  }

  return pack(
    "Je n’ai pas saisi. Demande-moi les plus consommés du trimestre, les produits qui vont finir, un nom de médicament, les réservations, ou le chiffre du mois.",
    "think",
  );
}

function ownerLine() {
  return `${mockOwnerStats.activeEmployees} personnes actives, taux de service ${mockOwnerStats.serviceRate} %.`;
}
