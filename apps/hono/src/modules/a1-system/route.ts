import { Hono } from "hono";

import * as service from "./service";

const app = new Hono();

app.get("/", async (c) => {
  const systems = await service.getSystems();

  return c.json(systems);
});

app.get("/:id", async (c) => {
  const system = await service.getSystemById(
    c.req.param("id"),
  );

  if (!system) {
    return c.json(
      {
        message: "System not found",
      },
      404,
    );
  }

  return c.json(system);
});

app.post("/", async (c) => {
  const body = await c.req.json();

  const system = await service.createSystem({
    code: body.code,
    name: body.name,
    description: body.description,
  });

  return c.json(system, 201);
});

app.patch("/:id", async (c) => {
  const body = await c.req.json();

  const system = await service.updateSystem(
    c.req.param("id"),
    body,
  );

  if (!system) {
    return c.json(
      {
        message: "System not found",
      },
      404,
    );
  }

  return c.json(system);
});

app.delete("/:id", async (c) => {
  const system = await service.deleteSystem(
    c.req.param("id"),
  );

  if (!system) {
    return c.json(
      {
        message: "System not found",
      },
      404,
    );
  }

  return c.json({
    success: true,
  });
});

export default app;