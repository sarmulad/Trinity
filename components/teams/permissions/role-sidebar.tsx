import type { RoleGroup } from "./types";

interface RoleSidebarProps {
  roles: RoleGroup[];
  selectedRoleId: string;
  onSelect: (id: string) => void;
}

export function RoleSidebar({
  roles,
  selectedRoleId,
  onSelect,
}: RoleSidebarProps) {
  return (
    <div className="w-48 shrink-0 pt-2">
      <div className="space-y-1">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => onSelect(role.id)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              selectedRoleId === role.id
                ? "text-[#34C759] font-medium"
                : "text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white"
            }`}
          >
            {role.label}
          </button>
        ))}
      </div>
    </div>
  );
}
