import {
  eq,
  and,
} from "drizzle-orm";

import { db } from "@dkrh/db";

import {
  a1_user_role,
  a1_role_permission,
  a1_permission,
  a1_system,
} from "@dkrh/db/schema";

export async function hasPermission(
  userId: string,
  systemCode: string,
  permissionCode: string,
) {
  const [result] = await db
    .select({
      permissionId:
        a1_permission.id,
    })
    .from(a1_user_role)
    .innerJoin(
      a1_role_permission,
      eq(
        a1_user_role.roleId,
        a1_role_permission.roleId,
      ),
    )
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
      and(
        eq(
          a1_user_role.userId,
          userId,
        ),

        eq(
          a1_system.code,
          systemCode,
        ),

        eq(
          a1_permission.code,
          permissionCode,
        ),

        eq(
          a1_permission.isActive,
          true,
        ),

        eq(
          a1_system.isActive,
          true,
        ),
      ),
    )
    .limit(1);

  return !!result;
}