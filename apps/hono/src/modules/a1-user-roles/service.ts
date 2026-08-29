import { eq,and } from "drizzle-orm";

import { db } from "@dkrh/db";

import {
  a1_user_role,
  a1_role,
  a_user,
} from "@dkrh/db/schema";

export async function getUserRoles(
  userId: string,
) {
  return db
    .select({
      id: a1_user_role.id,

      roleId: a1_role.id,

      roleCode: a1_role.code,

      roleName: a1_role.name,

      roleDescription:
        a1_role.description,

      userId: a_user.id,

      userName: a_user.name,

      userEmail: a_user.email,
    })
    .from(a1_user_role)
    .innerJoin(
      a1_role,
      eq(
        a1_user_role.roleId,
        a1_role.id,
      ),
    )
    .innerJoin(
      a_user,
      eq(
        a1_user_role.userId,
        a_user.id,
      ),
    )
    .where(
      eq(
        a1_user_role.userId,
        userId,
      ),
    );
}

export async function assignRole(
  userId: string,
  roleId: string,
  createdBy?: string,
) {
  const [result] = await db
    .insert(a1_user_role)
    .values({
      userId,
      roleId,
      createdBy,
    })
    .onConflictDoNothing()
    .returning();

  return result ?? null;
}

export async function removeRole(
  userId: string,
  roleId: string,
) {
  const [result] = await db
    .delete(a1_user_role)
    .where(
      and(
        eq(
          a1_user_role.userId,
          userId,
        ),
        eq(
          a1_user_role.roleId,
          roleId,
        ),
      ),
    )
    .returning();

  return result ?? null;
}