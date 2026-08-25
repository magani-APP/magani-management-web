"use client";

import { FormEvent, useState } from "react";
import { X } from "lucide-react";
import { TEAM_ROLE_OPTIONS } from "@/constants/settings.constants";
import { InviteTeamMemberInput } from "@/api/settings.api";

interface InviteMemberModalProps {
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (input: InviteTeamMemberInput) => void;
}

export function InviteMemberModal({
  isOpen,
  isSubmitting,
  onClose,
  onSubmit,
}: InviteMemberModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(TEAM_ROLE_OPTIONS[0]);

  if (!isOpen) return null;

  const resetForm = () => {
    setName("");
    setEmail("");
    setRole(TEAM_ROLE_OPTIONS[0]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !email.trim()) return;

    onSubmit({ name: name.trim(), email: email.trim(), role });
    resetForm();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-[420px] rounded-2xl bg-white p-6 shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-[16px] font-bold text-text-primary">Inviter un membre</h2>
            <p className="text-[12px] font-medium text-text-muted mt-1">
              Un email d&apos;invitation lui sera envoyé.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-7 h-7 shrink-0 flex items-center justify-center rounded-full text-text-muted hover:bg-surface-alt transition-colors"
            aria-label="Fermer"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="invite-name"
              className="block text-[10px] font-bold text-text-muted uppercase tracking-[0.06em] mb-1.5"
            >
              Nom complet
            </label>
            <input
              id="invite-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ex : Awa Diabaté"
              required
              className="w-full rounded-lg border border-border-card px-3 py-2 text-[13px] font-medium text-text-primary placeholder:text-text-placeholder placeholder:font-medium focus:outline-none focus:ring-1 focus:ring-brand-primary/30"
            />
          </div>

          <div>
            <label
              htmlFor="invite-email"
              className="block text-[10px] font-bold text-text-muted uppercase tracking-[0.06em] mb-1.5"
            >
              Email
            </label>
            <input
              id="invite-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nom@pharmac.ci"
              required
              className="w-full rounded-lg border border-border-card px-3 py-2 text-[13px] font-medium text-text-primary placeholder:text-text-placeholder placeholder:font-medium focus:outline-none focus:ring-1 focus:ring-brand-primary/30"
            />
          </div>

          <div>
            <label
              htmlFor="invite-role"
              className="block text-[10px] font-bold text-text-muted uppercase tracking-[0.06em] mb-1.5"
            >
              Rôle
            </label>
            <select
              id="invite-role"
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="w-full rounded-lg border border-border-card bg-white px-3 py-2 text-[13px] font-medium text-text-primary focus:outline-none focus:ring-1 focus:ring-brand-primary/30"
            >
              {TEAM_ROLE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 rounded-4xl text-[13px] font-bold text-text-secondary hover:bg-surface-alt transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-4xl bg-brand-primary text-white text-[13px] font-bold shadow-button hover:bg-brand-deep active:scale-95 disabled:opacity-60 disabled:active:scale-100 transition-all"
            >
              {isSubmitting ? "Envoi..." : "Envoyer l'invitation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
