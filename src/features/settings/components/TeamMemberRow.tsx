"use client";

import { useEffect, useRef, useState } from "react";
import { MoreHorizontal, Power, Trash2, UserCog } from "lucide-react";
import { TeamMember } from "@/types/settings";
import { PROTECTED_TEAM_ROLE } from "@/constants/settings.constants";
import { StatusBadge } from "./StatusBadge";

interface TeamMemberRowProps {
  member: TeamMember;
  isLast: boolean;
  onToggleStatus: (id: string) => void;
  onRemove: (id: string) => void;
}

const CIVILITY_TITLES = new Set(["dr", "dr.", "m", "m.", "mme", "mme.", "mlle", "mlle.", "pr", "pr."]);

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .filter((part) => !CIVILITY_TITLES.has(part.toLowerCase()))
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function TeamMemberRow({ member, onToggleStatus, onRemove }: TeamMemberRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isActive = member.status === "active";
  const isProtected = member.role === PROTECTED_TEAM_ROLE;

  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <div className="flex items-center gap-4 px-5 py-4 hover:bg-[#F9FBFA] transition-colors">
      {/* Avatar */}
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
        style={{
          background: isActive
            ? "linear-gradient(135deg, rgb(11, 143, 104), rgb(7, 99, 75))"
            : "rgb(200, 213, 204)",
        }}
      >
        {getInitials(member.name)}
      </div>

      {/* Identité */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-[#0F1A15]">{member.name}</p>
        <p className="text-[10px] text-[#9AAEA3] font-medium mt-0.5">{member.email}</p>
      </div>

      {/* Rôle */}
      <span className="text-[10px] font-semibold text-[#6B7A6F] bg-[#F5F7F5] px-2.5 py-1 rounded-lg border border-[#E8EDEA]">
        {member.role}
      </span>

      {/* Statut */}
      <StatusBadge active={isActive} />

      {/* Actions */}
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="text-[#C8D5CC] hover:text-[#6B7A6F] transition-colors"
          aria-label={`Actions pour ${member.name}`}
          aria-expanded={menuOpen}
        >
          <MoreHorizontal size={14} />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-6 z-10 w-56 rounded-xl border border-[#E8EDEA] bg-white shadow-lg py-1">
            <button
              type="button"
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#4A5E54] hover:bg-[#F5F7F5] transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              <UserCog size={14} />
              Modifier le rôle
            </button>

            {!isProtected && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    onToggleStatus(member.id);
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#4A5E54] hover:bg-[#F5F7F5] transition-colors"
                >
                  <Power size={14} />
                  {isActive ? "Désactiver le compte" : "Activer le compte"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onRemove(member.id);
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={14} />
                  Retirer de l&apos;équipe
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
