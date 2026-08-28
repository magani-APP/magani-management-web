"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { MagaChatPanel } from "./MagaChatPanel";
import { useMagaChat } from "../hooks/useMagaChat";

const MagaRobot3D = dynamic(
  () => import("./MagaRobot3D").then((m) => m.MagaRobot3D),
  { ssr: false },
);

const HIDDEN_ON = ["/pos"];
const FULL_PAGE = ["/help"];

export function MagaWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const chat = useMagaChat();

  if (HIDDEN_ON.includes(pathname) || FULL_PAGE.includes(pathname)) return null;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      {open ? (
        <section className="w-[340px] max-w-[calc(100vw-32px)] h-[520px] bg-white/92 backdrop-blur-[24px] border border-border-glass rounded-3xl shadow-sidebar overflow-hidden flex flex-col">
          <header className="flex items-center gap-2 px-4 py-3 border-b border-border-divider">
            <div className="w-[72px] h-[86px] shrink-0">
              <MagaRobot3D mood={chat.mood} />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-bold text-text-primary leading-tight">Maga</p>
              <p className="text-[11px] text-text-muted truncate">
                {chat.sending ? "Réfléchit…" : "Assistant officine · en ligne"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="ml-auto p-1.5 rounded-full hover:bg-surface-muted text-text-muted"
              aria-label="Fermer Maga"
            >
              <X size={16} />
            </button>
          </header>
          <div className="flex-1 min-h-0 p-3 bg-surface-muted/60">
            <MagaChatPanel
              messages={chat.messages}
              suggestions={chat.suggestions}
              sending={chat.sending}
              send={chat.send}
            />
          </div>
        </section>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative group"
          aria-label="Ouvrir Maga"
        >
          <span className="absolute -top-9 right-1 whitespace-nowrap rounded-full bg-brand-darkest text-white text-[10px] font-bold px-2.5 py-1 opacity-90 group-hover:opacity-100">
            Maga · officine
          </span>
          <div className="w-[132px] h-[164px] drop-shadow-[0_12px_24px_rgba(11,143,104,0.28)]">
            <MagaRobot3D mood={chat.mood} />
          </div>
        </button>
      )}
    </div>
  );
}
