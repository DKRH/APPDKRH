import { eq, asc } from "drizzle-orm";

import { db } from "@dkrh/db";
import { a1_system } from "@dkrh/db/schema";

export async function getSystems() {
  return db
    .select()
    .from(a1_system)
    .orderBy(asc(a1_system.name));
}

export async function getSystemById(id: string) {
  const [system] = await db
    .select()
    .from(a1_system)
    .where(eq(a1_system.id, id));

  return system ?? null;
}

export async function createSystem(data: {
  code: string;
  name: string;
  description?: string;
}) {
  const [system] = await db
    .insert(a1_system)
    .values({
      code: data.code,
      name: data.name,
      description: data.description,
    })
    .returning();

  return system;
}

export async function updateSystem(
  id: string,
  data: {
    code?: string;
    name?: string;
    description?: string | null;
    isActive?: boolean;
  },
) {
  const [system] = await db
    .update(a1_system)
    .set(data)
    .where(eq(a1_system.id, id))
    .returning();

  return system ?? null;
}

export async function deleteSystem(id: string) {
  const [system] = await db
    .delete(a1_system)
    .where(eq(a1_system.id, id))
    .returning();

  return system ?? null;
}