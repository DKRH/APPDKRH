import {
  eq,
  asc,
} from "drizzle-orm";

import { db } from "@dkrh/db";

import {
  a1_permission,
  a1_system,
} from "@dkrh/db/schema";

export async function getPermissions(
  systemId?: string,
) {
  return db
    .select({
      id: a1_permission.id,
      systemId: a1_permission.systemId,
      systemCode: a1_system.code,
      systemName: a1_system.name,
      code: a1_permission.code,
      name: a1_permission.name,
      description: a1_permission.description,
      isActive: a1_permission.isActive,
    })
    .from(a1_permission)
    .innerJoin(
      a1_system,
      eq(
        a1_permission.systemId,
        a1_system.id,
      ),
    )
    .where(
      systemId
        ? eq(a1_permission.systemId, systemId)
        : undefined,
    )
    .orderBy(
      asc(a1_system.name),
      asc(a1_permission.name),
    );
}

export async function createPermission(data: {
  systemId: string;
  code: string;
  name: string;
  description?: string;
}) {
  const [permission] = await db
    .insert(a1_permission)
    .values(data)
    .returning();

  return permission;
}

export async function updatePermission(
  id: string,
  data: {
    code?: string;
    name?: string;
    description?: string | null;
    isActive?: boolean;
  },
) {
  const [permission] = await db
    .update(a1_permission)
    .set(data)
    .where(eq(a1_permission.id, id))
    .returning();

  return permission ?? null;
}

export async function deletePermission(id: string) {
  const [permission] = await db
    .delete(a1_permission)
    .where(eq(a1_permission.id, id))
    .returning();

  return permission ?? null;
}