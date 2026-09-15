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
    <div className="fixed bottom-[92px] lg:bottom-5 right-4 lg:right-5 z-40 flex flex-col items-end gap-3">
      {open ? (
        <>
          {/* Fond assombri — mobile uniquement, le panneau devient quasi plein écran */}
          <div
            className="lg:hidden fixed inset-0 z-30 bg-black/30 backdrop-blur-[1px]"
            onClick={() => setOpen(false)}
          />
          <section
            className="fixed inset-x-3 top-[76px] bottom-[84px] z-40 lg:static lg:inset-auto lg:z-auto lg:w-[340px] lg:h-[520px] max-w-[calc(100vw-24px)] bg-white lg:bg-white/92 lg:backdrop-blur-[24px] border border-border-glass rounded-3xl shadow-sidebar overflow-hidden flex flex-col"
          >
            <header className="flex items-center gap-2 px-4 py-3 border-b border-border-divider flex-shrink-0">
              <div className="w-[56px] h-[68px] lg:w-[72px] lg:h-[86px] shrink-0">
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
        </>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative group"
          aria-label="Ouvrir Maga"
        >
          <span className="hidden lg:block absolute -top-9 right-1 whitespace-nowrap rounded-full bg-brand-darkest text-white text-[10px] font-bold px-2.5 py-1 opacity-90 group-hover:opacity-100">
            Maga · officine
          </span>
          <div className="w-[76px] h-[94px] lg:w-[132px] lg:h-[164px] drop-shadow-[0_12px_24px_rgba(11,143,104,0.28)]">
            <MagaRobot3D mood={chat.mood} />
          </div>
        </button>
      )}
    </div>
  );
}
