// app/lib/checkRole.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * Check if the logged-in user has the required role(s)
 * @param roles - Array of allowed roles e.g. ["admin", "editor"]
 * @param session - Optional session object. If not provided, function fetches server session.
 * @returns boolean
 */
export const checkRole = async (roles: string[], session?: any): Promise<boolean> => {
  let userSession = session;

  if (!userSession) {
    userSession = await getServerSession(authOptions);
  }

  if (!userSession || !userSession.user) return false;

  const userRole = userSession.user.role; // আপনার User model এ role field থাকতে হবে

  if (!userRole) return false;

  return roles.includes(userRole);
};
