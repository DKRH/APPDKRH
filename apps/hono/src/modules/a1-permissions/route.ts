import { Hono } from "hono";

import * as service from "./service";

const app = new Hono();

app.get("/", async (c) => {
  const systemId =
    c.req.query("systemId");

  const permissions =
    await service.getPermissions(systemId);

  return c.json(permissions);
});

app.post("/", async (c) => {
  const body = await c.req.json();

  const permission =
    await service.createPermission(body);

  return c.json(permission, 201);
});

app.patch("/:id", async (c) => {
  const body = await c.req.json();

  const permission =
    await service.updatePermission(
      c.req.param("id"),
      body,
    );

  if (!permission) {
    return c.json(
      {
        message: "Permission not found",
      },
      404,
    );
  }

  return c.json(permission);
});

app.delete("/:id", async (c) => {
  const permission =
    await service.deletePermission(
      c.req.param("id"),
    );

  if (!permission) {
    return c.json(
      {
        message: "Permission not found",
      },
      404,
    );
  }

  return c.json({
    success: true,
  });
});

export default app;