import { Hono } from "hono";
import { db, zApps, zAppIps, eq, desc } from "@dkrh/db";

const app = new Hono();

/**
 * List applications
 */
app.get("/", async (c) => {
  const apps = await db.select().from(zApps).orderBy(desc(zApps.createdAt));

  return c.json(apps);
});

/**
 * Get application + IP history
 */
app.get("/:id", async (c) => {
  const id = c.req.param("id");

  const [appData] = await db
    .select()
    .from(zApps)
    .where(eq(zApps.id, id))
    .limit(1);

  if (!appData) {
    return c.json({ message: "App not found" }, 404);
  }

  const ips = await db
    .select()
    .from(zAppIps)
    .where(eq(zAppIps.appId, id))
    .orderBy(desc(zAppIps.lastSeenAt));

  return c.json({
    ...appData,
    ips,
  });
});

/**
 * Create application
 */
app.post("/", async (c) => {
  const body = await c.req.json<{
    name: string;
  }>();

  if (!body.name?.trim()) {
    return c.json({ message: "Name is required" }, 400);
  }

  const [result] = await db
    .insert(zApps)
    .values({
      name: body.name.trim(),
    })
    .returning();

  return c.json(result, 201);
});

/**
 * Server heartbeat
 *
 * The server's public IP is determined
 * from the incoming request.
 */
app.get("/:id/heartbeat", async (c) => {
  const appId = c.req.param("id");

  const [appData] = await db
    .select()
    .from(zApps)
    .where(eq(zApps.id, appId))
    .limit(1);

  if (!appData) {
    return c.json({ message: "App not found" }, 404);
  }

  const ip =
    c.req.header("x-real-ip") ??
    c.req.header("x-forwarded-for")?.split(",")[0]?.trim();

  if (!ip) {
    return c.json({ message: "Unable to determine public IP" }, 400);
  }

  const [result] = await db
    .insert(zAppIps)
    .values({
      appId,
      ipPublic: ip,
    })
    .returning();

  return c.json({
    message: "Heartbeat received",
    ip: result.ipPublic,
  });
});

export default app;
