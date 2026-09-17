"use client";

import { Bot } from "lucide-react";

interface MagaVisibilityConfirmModalProps {
  isOpen: boolean;
  /** Action que l'utilisateur s'apprête à confirmer. */
  action: "enable" | "disable";
  isSaving?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function MagaVisibilityConfirmModal({
  isOpen,
  action,
  isSaving = false,
  onConfirm,
  onCancel,
}: MagaVisibilityConfirmModalProps) {
  if (!isOpen) return null;

  const isEnabling = action === "enable";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-[420px] rounded-2xl bg-white p-6 shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start gap-3 mb-5">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(11, 143, 104, 0.1)", color: "rgb(11, 143, 104)" }}
          >
            <Bot size={18} />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-[#0F1A15]">
              {isEnabling
                ? "Voulez-vous vraiment activer l'assistant Maga ?"
                : "Voulez-vous vraiment désactiver l'assistant Maga ?"}
            </h2>
            <p className="text-[12px] font-medium text-[#9AAEA3] mt-1.5">
              {isEnabling
                ? "Maga — officine apparaîtra dans le menu latéral, avec son robot flottant sur les autres pages."
                : "Maga — officine disparaîtra du menu latéral, ainsi que son robot flottant sur les autres pages."}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="px-4 py-2.5 rounded-3xl text-[13px] font-bold text-[#4A5E54] hover:bg-[#F5F7F5] transition-colors disabled:opacity-60"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSaving}
            className="px-4 py-2.5 rounded-3xl text-white text-[13px] font-bold hover:opacity-90 active:scale-95 disabled:opacity-60 disabled:active:scale-100 transition-all"
            style={{ background: "rgb(11, 143, 104)" }}
          >
            {isEnabling ? "Oui, activer" : "Oui, désactiver"}
          </button>
        </div>
      </div>
    </div>
  );
}
