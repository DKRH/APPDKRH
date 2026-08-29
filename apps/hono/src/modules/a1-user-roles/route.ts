import { Hono } from "hono";

import * as service from "./service";

const app = new Hono();

app.get("/:userId", async (c) => {
  const roles =
    await service.getUserRoles(
      c.req.param("userId"),
    );

  return c.json(roles);
});

app.post("/:userId/:roleId", async (c) => {
  const result =
    await service.assignRole(
      c.req.param("userId"),
      c.req.param("roleId"),
    );

  if (!result) {
    return c.json(
      {
        message:
          "Role already assigned",
      },
      409,
    );
  }

  return c.json(result, 201);
});

app.delete(
  "/:userId/:roleId",
  async (c) => {
    const result =
      await service.removeRole(
        c.req.param("userId"),
        c.req.param("roleId"),
      );

    if (!result) {
      return c.json(
        {
          message:
            "Role assignment not found",
        },
        404,
      );
    }

    return c.json({
      success: true,
    });
  },
);

export default app;