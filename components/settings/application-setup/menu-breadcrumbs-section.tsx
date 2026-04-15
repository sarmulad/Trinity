"use client";

import * as React from "react";
import { GripVertical } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

import { DEFAULT_MENU_NAV, type MenuNavItem } from "./mock-data";

function reorderMenuNav(
  list: MenuNavItem[],
  fromIndex: number,
  toIndex: number,
): MenuNavItem[] {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= list.length ||
    toIndex >= list.length
  ) {
    return list;
  }
  const next = [...list];
  const [removed] = next.splice(fromIndex, 1);
  let insertAt = toIndex;
  if (fromIndex < toIndex) {
    insertAt = fromIndex === toIndex - 1 ? toIndex : toIndex - 1;
  }
  next.splice(insertAt, 0, removed);
  return next;
}

export function MenuBreadcrumbsSection() {
  const [items, setItems] = React.useState<MenuNavItem[]>(DEFAULT_MENU_NAV);
  const itemsRef = React.useRef(items);
  React.useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const [draggingId, setDraggingId] = React.useState<string | null>(null);
  const [dragOverId, setDragOverId] = React.useState<string | null>(null);
  const [orderDirty, setOrderDirty] = React.useState(false);

  React.useEffect(() => {
    if (!draggingId) return;
    const previous = document.body.style.cursor;
    document.body.style.cursor = "grabbing";
    return () => {
      document.body.style.cursor = previous;
    };
  }, [draggingId]);

  const toggle = React.useCallback((id: string, visible: boolean) => {
    setItems((prev) =>
      prev.map((m) => (m.id === id ? { ...m, visible } : m)),
    );
  }, []);

  const handleDragStart = React.useCallback(
    (e: React.DragEvent, id: string) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("[data-no-drag]")) {
        e.preventDefault();
        return;
      }
      e.dataTransfer.setData("text/plain", id);
      e.dataTransfer.effectAllowed = "move";
      setDraggingId(id);
    },
    [],
  );

  const handleDragEnd = React.useCallback(() => {
    setDraggingId(null);
    setDragOverId(null);
  }, []);

  const handleDragOver = React.useCallback((e: React.DragEvent, overId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggingId && draggingId !== overId) {
      setDragOverId(overId);
    }
  }, [draggingId]);

  const handleDragLeave = React.useCallback((e: React.DragEvent) => {
    const related = e.relatedTarget as Node | null;
    if (!e.currentTarget.contains(related)) {
      setDragOverId(null);
    }
  }, []);

  const handleDrop = React.useCallback((e: React.DragEvent, overId: string) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text/plain");
    setDragOverId(null);
    setDraggingId(null);
    if (!draggedId || draggedId === overId) return;

    const prev = itemsRef.current;
    const from = prev.findIndex((m) => m.id === draggedId);
    const to = prev.findIndex((m) => m.id === overId);
    if (from === -1 || to === -1 || from === to) return;

    setItems(reorderMenuNav(prev, from, to));
    setOrderDirty(true);
  }, []);

  const handleSaveOrder = React.useCallback(() => {
    setOrderDirty(false);
    toast.success("Menu order saved");
  }, []);

  return (
    <div className="mx-auto w-full max-w-lg space-y-4">
      <p className="text-sm text-black/60 dark:text-white/60">
        Configure how the sidebar and breadcrumb navigation is organized. Drag
        rows by the handle to reorder; use the toggles to show or hide
        sections.
      </p>

      <ul className="space-y-2" aria-label="Menu items">
        {items.map((item) => {
          const isDragging = draggingId === item.id;
          const isOver = dragOverId === item.id && draggingId && draggingId !== item.id;

          return (
            <li
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e, item.id)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => handleDragOver(e, item.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, item.id)}
              className={cn(
                "flex cursor-grab items-center gap-3 rounded-lg border border-black/10 bg-white px-3 py-2.5 transition-shadow active:cursor-grabbing dark:border-white/10 dark:bg-[#252930]",
                isDragging && "cursor-grabbing opacity-50",
                isOver && "ring-2 ring-[#34C759]/60 ring-offset-2 ring-offset-white dark:ring-offset-[#1A1C1E]",
              )}
            >
              <span
                className="text-black/35 dark:text-white/35"
                aria-hidden
              >
                <GripVertical className="h-4 w-4" />
              </span>
              <span className="flex-1 select-none text-sm font-medium text-black dark:text-white">
                {item.name}
              </span>
              <div
                className="flex cursor-default items-center gap-2"
                data-no-drag
              >
                <Label htmlFor={`nav-${item.id}`} className="sr-only">
                  Show {item.name}
                </Label>
                <Switch
                  id={`nav-${item.id}`}
                  checked={item.visible}
                  onCheckedChange={(v) => toggle(item.id, v)}
                />
              </div>
            </li>
          );
        })}
      </ul>

      <Button
        type="button"
        disabled={!orderDirty}
        onClick={handleSaveOrder}
        className="bg-[#34C759] font-medium text-black hover:bg-[#28a745] disabled:pointer-events-none disabled:opacity-50"
      >
        Save order
      </Button>
    </div>
  );
}
