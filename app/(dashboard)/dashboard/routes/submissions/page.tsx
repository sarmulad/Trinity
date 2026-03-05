import { RouteSubmissionsPage } from "@/components/routes/route-submissions-page";

interface RouteSubmissionsRouteProps {
  searchParams?: Promise<{ routeId?: string; name?: string }>;
}

export default async function RouteSubmissionsRoute({
  searchParams,
}: RouteSubmissionsRouteProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  return (
    <RouteSubmissionsPage
      routeId={resolvedSearchParams?.routeId}
      routeName={resolvedSearchParams?.name}
    />
  );
}
