"use client";

import * as React from "react";
import { PlusCircle, Search, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { ErrorBoundary } from "@/components/error-boundary";
import { RouteCard } from "./route-card";
import { NewRouteModal } from "./new-route-modal";
import { DeleteRouteModal } from "./delete-route-modal";
import type { RouteListItem, RouteStop } from "./types";

function buildMockGrid(): RouteListItem["completionGrid"] {
  const grid: RouteListItem["completionGrid"] = [];
  for (let d = 15; d <= 28; d++) {
    if (d <= 21) grid.push({ date: d, status: "completed" });
    else if (d <= 23) grid.push({ date: d, status: "incomplete" });
    else grid.push({ date: d, status: "future" });
  }
  return grid;
}

export function RoutesPage() {
  const router = useRouter();
  const [routes, setRoutes] = React.useState<RouteListItem[]>([]);
  const [search, setSearch] = React.useState("");
  const [newModalOpen, setNewModalOpen] = React.useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [editingRoute, setEditingRoute] = React.useState<RouteListItem | null>(
    null,
  );
  const [routeToDelete, setRouteToDelete] =
    React.useState<RouteListItem | null>(null);

  const filteredRoutes = React.useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return routes;
    return routes.filter((r) => r.name.toLowerCase().includes(q));
  }, [routes, search]);

  const handleCreateRoute = () => {
    setEditingRoute(null);
    setNewModalOpen(true);
  };
  const handleEditRoute = (route: RouteListItem) => {
    setEditingRoute(route);
    setNewModalOpen(true);
  };
  const handleSaveRoute = (name: string, stops: RouteStop[]) => {
    if (editingRoute) {
      setRoutes((prev) =>
        prev.map((r) =>
          r.id === editingRoute.id
            ? { ...r, name: name || r.name, totalStops: stops.length }
            : r,
        ),
      );
    } else {
      setRoutes((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          name: name || "New Route",
          totalStops: stops.length,
          lastCompleted: "—",
          completionGrid: buildMockGrid(),
        },
      ]);
    }
    setNewModalOpen(false);
    setEditingRoute(null);
  };
  const handleDeleteClick = (route: RouteListItem) => {
    setRouteToDelete(route);
    setDeleteModalOpen(true);
  };
  const handleOpenRoute = (route: RouteListItem) => {
    router.push(
      `/dashboard/routes/${route.id}?name=${encodeURIComponent(route.name)}`,
    );
  };
  const handleConfirmDelete = () => {
    if (routeToDelete) {
      setRoutes((prev) => prev.filter((r) => r.id !== routeToDelete.id));
      setRouteToDelete(null);
    }
  };

  const isEmpty = routes.length === 0;

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div className={isEmpty ? "flex justify-center" : "space-y-4"}>
          {!isEmpty && (
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-64">
                <Search className="app-search-icon" />
                <input
                  type="text"
                  placeholder="Search Routes"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="app-search-input w-full"
                />
              </div>
              <button
                type="button"
                onClick={handleCreateRoute}
                className="flex items-center gap-2 rounded-lg bg-[#34C759] px-4 py-2 text-sm font-medium text-black hover:bg-[#28a745] transition-colors"
              >
                <PlusCircle className="h-4 w-4 shrink-0" />
                Add New Route
              </button>
            </div>
          )}
        </div>

        {isEmpty ? (
          <Card className="border-black/10 bg-white overflow-hidden dark:border-white/10 dark:bg-[#1A1C1E]/95">
            <CardContent className="relative flex min-h-[420px] flex-col items-center justify-center p-8">
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: "url('/images/dashboard-bg.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className="relative flex flex-col items-center gap-6">
                <div className="flex items-center gap-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-black/30 bg-black/5 dark:border-white/30 dark:bg-white/5">
                    <MapPin className="h-6 w-6 text-[#34C759]" />
                  </div>
                  <div className="h-0.5 w-12 border-t-2 border-dashed border-black/30 dark:border-white/30" />
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-black/30 bg-black/5 dark:border-white/30 dark:bg-white/5">
                    <MapPin className="h-6 w-6 text-[#34C759]" />
                  </div>
                </div>
                <p className="text-lg font-medium text-black dark:text-white">
                  No Routes Exist
                </p>
                <button
                  type="button"
                  onClick={handleCreateRoute}
                  className="flex items-center gap-2 rounded-lg bg-[#34C759] px-4 py-2 text-sm font-medium text-black hover:bg-[#28a745] transition-colors"
                >
                  <PlusCircle className="h-4 w-4 shrink-0" />
                  Create New Route
                </button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredRoutes.map((route) => (
              <RouteCard
                key={route.id}
                route={route}
                onEdit={handleEditRoute}
                onDelete={handleDeleteClick}
                onOpen={handleOpenRoute}
              />
            ))}
          </div>
        )}

        <NewRouteModal
          open={newModalOpen}
          onOpenChange={setNewModalOpen}
          initialRoute={
            editingRoute ? { name: editingRoute.name, stops: [] } : null
          }
          onSave={handleSaveRoute}
        />
        <DeleteRouteModal
          open={deleteModalOpen}
          onOpenChange={setDeleteModalOpen}
          routeName={routeToDelete?.name}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </ErrorBoundary>
  );
}
