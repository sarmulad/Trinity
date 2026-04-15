import { redirect } from "next/navigation";

interface ReportDetailRouteProps {
  params: Promise<{ id: string }>;
}

export default async function ReportDetailRoute({ params }: ReportDetailRouteProps) {
  const { id } = await params;
  redirect(`/dashboard/reports?view=detail&report=${encodeURIComponent(id)}`);
}
