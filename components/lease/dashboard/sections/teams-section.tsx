import { Phone, MessageCircle, Mail, MoreVertical } from "lucide-react";
import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SectionHeader } from "../ui/section-header";
import { Card } from "../ui/card";
import type { TeamMember } from "../types";

interface TeamsSectionProps {
  teamMembers: TeamMember[];
  onManageTeamClick?: () => void;
  onTeamClick?: (id: string) => void;
}

export function TeamsSection({
  teamMembers,
  onManageTeamClick,
  onTeamClick,
}: TeamsSectionProps) {
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const query = searchQuery.trim().toLowerCase();
  const filteredTeamMembers = React.useMemo(
    () =>
      !query
        ? teamMembers
        : teamMembers.filter((member) =>
            `${member.name} ${member.role} ${member.currentlyOn ?? ""} ${member.email ?? ""} ${member.phone ?? ""}`
              .toLowerCase()
              .includes(query),
          ),
    [teamMembers, query],
  );

  return (
    <div>
      <SectionHeader
        title="Teams"
        actionLabel="Manage"
        onAction={onManageTeamClick}
        searchOpen={searchOpen}
        onToggleSearch={() => {
          setSearchOpen((v) => !v);
          if (searchOpen) setSearchQuery("");
        }}
      />
      {searchOpen && (
        <div className="mb-3">
          <input
            autoFocus
            type="text"
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setSearchQuery("");
                setSearchOpen(false);
              }
            }}
            className="w-full rounded-lg border border-black/10 bg-black/5 px-3 py-2 text-sm text-black placeholder:text-black/35 focus:border-[#34C759]/50 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/35"
          />
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        {filteredTeamMembers.map((member) => (
          <Card key={member.id}>
            <div
              className="flex items-center gap-4 cursor-pointer"
              onClick={() => onTeamClick?.(member.id)}
              role={onTeamClick ? "button" : undefined}
              tabIndex={onTeamClick ? 0 : undefined}
              onKeyDown={(e) => {
                if (!onTeamClick) return;
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onTeamClick(member.id);
                }
              }}
            >
              <Avatar className="h-11 w-11 shrink-0">
                <AvatarImage src={member.avatarUrl} />
                <AvatarFallback className="bg-black/10 text-sm text-black dark:bg-[#2d3440] dark:text-white">
                  {member.initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-black dark:text-white">
                  {member.name}
                </p>
                <p
                  className="text-xs font-medium"
                  style={{ color: member.roleColor ?? "#34C759" }}
                >
                  {member.role}
                </p>
                {member.currentlyOn && (
                  <p className="text-xs text-black/40 dark:text-white/40">
                    Currently On: {member.currentlyOn}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 gap-1">
                {[Phone, MessageCircle, Mail, MoreVertical].map((Icon, i) => (
                  <button
                    key={i}
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/5 text-black/60 hover:bg-black/10 hover:text-black dark:bg-white/5 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white"
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </button>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
      {searchOpen && filteredTeamMembers.length === 0 && (
        <p className="mt-3 text-sm text-black/45 dark:text-white/45">
          No team members match your search.
        </p>
      )}
    </div>
  );
}
