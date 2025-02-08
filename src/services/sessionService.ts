import { getSession } from "@auth0/nextjs-auth0";

export async function fetchSession() {
  const session = await getSession();
  return session;
}
