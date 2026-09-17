"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useTeamMembers } from "@/hooks/settings/useTeamMembers";
import { TeamMemberRow } from "./TeamMemberRow";
import { InviteMemberModal } from "./InviteMemberModal";
import { InviteTeamMemberInput } from "@/api/settings.api";

const GRID_COLS = "minmax(0,1fr) 160px 110px 70px";

export function TeamSettingsCard() {
  const { members, isLoading, isInviting, invite, toggleStatus, remove } = useTeamMembers();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInvite = async (input: InviteTeamMemberInput) => {
    await invite(input);
    setIsModalOpen(false);
  };

  return (
    <div className="w-full space-y-5">
      {/* En-tête */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[20px] font-bold text-[#0F1A15]">Équipe &amp; Rôles</h2>
          <p className="text-xs text-[#9AAEA3] mt-1 font-medium">
            Gérez les accès et les permissions de votre équipe.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-3xl text-white text-xs font-bold hover:opacity-90 transition-opacity flex-shrink-0"
          style={{ background: "rgb(11, 143, 104)" }}
        >
          <Plus size={13} />
          Inviter un membre
        </button>
      </div>

      {/* Liste des membres */}
      {isLoading ? (
        <div className="flex h-[300px] items-center justify-center rounded-2xl border border-[#E8EDEA] bg-white">
          <div className="w-8 h-8 border-4 border-[#0B8F68] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E8EDEA] overflow-hidden">
          {/* En-tête de tableau */}
          <div
            className="hidden md:grid gap-4 px-6 py-3 border-b border-[#F0F5F2]"
            style={{ gridTemplateColumns: GRID_COLS }}
          >
            <span className="text-[10px] font-bold text-[#9AAEA3] uppercase tracking-[0.07em]">Utilisateur</span>
            <span className="text-[10px] font-bold text-[#9AAEA3] uppercase tracking-[0.07em]">Rôle</span>
            <span className="text-[10px] font-bold text-[#9AAEA3] uppercase tracking-[0.07em]">Statut</span>
            <span className="text-[10px] font-bold text-[#9AAEA3] uppercase tracking-[0.07em] text-right">Actions</span>
          </div>

          <div className="divide-y divide-[#F0F5F2]">
            {members.map((member, index) => (
              <TeamMemberRow
                key={member.id}
                member={member}
                isLast={index === members.length - 1}
                isSecondToLast={index === members.length - 2}
                gridCols={GRID_COLS}
                onToggleStatus={toggleStatus}
                onRemove={remove}
              />
            ))}
          </div>
        </div>
      )}

      <InviteMemberModal
        isOpen={isModalOpen}
        isSubmitting={isInviting}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleInvite}
      />
    </div>
  );
}
