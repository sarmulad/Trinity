import { ReportDetailPage } from "@/components/reports/report-detail-page";

interface ReportDetailRouteProps {
  params: Promise<{ id: string }>;
}

export default async function ReportDetailRoute({ params }: ReportDetailRouteProps) {
  const { id } = await params;
  return <ReportDetailPage reportId={id} />;
}
