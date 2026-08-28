"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Send } from "lucide-react";
import type { MagaMessage } from "../hooks/useMagaChat";

type MagaChatPanelProps = {
  messages: MagaMessage[];
  suggestions: string[];
  sending: boolean;
  send: (text: string) => void | Promise<void>;
};

export function MagaChatPanel({ messages, suggestions, sending, send }: MagaChatPanelProps) {
  const [draft, setDraft] = useState("");
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = draft;
    setDraft("");
    void send(text);
  };

  const lastCards = [...messages].reverse().find((m) => m.cards?.length)?.cards;

  return (
    <div className="flex flex-col min-h-0 h-full">
      <div ref={logRef} className="flex-1 overflow-auto no-scrollbar space-y-2.5 pr-1">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[88%] rounded-2xl px-3 py-2 text-[12px] leading-relaxed ${
                msg.role === "user"
                  ? "bg-brand-primary text-white rounded-br-md"
                  : msg.warn
                    ? "bg-white border border-status-warning/40 text-text-primary rounded-bl-md"
                    : "bg-white border border-border-card text-text-primary rounded-bl-md"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {lastCards && (
          <div className="grid gap-1.5">
            {lastCards.map((card, i) => {
              const body = (
                <>
                  <p className="text-[12px] font-bold text-text-primary">{card.title}</p>
                  <p className="text-[11px] text-text-muted">
                    {[card.subtitle, card.meta].filter(Boolean).join(" · ")}
                  </p>
                </>
              );
              const cls = "bg-white border border-border-card rounded-xl px-3 py-2 hover:border-brand-primary/30 transition-colors";
              return card.href ? (
                <Link key={`${card.title}-${i}`} href={card.href} className={`block ${cls}`}>
                  {body}
                </Link>
              ) : (
                <div key={`${card.title}-${i}`} className={cls}>
                  {body}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3 mb-2">
          {suggestions.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => void send(label)}
              className="text-[11px] font-medium text-brand-primary border border-brand-primary/25 bg-white rounded-full px-2.5 py-1 hover:bg-surface-muted transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={onSubmit} className="flex gap-2 mt-auto pt-1">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={500}
          placeholder="Conso T3, rupture, paracétamol…"
          className="flex-1 h-9 rounded-full border border-border-main bg-white px-3 text-[12px] font-medium placeholder:text-text-placeholder focus:outline-none focus:border-brand-primary/40"
        />
        <button
          type="submit"
          disabled={sending || !draft.trim()}
          className="h-9 w-9 shrink-0 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-button disabled:opacity-50"
          aria-label="Envoyer"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}
