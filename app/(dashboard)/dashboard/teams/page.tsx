import { TeamsPage } from "@/components/teams/teams-page";

export default function TeamsRoute() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-black dark:text-white">Teams</h1>
      <TeamsPage />
    </div>
  );
}
