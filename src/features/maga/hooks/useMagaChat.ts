"use client";

import { useCallback, useState } from "react";
import {
  chatWithMaga,
  type MagaCard,
  type MagaMood,
} from "@/api/maga.api";

export type MagaMessage = {
  id: string;
  role: "user" | "bot";
  text: string;
  warn?: boolean;
  cards?: MagaCard[];
};

export function useMagaChat() {
  const [messages, setMessages] = useState<MagaMessage[]>([
    {
      id: "hello",
      role: "bot",
      text: "Salut, je suis Maga — copilote de l’officine. Je croise consommation et stock : top du trimestre, produits qui vont finir, caisse et réservations. Je ne diagnostique pas.",
    },
  ]);
  const [suggestions, setSuggestions] = useState([
    "Plus consommés ce trimestre",
    "Risque de rupture",
    "Stock critique",
    "Réservations du jour",
  ]);
  const [mood, setMood] = useState<MagaMood>("idle");
  const [sending, setSending] = useState(false);

  const send = useCallback(async (text: string) => {
    const message = text.trim();
    if (!message || sending) return;
    setSending(true);
    setMood("think");
    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, role: "user", text: message },
    ]);
    try {
      const data = await chatWithMaga({
        message,
      });
      setMood(data.mood);
      setSuggestions(data.suggestions?.length ? data.suggestions : []);
      setMessages((prev) => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          role: "bot",
          text: data.reply,
          warn: data.mood === "warn",
          cards: data.cards,
        },
      ]);
      if (typeof window !== "undefined" && window.speechSynthesis && data.reply) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(data.reply);
        utter.lang = "fr-FR";
        utter.rate = 1.04;
        const fr = window.speechSynthesis
          .getVoices()
          .find((v) => v.lang?.toLowerCase().startsWith("fr"));
        if (fr) utter.voice = fr;
        utter.onend = () => setMood("idle");
        window.speechSynthesis.speak(utter);
      } else {
        setTimeout(() => setMood("idle"), 1800);
      }
    } catch (err) {
      setMood("warn");
      setMessages((prev) => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          role: "bot",
          text:
            err instanceof Error
              ? err.message
              : "Maga n’a pas pu répondre. Réessaie dans un instant.",
          warn: true,
        },
      ]);
      setTimeout(() => setMood("idle"), 2200);
    } finally {
      setSending(false);
    }
  }, [sending]);

  return { messages, suggestions, mood, sending, send };
}
