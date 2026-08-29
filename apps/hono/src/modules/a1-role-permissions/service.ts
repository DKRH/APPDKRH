import {
  eq,
  and,
} from "drizzle-orm";

import { db } from "@dkrh/db";

import {
  a1_role_permission,
  a1_permission,
  a1_system,
} from "@dkrh/db/schema";

export async function getRolePermissions(
  roleId: string,
) {
  return db
    .select({
      id: a1_role_permission.id,

      permissionId:
        a1_permission.id,

      permissionCode:
        a1_permission.code,

      permissionName:
        a1_permission.name,

      systemId:
        a1_system.id,

      systemCode:
        a1_system.code,

      systemName:
        a1_system.name,
    })
    .from(a1_role_permission)
    .innerJoin(
      a1_permission,
      eq(
        a1_role_permission.permissionId,
        a1_permission.id,
      ),
    )
    .innerJoin(
      a1_system,
      eq(
        a1_permission.systemId,
        a1_system.id,
      ),
    )
    .where(
      eq(
        a1_role_permission.roleId,
        roleId,
      ),
    );
}

export async function assignPermission(
  roleId: string,
  permissionId: string,
) {
  const [result] = await db
    .insert(a1_role_permission)
    .values({
      roleId,
      permissionId,
    })
    .onConflictDoNothing()
    .returning();

  return result ?? null;
}

export async function removePermission(
  roleId: string,
  permissionId: string,
) {
  const [result] = await db
    .delete(a1_role_permission)
    .where(
      and(
        eq(
          a1_role_permission.roleId,
          roleId,
        ),
        eq(
          a1_role_permission.permissionId,
          permissionId,
        ),
      ),
    )
    .returning();

  return result ?? null;
}