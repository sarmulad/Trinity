"use client";

import * as React from "react";
import {
  ChevronRight,
  ChevronDown,
  Building2,
  GitBranch,
  FileStack,
  MapPin,
  Droplet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Company } from "@/types/dashboard";

type TreeNode = {
  id: string;
  name: string;
  children?: TreeNode[];
};

const DEPTH_CONFIG = [
  { icon: Building2, color: "text-black/40 dark:text-white/40" },
  { icon: GitBranch, color: "text-black/30 dark:text-white/30" },
  { icon: FileStack, color: "text-black/30 dark:text-white/30" },
  { icon: MapPin, color: "text-black/30 dark:text-white/30" },
  { icon: Droplet, color: "text-[#34C759]" },
];

function normalize(companies: Company[]): TreeNode[] {
  return companies.map((c) => ({
    id: c.id,
    name: c.name,
    children: c.routes?.map((r) => ({
      id: r.id,
      name: r.name,
      children: r.leases?.map((l) => ({
        id: l.id,
        name: l.name,
        children: l.areas?.map((a) => ({
          id: a.id,
          name: a.name,
          children: a.wells?.map((w) => ({ id: w.id, name: w.name })),
        })),
      })),
    })),
  }));
}

function filterTree(nodes: TreeNode[], query: string): TreeNode[] {
  if (!query.trim()) return nodes;
  return nodes.reduce<TreeNode[]>((acc, node) => {
    if (node.name.toLowerCase().includes(query.toLowerCase())) {
      acc.push(node);
    } else {
      const matchedChildren = filterTree(node.children ?? [], query);
      if (matchedChildren.length > 0) {
        acc.push({ ...node, children: matchedChildren });
      }
    }
    return acc;
  }, []);
}

function TreeNode({
  node,
  depth = 0,
  forceOpen = false,
}: {
  node: TreeNode;
  depth?: number;
  forceOpen?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const hasChildren = (node.children?.length ?? 0) > 0;
  const { icon: Icon, color } =
    DEPTH_CONFIG[Math.min(depth, DEPTH_CONFIG.length - 1)];
  const isOpen = forceOpen || open;

  return (
    <div>
      <button
        onClick={() => hasChildren && setOpen((v) => !v)}
        style={{ paddingLeft: `${depth * 12}px` }}
        className={cn(
          "flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-black/60 dark:text-white/60",
          hasChildren
            ? "hover:bg-black/5 hover:text-black dark:hover:bg-white/5 dark:hover:text-white"
            : "cursor-default",
        )}
      >
        {hasChildren ? (
          isOpen ? (
            <ChevronDown className="h-3.5 w-3.5 shrink-0" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          )
        ) : (
          <span className="w-3.5 shrink-0" />
        )}
        <Icon className={cn("h-4 w-4 shrink-0", color)} />
        <span className="truncate text-left">{node.name}</span>
      </button>

      {isOpen &&
        node.children?.map((child) => (
          <TreeNode
            key={child.id}
            node={child}
            depth={depth + 1}
            forceOpen={forceOpen}
          />
        ))}
    </div>
  );
}

interface DashboardTreeProps {
  data: Company[];
  searchQuery: string;
  sortAsc: boolean;
}

export function DashboardTree({
  data,
  searchQuery,
  sortAsc,
}: DashboardTreeProps) {
  const nodes = React.useMemo(() => {
    let result = normalize(data);
    if (searchQuery.trim()) {
      result = filterTree(result, searchQuery);
    }
    return sortAsc ? result : [...result].reverse();
  }, [data, searchQuery, sortAsc]);

  if (nodes.length === 0) {
    return (
      <p className="px-2 py-4 text-center text-xs text-black/30 dark:text-white/30">
        No results found
      </p>
    );
  }

  return (
    <div className="mt-1">
      {nodes.map((node) => (
        <TreeNode key={node.id} node={node} forceOpen={!!searchQuery.trim()} />
      ))}
    </div>
  );
}
