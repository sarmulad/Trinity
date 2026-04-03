import { Phone, MessageCircle, Mail, MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SectionHeader } from "../ui/section-header";
import { Card } from "../ui/card";
import type { TeamMember } from "../types";

interface TeamsSectionProps {
  teamMembers: TeamMember[];
  onManageTeamClick?: () => void;
}

export function TeamsSection({
  teamMembers,
  onManageTeamClick,
}: TeamsSectionProps) {
  return (
    <div>
      <SectionHeader
        title="Teams"
        actionLabel="Manage"
        onAction={onManageTeamClick}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {teamMembers.map((member) => (
          <Card key={member.id}>
            <div className="flex items-center gap-4">
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
    </div>
  );
}
