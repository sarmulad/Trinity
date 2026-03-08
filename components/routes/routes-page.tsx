"use client";

import * as React from "react";
import { Plus, Search, MapPin, Cloud } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
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
    const name = encodeURIComponent(route.name);
    router.push(`/dashboard/routes/${route.id}?name=${name}`);
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
          <h1 className="flex items-center gap-2 text-3xl font-bold text-white">
            Routes
            <span className="flex items-center gap-1 text-xl font-normal text-white/60">
              <Cloud className="h-5 w-5" />
              48°
            </span>
          </h1>
          {!isEmpty && (
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/45" />
                <input
                  type="text"
                  placeholder="Search Routes"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-12 w-[177px]  rounded-[5px] border border-white/35 bg-[#1A1D22]/85 py-2 pl-8 pr-3 text-sm text-white placeholder:text-white/40 focus:border-[#34C759]/60 focus:outline-none"
                />
              </div>
              <Button
                className="h-12 rounded-[5px] bg-[#34C759] px-5 text-white hover:bg-[#34C759]/90"
                onClick={handleCreateRoute}
              >
                Add new Route
              </Button>
            </div>
          )}
        </div>

        {isEmpty ? (
          <Card className="border-white/10 bg-[#1A1C1E]/95 overflow-hidden">
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
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-white/30 bg-white/5">
                    <MapPin className="h-6 w-6 text-[#34C759]" />
                  </div>
                  <div className="h-0.5 w-12 border-t-2 border-dashed border-white/30" />
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-white/30 bg-white/5">
                    <MapPin className="h-6 w-6 text-[#34C759]" />
                  </div>
                </div>
                <p className="text-lg font-medium text-white">
                  No Routes Exist
                </p>
                <Button
                  className="bg-[#34C759] text-black hover:bg-[#34C759]/90"
                  onClick={handleCreateRoute}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Route
                </Button>
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
            editingRoute
              ? {
                  name: editingRoute.name,
                  stops: [], // could map from route if we had stops on RouteListItem
                }
              : null
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
