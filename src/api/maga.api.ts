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

export async function chatWithMaga(input: { message: string }): Promise<MagaChatResult> {
  const { askPharmacyMaga } = await import("@/features/maga/lib/pharmacyCopilot");
  return askPharmacyMaga(input.message);
}
