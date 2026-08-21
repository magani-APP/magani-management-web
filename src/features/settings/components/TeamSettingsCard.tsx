"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useTeamMembers } from "@/hooks/settings/useTeamMembers";
import { TeamMemberRow } from "./TeamMemberRow";
import { InviteMemberModal } from "./InviteMemberModal";
import { InviteTeamMemberInput } from "@/api/settings.api";

export function TeamSettingsCard() {
  const { members, isLoading, isInviting, invite, toggleStatus, remove } = useTeamMembers();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInvite = async (input: InviteTeamMemberInput) => {
    await invite(input);
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-2xl space-y-5">
      {/* En-tête */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-bold text-[#0F1A15]">Équipe &amp; Rôles</h2>
          <p className="text-xs text-[#9AAEA3] mt-1 font-medium">
            Gérez les accès et les permissions de votre équipe.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl text-white text-xs font-bold hover:opacity-90 transition-opacity"
          style={{ background: "rgb(11, 143, 104)" }}
        >
          <Plus size={12} />
          Inviter un membre
        </button>
      </div>

      {/* Liste des membres */}
      {isLoading ? (
        <div className="flex h-[300px] items-center justify-center rounded-2xl border border-[#E8EDEA] bg-white">
          <div className="w-8 h-8 border-4 border-[#0B8F68] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E8EDEA] overflow-hidden divide-y divide-[#F0F5F2]">
          {members.map((member, index) => (
            <TeamMemberRow
              key={member.id}
              member={member}
              isLast={index === members.length - 1}
              onToggleStatus={toggleStatus}
              onRemove={remove}
            />
          ))}
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
