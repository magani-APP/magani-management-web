import { apiRequest } from "@/lib/api-client";

export type MagaMood = "idle" | "talk" | "think" | "warn" | "happy" | "listen";

export type MagaCard = {
  kind: "pharmacy" | "product";
  title: string;
  subtitle: string;
  meta?: string;
  href?: string;
};

export type MagaChatResult = {
  sessionId: string;
  reply: string;
  mood: MagaMood;
  locale: "fr" | "en";
  suggestions: string[];
  cards: MagaCard[];
};

type AssistantChatResponse = {
  sessionId: string;
  reply: string;
  mood: MagaMood | "idle" | "talk" | "think" | "warn" | "happy";
  locale: "fr" | "en";
  suggestions: string[];
  cards: Array<{
    kind: "pharmacy" | "product";
    title: string;
    subtitle: string;
    meta?: string;
    priceXaf?: number;
    distanceKm?: number;
  }>;
};

let sessionId: string | undefined;

export async function chatWithMaga(input: { message: string }): Promise<MagaChatResult> {
  try {
    const data = await apiRequest<AssistantChatResponse>("/assistant/chat", {
      method: "POST",
      body: JSON.stringify({
        message: input.message,
        sessionId,
        locale: "fr",
      }),
    });
    sessionId = data.sessionId;
    return {
      sessionId: data.sessionId,
      reply: data.reply,
      mood: data.mood === "listen" ? "listen" : data.mood,
      locale: data.locale,
      suggestions: data.suggestions ?? [],
      cards: (data.cards ?? []).map((card) => ({
        kind: card.kind,
        title: card.title,
        subtitle: card.subtitle,
        meta:
          card.meta ??
          (card.priceXaf != null
            ? `${card.priceXaf.toLocaleString("fr-FR")} FCFA`
            : card.distanceKm != null
              ? `${card.distanceKm.toFixed(1)} km`
              : undefined),
      })),
    };
  } catch {
    // Fallback local if assistant is unavailable
    const { askPharmacyMaga } = await import("@/features/maga/lib/pharmacyCopilot");
    return askPharmacyMaga(input.message);
  }
}
