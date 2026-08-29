import { eq, asc } from "drizzle-orm";

import { db } from "@dkrh/db";
import { a1_role } from "@dkrh/db/schema";

export async function getRoles() {
  return db
    .select()
    .from(a1_role)
    .orderBy(asc(a1_role.name));
}

export async function getRoleById(id: string) {
  const [role] = await db
    .select()
    .from(a1_role)
    .where(eq(a1_role.id, id));

  return role ?? null;
}

export async function createRole(data: {
  code: string;
  name: string;
  description?: string;
}) {
  const [role] = await db
    .insert(a1_role)
    .values({
      code: data.code,
      name: data.name,
      description: data.description,
    })
    .returning();

  return role;
}

export async function updateRole(
  id: string,
  data: {
    code?: string;
    name?: string;
    description?: string | null;
    isActive?: boolean;
  },
) {
  const [role] = await db
    .update(a1_role)
    .set(data)
    .where(eq(a1_role.id, id))
    .returning();

  return role ?? null;
}

export async function deleteRole(id: string) {
  const [role] = await db
    .delete(a1_role)
    .where(eq(a1_role.id, id))
    .returning();

  return role ?? null;
}