"use client";

import { useEffect, useState } from "react";
import { TeamMember } from "@/types/settings";
import {
  InviteTeamMemberInput,
  getTeamMembers,
  inviteTeamMember,
  removeTeamMember,
  updateTeamMemberStatus,
} from "@/api/settings.api";

export function useTeamMembers() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviting, setIsInviting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    getTeamMembers().then((data) => {
      if (isMounted) {
        setMembers(data);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const invite = async (input: InviteTeamMemberInput) => {
    setIsInviting(true);
    try {
      const member = await inviteTeamMember(input);
      setMembers((prev) => [...prev, member]);
    } finally {
      setIsInviting(false);
    }
  };

  const toggleStatus = async (id: string) => {
    const target = members.find((member) => member.id === id);
    if (!target) return;

    const nextStatus = target.status === "active" ? "inactive" : "active";

    // Mise à jour optimiste
    setMembers((prev) =>
      prev.map((member) => (member.id === id ? { ...member, status: nextStatus } : member))
    );

    await updateTeamMemberStatus(id, nextStatus);
  };

  const remove = async (id: string) => {
    const previous = members;
    setMembers((prev) => prev.filter((member) => member.id !== id));

    try {
      await removeTeamMember(id);
    } catch {
      // En cas d'échec, on restaure la liste précédente
      setMembers(previous);
    }
  };

  return {
    members,
    isLoading,
    isInviting,
    invite,
    toggleStatus,
    remove,
  };
}
