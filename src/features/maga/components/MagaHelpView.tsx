"use client";

import dynamic from "next/dynamic";
import { MagaChatPanel } from "./MagaChatPanel";
import { useMagaChat } from "../hooks/useMagaChat";

const MagaRobot3D = dynamic(
  () => import("./MagaRobot3D").then((m) => m.MagaRobot3D),
  { ssr: false },
);

export function MagaHelpView() {
  const chat = useMagaChat();

  return (
    <div className="h-full overflow-y-auto no-scrollbar p-4 md:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 lg:h-full">
        <aside className="lg:col-span-5 bg-white border border-border-card rounded-3xl shadow-card flex flex-col items-center justify-center p-4 lg:min-h-[320px]">
          <div className="w-full max-w-[200px] lg:max-w-[360px] h-[200px] lg:h-[380px]">
            <MagaRobot3D mood={chat.mood} />
          </div>
          <p className="text-[20px] font-bold text-text-primary mt-1">Maga</p>
          <p className="text-[12px] text-text-muted text-center max-w-sm">
            Copilote de l’officine : consommation du trimestre, stock restant, produits qui vont finir. Il n’établit aucun diagnostic.
          </p>
        </aside>
        <section className="lg:col-span-7 bg-surface-muted/80 border border-border-card rounded-3xl shadow-card p-4 md:p-5 flex flex-col h-[440px] lg:h-auto lg:min-h-[420px]">
          <h1 className="text-[16px] font-bold text-text-primary mb-3">Copilote de l’officine</h1>
          <MagaChatPanel
            messages={chat.messages}
            suggestions={chat.suggestions}
            sending={chat.sending}
            send={chat.send}
          />
        </section>
      </div>
    </div>
  );
}
