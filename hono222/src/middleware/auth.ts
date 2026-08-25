import { auth } from "@/lib/auth";

export async function authMiddleware(c, next) {
  if (c.req.path.startsWith("/api/auth")) {
    return await next();
  }
  const session = await auth.api.getSession({
      headers: c.req.raw.headers,
  });
  c.set("userId", session?.user.id);

  if (!session) {
    return c.json(
      { error: "Unauthorized" },
      401
    );
  }

  c.set("session", session);

  await next();
}