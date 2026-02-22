export type TeamRole =
  | "Pumper"
  | "Field service"
  | "Superintendent"
  | "Foreman"
  | "Admin";

export interface TeamMember {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  role: TeamRole;
  routeArea: string;
  email: string;
  phone: string;
  company: string;
  status: "Active" | "Inactive";
  assignment: string;
  avatarUrl?: string;
  initials: string;
}

export interface Route {
  id: string;
  name: string;
}
