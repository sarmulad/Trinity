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
import { CellSelectionModule, ClipboardModule } from "ag-grid-enterprise";
import { Search, MoreVertical, Users, ShieldCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TeamInfoModal } from "./team-info-modal";
import { InviteTeamModal } from "./invite-team-modal";
import { useTheme } from "next-themes";
import {
  EXAMPLE_TEAM_MEMBERS,
  EXAMPLE_ROUTES,
  ROLE_COLORS,
} from "./example-data";
import type { TeamMember } from "./types";
import { PermissionsTab } from "./permissions/permissions-tab";
import {
  AG_GRID_CLIPBOARD_OPTIONS,
  AG_GRID_MULTI_ROW_SELECTION,
} from "@/lib/ag-grid-clipboard";
import { useAgGridSelectionStats } from "@/hooks/use-ag-grid-selection-stats";
import { AgGridSelectionStatsBar } from "@/components/ui/ag-grid-selection-stats-bar";

ModuleRegistry.registerModules([
  AllCommunityModule,
  ClipboardModule,
  CellSelectionModule,
]);

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

const lightTheme = themeQuartz.withParams({
  backgroundColor: "#ffffff",
  headerBackgroundColor: "#f4f6f8",
  oddRowBackgroundColor: "#f9fafb",
  rowHoverColor: "#f0f2f4",
  borderColor: "rgba(0,0,0,0.07)",
  foregroundColor: "rgba(0,0,0,0.75)",
  headerTextColor: "rgba(0,0,0,0.45)",
  fontSize: 13,
  selectedRowBackgroundColor: "rgba(52,199,89,0.08)",
});

function NameCell({ data }: ICellRendererParams<TeamMember>) {
  if (!data) return null;
  return (
    <div className="flex items-center gap-2.5 h-full">
      <Avatar className="h-7 w-7 shrink-0">
        <AvatarImage src={data.avatarUrl} />
        <AvatarFallback className="bg-black/10 text-[10px] text-black dark:bg-[#2d3440] dark:text-white">
          {data.initials}
        </AvatarFallback>
      </Avatar>
      <span className="text-sm text-black dark:text-white">{data.name}</span>
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
      className="flex h-7 w-7 items-center justify-center rounded-md text-black/40 hover:bg-black/10 hover:text-black dark:text-white/40 dark:hover:bg-white/10 dark:hover:text-white transition-colors"
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
  const { stats: selectionStats, onSelectionChanged } =
    useAgGridSelectionStats<TeamMember>();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

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
      { field: "routeArea", headerName: "Route/Area", flex: 1, minWidth: 110 },
      { field: "email", headerName: "Email", flex: 1.5, minWidth: 200 },
      { field: "phone", headerName: "Phone Number", flex: 1.2, minWidth: 140 },
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
        <div className="flex items-center gap-1 w-fit rounded-xl border border-black/10 bg-black/5 p-1 dark:border-white/10 dark:bg-[#1a1d23]">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === id
                  ? "bg-[#34C759] text-black"
                  : "text-black/50 hover:text-black hover:bg-black/5 dark:text-white/50 dark:hover:text-white dark:hover:bg-white/5"
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
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-black/30 pointer-events-none dark:text-white/30" />
                <input
                  type="text"
                  placeholder="Search Teams..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-black/10 bg-black/5 py-2 pl-9 pr-3 text-sm text-black placeholder:text-black/30 focus:border-[#34C759]/50 focus:outline-none dark:border-white/10 dark:bg-[#1a1d23] dark:text-white dark:placeholder:text-white/30"
                />
              </div>
              <button
                onClick={() => setShowInviteModal(true)}
                className="rounded-lg bg-[#34C759] px-5 py-2.5 text-sm font-semibold text-black hover:bg-[#28a745] transition-colors"
              >
                Add Team member
              </button>
            </div>

            <div className="rounded-xl border border-black/10 overflow-hidden dark:border-white/10">
              <div style={{ height: 580 }}>
                <AgGridReact
                  theme={isDark ? darkTheme : lightTheme}
                  rowData={filtered}
                  columnDefs={columnDefs}
                  defaultColDef={{ resizable: true, sortable: true }}
                  suppressMovableColumns
                  rowHeight={48}
                  headerHeight={44}
                  rowSelection={AG_GRID_MULTI_ROW_SELECTION}
                  pagination
                  paginationPageSize={14}
                  context={{ onMemberClick: setSelectedMember }}
                  onSelectionChanged={onSelectionChanged}
                  {...AG_GRID_CLIPBOARD_OPTIONS}
                />
              </div>
            </div>
            <AgGridSelectionStatsBar stats={selectionStats} />
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
