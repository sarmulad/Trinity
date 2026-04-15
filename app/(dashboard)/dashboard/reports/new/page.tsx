import { redirect } from "next/navigation";

export default function NewReportRoute() {
  redirect("/dashboard/reports?view=custom");
}
