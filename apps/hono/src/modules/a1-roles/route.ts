import { Hono } from "hono";

import * as service from "./service";

const app = new Hono();

app.get("/", async (c) => {
  return c.json(
    await service.getRoles(),
  );
});

app.get("/:id", async (c) => {
  const role = await service.getRoleById(
    c.req.param("id"),
  );

  if (!role) {
    return c.json(
      {
        message: "Role not found",
      },
      404,
    );
  }

  return c.json(role);
});

app.post("/", async (c) => {
  const body = await c.req.json();

  const role = await service.createRole(body);

  return c.json(role, 201);
});

app.patch("/:id", async (c) => {
  const body = await c.req.json();

  const role = await service.updateRole(
    c.req.param("id"),
    body,
  );

  if (!role) {
    return c.json(
      {
        message: "Role not found",
      },
      404,
    );
  }

  return c.json(role);
});

app.delete("/:id", async (c) => {
  const role = await service.deleteRole(
    c.req.param("id"),
  );

  if (!role) {
    return c.json(
      {
        message: "Role not found",
      },
      404,
    );
  }

  return c.json({
    success: true,
  });
});

export default app;