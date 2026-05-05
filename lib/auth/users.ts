export type Role = "safety_lead" | "safety_admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}

/**
 * Dev-only user list. Real production needs SSO (NextAuth/Auth.js, Workos,
 * or similar) backed by your customer's IdP. This stub is good enough for
 * dogfooding the safety surface without standing up an auth provider.
 */
export const USERS: User[] = [
  {
    id: "u_lead",
    email: "lead@trainovate.demo",
    name: "Priya Shah",
    role: "safety_lead",
  },
  {
    id: "u_admin",
    email: "admin@trainovate.demo",
    name: "Marcus Webb",
    role: "safety_admin",
  },
];

export function findUserByEmail(email: string): User | undefined {
  const e = email.trim().toLowerCase();
  return USERS.find((u) => u.email.toLowerCase() === e);
}

export function findUserById(id: string): User | undefined {
  return USERS.find((u) => u.id === id);
}
