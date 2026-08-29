import { Hono } from "hono";

import * as service from "./service";

const app = new Hono();

app.get("/:roleId", async (c) => {
  const permissions =
    await service.getRolePermissions(
      c.req.param("roleId"),
    );

  return c.json(permissions);
});

app.post("/:roleId/:permissionId", async (c) => {
  const result =
    await service.assignPermission(
      c.req.param("roleId"),
      c.req.param("permissionId"),
    );

  if (!result) {
    return c.json(
      {
        message:
          "Permission already assigned",
      },
      409,
    );
  }

  return c.json(result, 201);
});

app.delete(
  "/:roleId/:permissionId",
  async (c) => {
    const result =
      await service.removePermission(
        c.req.param("roleId"),
        c.req.param("permissionId"),
      );

    if (!result) {
      return c.json(
        {
          message:
            "Permission assignment not found",
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