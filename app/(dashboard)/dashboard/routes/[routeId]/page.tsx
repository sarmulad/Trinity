import { RouteDetailPage } from "@/components/routes/route-detail-page";

interface RouteDetailRouteProps {
  params: Promise<{ routeId: string }>;
  searchParams?: Promise<{ name?: string }>;
}

export default async function RouteDetailRoute({
  params,
  searchParams,
}: RouteDetailRouteProps) {
  const { routeId } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  return (
    <RouteDetailPage
      routeId={routeId}
      routeName={resolvedSearchParams?.name}
    />
  );
}
