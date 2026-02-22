"use client";

import * as React from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ModuleRegistry,
  AllCommunityModule,
  themeQuartz,
  type ColDef,
  type ICellRendererParams,
} from "ag-grid-community";
import { Search, MoreVertical, Users, ShieldCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TeamInfoModal } from "./team-info-modal";
import { InviteTeamModal } from "./invite-team-modal";
import {
  EXAMPLE_TEAM_MEMBERS,
  EXAMPLE_ROUTES,
  ROLE_COLORS,
} from "./example-data";
import type { TeamMember } from "./types";
import { PermissionsTab } from "./permissions/permissions-tab";
ModuleRegistry.registerModules([AllCommunityModule]);

const darkTheme = themeQuartz.withParams({
  backgroundColor: "#16181d",
  headerBackgroundColor: "#1a1d23",
  oddRowBackgroundColor: "#1a1d23",
  rowHoverColor: "#2d3440",
  borderColor: "rgba(255,255,255,0.07)",
  foregroundColor: "rgba(255,255,255,0.75)",
  headerTextColor: "rgba(255,255,255,0.45)",
  fontSize: 13,
  selectedRowBackgroundColor: "rgba(52,199,89,0.08)",
});

function NameCell({ data }: ICellRendererParams<TeamMember>) {
  if (!data) return null;
  return (
    <div className="flex items-center gap-2.5 h-full">
      <Avatar className="h-7 w-7 shrink-0">
        <AvatarImage src={data.avatarUrl} />
        <AvatarFallback className="bg-[#2d3440] text-[10px] text-white">
          {data.initials}
        </AvatarFallback>
      </Avatar>
      <span className="text-sm text-white">{data.name}</span>
    </div>
  );
}

function RoleCell({ value }: ICellRendererParams) {
  const color = ROLE_COLORS[value] ?? "#34C759";
  return (
    <span style={{ color }} className="text-sm font-medium">
      {value}
    </span>
  );
}

function ActionCell({ data, context }: ICellRendererParams<TeamMember>) {
  return (
    <button
      onClick={() => context?.onMemberClick?.(data)}
      className="flex h-7 w-7 items-center justify-center rounded-md text-white/40 hover:bg-white/10 hover:text-white transition-colors"
    >
      <MoreVertical className="h-4 w-4" />
    </button>
  );
}

type TabId = "team" | "permissions";

interface TeamsPageProps {
  members?: TeamMember[];
}

export function TeamsPage({ members = EXAMPLE_TEAM_MEMBERS }: TeamsPageProps) {
  const [activeTab, setActiveTab] = React.useState<TabId>("team");
  const [search, setSearch] = React.useState("");
  const [selectedMember, setSelectedMember] = React.useState<TeamMember | null>(
    null,
  );
  const [showInviteModal, setShowInviteModal] = React.useState(false);

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return members;
    return members.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.routeArea.toLowerCase().includes(q),
    );
  }, [members, search]);

  const columnDefs: ColDef<TeamMember>[] = React.useMemo(
    () => [
      {
        field: "name",
        headerName: "Name",
        flex: 1.5,
        minWidth: 160,
        sort: "asc",
        cellRenderer: NameCell,
      },
      {
        field: "role",
        headerName: "Role",
        flex: 1,
        minWidth: 130,
        cellRenderer: RoleCell,
      },
      {
        field: "routeArea",
        headerName: "Route/Area",
        flex: 1,
        minWidth: 110,
      },
      {
        field: "email",
        headerName: "Email",
        flex: 1.5,
        minWidth: 200,
      },
      {
        field: "phone",
        headerName: "Phone Number",
        flex: 1.2,
        minWidth: 140,
      },
      {
        field: "id",
        headerName: "Action",
        flex: 0.5,
        minWidth: 80,
        sortable: false,
        cellRenderer: ActionCell,
        cellStyle: { display: "flex", alignItems: "center" },
      },
    ],
    [],
  );

  const tabs = [
    { id: "team" as TabId, label: "Team", icon: Users },
    { id: "permissions" as TabId, label: "Permissions", icon: ShieldCheck },
  ];

  return (
    <>
      <div className="space-y-5">
        <div className="flex items-center gap-1 w-fit rounded-xl bg-[#1a1d23] border border-white/10 p-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === id
                  ? "bg-[#34C759] text-black"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {activeTab === "team" && (
          <>
            <div className="flex items-center justify-between gap-3">
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search Teams..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#1a1d23] py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/30 focus:border-[#34C759]/50 focus:outline-none"
                />
              </div>
              <button
                onClick={() => setShowInviteModal(true)}
                className="rounded-lg bg-[#34C759] px-5 py-2.5 text-sm font-semibold text-black hover:bg-[#28a745] transition-colors"
              >
                Add Team member
              </button>
            </div>

            <div className="rounded-xl border border-white/10 overflow-hidden">
              <div style={{ height: 580 }}>
                <AgGridReact
                  theme={darkTheme}
                  rowData={filtered}
                  columnDefs={columnDefs}
                  defaultColDef={{ resizable: true, sortable: true }}
                  suppressMovableColumns
                  rowHeight={48}
                  headerHeight={44}
                  pagination
                  paginationPageSize={14}
                  context={{ onMemberClick: setSelectedMember }}
                />
              </div>
            </div>
          </>
        )}

        {activeTab === "permissions" && <PermissionsTab />}
      </div>

      <TeamInfoModal
        member={selectedMember}
        routes={EXAMPLE_ROUTES}
        onClose={() => setSelectedMember(null)}
        onSubmit={(id, routes) => console.log("Assign routes", id, routes)}
        onDelete={(id) => console.log("Delete member", id)}
      />

      <InviteTeamModal
        open={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        routes={EXAMPLE_ROUTES}
        onInvite={(data) => console.log("Invite:", data)}
      />
    </>
  );
}
