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
import {
  Search,
  Users,
  ShieldCheck,
  PlusCircle,
  Pencil,
  Trash2,
} from "lucide-react";
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
import {
  AG_GRID_CLIPBOARD_OPTIONS,
  AG_GRID_MULTI_ROW_SELECTION,
} from "@/lib/ag-grid-clipboard";
import { useAgGridSelectionStats } from "@/hooks/use-ag-grid-selection-stats";
import { AgGridSelectionStatsBar } from "@/components/ui/ag-grid-selection-stats-bar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

ModuleRegistry.registerModules([
  AllCommunityModule,
  ClipboardModule,
  CellSelectionModule,
]);

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

type TabId = "users" | "groups";
type GroupType = "alarm" | "report";

type ManagedGroup = {
  id: string;
  name: string;
  type: GroupType;
  memberIds: string[];
};

interface TeamsPageProps {
  members?: TeamMember[];
}

function NameCell({ data }: ICellRendererParams<TeamMember>) {
  if (!data) return null;
  return (
    <div className="flex h-full items-center gap-2.5">
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

function buildInitialGroups(members: TeamMember[]): ManagedGroup[] {
  const groups = new Map<string, ManagedGroup>();

  members.forEach((member) => {
    member.alarmGroups.forEach((name) => {
      const key = `alarm-${name}`;
      const existing = groups.get(key);
      if (existing) {
        if (!existing.memberIds.includes(member.id)) existing.memberIds.push(member.id);
      } else {
        groups.set(key, {
          id: key,
          name,
          type: "alarm",
          memberIds: [member.id],
        });
      }
    });

    member.reportGroups.forEach((name) => {
      const key = `report-${name}`;
      const existing = groups.get(key);
      if (existing) {
        if (!existing.memberIds.includes(member.id)) existing.memberIds.push(member.id);
      } else {
        groups.set(key, {
          id: key,
          name,
          type: "report",
          memberIds: [member.id],
        });
      }
    });
  });

  return Array.from(groups.values()).sort((a, b) =>
    a.type === b.type ? a.name.localeCompare(b.name) : a.type.localeCompare(b.type),
  );
}

function syncMembersWithGroups(
  members: TeamMember[],
  groups: ManagedGroup[],
): TeamMember[] {
  return members.map((member) => ({
    ...member,
    alarmGroups: groups
      .filter((group) => group.type === "alarm" && group.memberIds.includes(member.id))
      .map((group) => group.name)
      .sort(),
    reportGroups: groups
      .filter((group) => group.type === "report" && group.memberIds.includes(member.id))
      .map((group) => group.name)
      .sort(),
  }));
}

interface GroupEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  members: TeamMember[];
  group: ManagedGroup | null;
  onSave: (group: ManagedGroup) => void;
}

function GroupEditorDialog({
  open,
  onOpenChange,
  members,
  group,
  onSave,
}: GroupEditorDialogProps) {
  const [name, setName] = React.useState("");
  const [type, setType] = React.useState<GroupType>("alarm");
  const [memberIds, setMemberIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (!open) return;
    setName(group?.name ?? "");
    setType(group?.type ?? "alarm");
    setMemberIds(group?.memberIds ?? []);
  }, [group, open]);

  const toggleMember = (memberId: string) => {
    setMemberIds((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId],
    );
  };

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) return;

    onSave({
      id: group?.id ?? crypto.randomUUID(),
      name: trimmed,
      type,
      memberIds,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border-black/10 bg-white dark:border-white/10 dark:bg-[#1A1C1E]">
        <DialogHeader>
          <DialogTitle className="text-black dark:text-white">
            {group ? "Edit Group" : "New Group"}
          </DialogTitle>
          <DialogDescription>
            Define alarm and report groups, then assign users to them here.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label className="text-black dark:text-white">Group Name</Label>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter group name"
              className="border-black/15 bg-white dark:border-white/10 dark:bg-[#252930]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-black dark:text-white">Group Type</Label>
            <div className="flex items-center gap-2">
              {([
                { id: "alarm", label: "Alarm Group" },
                { id: "report", label: "Report Group" },
              ] as const).map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setType(option.id)}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    type === option.id
                      ? "border-[#34C759] bg-[#34C759] text-black"
                      : "border-black/10 bg-black/[0.03] text-black/65 dark:border-white/10 dark:bg-white/[0.03] dark:text-white/65"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-black dark:text-white">Assigned Users</Label>
            <div className="max-h-72 space-y-2 overflow-y-auto rounded-xl border border-black/10 bg-black/[0.02] p-3 dark:border-white/10 dark:bg-white/[0.03]">
              {members.map((member) => (
                <label
                  key={member.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-black/10 bg-white px-3 py-2 dark:border-white/10 dark:bg-[#252930]"
                >
                  <input
                    type="checkbox"
                    checked={memberIds.includes(member.id)}
                    onChange={() => toggleMember(member.id)}
                    className="h-4 w-4 rounded border-black/20 accent-[#34C759] dark:border-white/20"
                  />
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={member.avatarUrl} />
                    <AvatarFallback className="bg-black/10 text-[10px] text-black dark:bg-[#2d3440] dark:text-white">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-black dark:text-white">
                      {member.name}
                    </p>
                    <p className="text-xs text-black/45 dark:text-white/45">
                      {member.role}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-lg border border-black/10 px-4 py-2 text-sm text-black/70 hover:bg-black/5 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!name.trim()}
              className="rounded-lg bg-[#34C759] px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-[#28a745] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save Group
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function TeamsPage({ members = EXAMPLE_TEAM_MEMBERS }: TeamsPageProps) {
  const { stats: selectionStats, onSelectionChanged } =
    useAgGridSelectionStats<TeamMember>();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [activeTab, setActiveTab] = React.useState<TabId>("users");
  const [search, setSearch] = React.useState("");
  const [groupSearch, setGroupSearch] = React.useState("");
  const [selectedMember, setSelectedMember] = React.useState<TeamMember | null>(
    null,
  );
  const [showInviteModal, setShowInviteModal] = React.useState(false);
  const [membersState, setMembersState] = React.useState<TeamMember[]>(members);
  const [groups, setGroups] = React.useState<ManagedGroup[]>(() =>
    buildInitialGroups(members),
  );
  const [editingGroup, setEditingGroup] = React.useState<ManagedGroup | null>(null);
  const [groupEditorOpen, setGroupEditorOpen] = React.useState(false);

  React.useEffect(() => {
    setMembersState(members);
    setGroups(buildInitialGroups(members));
  }, [members]);

  React.useEffect(() => {
    if (!selectedMember) return;
    const updated = membersState.find((member) => member.id === selectedMember.id);
    if (updated) setSelectedMember(updated);
  }, [membersState, selectedMember]);

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return membersState;
    return membersState.filter(
      (member) =>
        member.name.toLowerCase().includes(q) ||
        member.role.toLowerCase().includes(q) ||
        member.email.toLowerCase().includes(q) ||
        member.routeArea.toLowerCase().includes(q) ||
        member.alarmGroups.join(" ").toLowerCase().includes(q) ||
        member.reportGroups.join(" ").toLowerCase().includes(q),
    );
  }, [membersState, search]);

  const filteredGroups = React.useMemo(() => {
    const q = groupSearch.toLowerCase();
    if (!q) return groups;
    return groups.filter((group) =>
      `${group.name} ${group.type}`.toLowerCase().includes(q),
    );
  }, [groupSearch, groups]);

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
      {
        field: "alarmGroups",
        headerName: "Alarm Groups",
        flex: 1.2,
        minWidth: 170,
        valueFormatter: (params) => params.value?.join(", ") || "—",
      },
      {
        field: "reportGroups",
        headerName: "Report Groups",
        flex: 1.2,
        minWidth: 170,
        valueFormatter: (params) => params.value?.join(", ") || "—",
      },
      { field: "email", headerName: "Email", flex: 1.5, minWidth: 200 },
      { field: "phone", headerName: "Phone Number", flex: 1.2, minWidth: 140 },
    ],
    [],
  );

  const tabs = [
    { id: "users" as TabId, label: "Users", icon: Users },
    { id: "groups" as TabId, label: "Groups", icon: ShieldCheck },
  ];

  const openCreateGroup = () => {
    setEditingGroup(null);
    setGroupEditorOpen(true);
  };

  const openEditGroup = (group: ManagedGroup) => {
    setEditingGroup(group);
    setGroupEditorOpen(true);
  };

  const handleSaveGroup = (group: ManagedGroup) => {
    const nextGroups = (() => {
      const withoutCurrent = groups.filter((item) => item.id !== group.id);
      return [...withoutCurrent, group].sort((a, b) =>
        a.type === b.type
          ? a.name.localeCompare(b.name)
          : a.type.localeCompare(b.type),
      );
    })();

    setGroups(nextGroups);
    setMembersState((prev) => syncMembersWithGroups(prev, nextGroups));
    setEditingGroup(null);
  };

  const handleDeleteGroup = (groupId: string) => {
    const nextGroups = groups.filter((group) => group.id !== groupId);
    setGroups(nextGroups);
    setMembersState((prev) => syncMembersWithGroups(prev, nextGroups));
    if (editingGroup?.id === groupId) {
      setEditingGroup(null);
      setGroupEditorOpen(false);
    }
  };

  return (
    <>
      <div className="space-y-5">
        <div className="flex w-fit items-center gap-1 rounded-xl border border-black/10 bg-black/5 p-1 dark:border-white/10 dark:bg-[#1a1d23]">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === id
                  ? "bg-[#34C759] text-black"
                  : "text-black/50 hover:bg-black/5 hover:text-black dark:text-white/50 dark:hover:bg-white/5 dark:hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {activeTab === "users" && (
          <>
            <div className="flex items-center justify-between gap-3">
              <div className="relative w-64">
                <Search className="app-search-icon" />
                <input
                  type="text"
                  placeholder="Search Users"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="app-search-input w-full"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowInviteModal(true)}
                className="flex items-center gap-2 rounded-lg bg-[#34C759] px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-[#28a745]"
              >
                <PlusCircle className="h-4 w-4" />
                Add User
              </button>
            </div>

            <div className="overflow-hidden rounded-xl border border-black/10 dark:border-white/10">
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
                  getRowStyle={() => ({ cursor: "pointer" })}
                  onRowClicked={(event) => {
                    if (event.data) setSelectedMember(event.data);
                  }}
                  onSelectionChanged={onSelectionChanged}
                  {...AG_GRID_CLIPBOARD_OPTIONS}
                />
              </div>
            </div>
            <AgGridSelectionStatsBar stats={selectionStats} />
          </>
        )}

        {activeTab === "groups" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="app-search-icon" />
                <input
                  type="text"
                  placeholder="Search Groups"
                  value={groupSearch}
                  onChange={(event) => setGroupSearch(event.target.value)}
                  className="app-search-input w-full"
                />
              </div>

              <button
                type="button"
                onClick={openCreateGroup}
                className="flex items-center gap-2 rounded-lg bg-[#34C759] px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-[#28a745]"
              >
                <PlusCircle className="h-4 w-4" />
                Add Group
              </button>
            </div>

            <div className="grid gap-3 lg:grid-cols-2">
              {filteredGroups.map((group) => {
                const assignedMembers = membersState.filter((member) =>
                  group.memberIds.includes(member.id),
                );
                return (
                  <div
                    key={group.id}
                    className="rounded-xl border border-black/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#1A1C1E]/95"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-black dark:text-white">
                          {group.name}
                        </p>
                        <p className="text-xs text-black/45 dark:text-white/45">
                          {group.type === "alarm" ? "Alarm Group" : "Report Group"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-[#34C759]/12 px-2.5 py-1 text-[11px] font-semibold text-[#1f9e45] dark:text-[#7DFF9F]">
                          {assignedMembers.length} users
                        </span>
                        <button
                          type="button"
                          onClick={() => openEditGroup(group)}
                          className="rounded-lg border border-black/10 p-2 text-black/55 hover:bg-black/5 hover:text-black dark:border-white/10 dark:text-white/55 dark:hover:bg-white/5 dark:hover:text-white"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteGroup(group.id)}
                          className="rounded-lg border border-red-500/20 p-2 text-red-500/70 hover:bg-red-500/10 hover:text-red-500"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {assignedMembers.length > 0 ? (
                        assignedMembers.map((member) => (
                          <span
                            key={member.id}
                            className="rounded-full border border-black/10 bg-black/[0.03] px-2.5 py-1 text-[11px] text-black/65 dark:border-white/10 dark:bg-white/[0.03] dark:text-white/65"
                          >
                            {member.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-black/40 dark:text-white/40">
                          No users assigned yet.
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <GroupEditorDialog
        open={groupEditorOpen}
        onOpenChange={setGroupEditorOpen}
        members={membersState}
        group={editingGroup}
        onSave={handleSaveGroup}
      />

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
