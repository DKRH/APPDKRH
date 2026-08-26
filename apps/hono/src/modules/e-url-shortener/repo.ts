import { eq } from "drizzle-orm";
import { db } from "@dkrh/db";
import { eUrlShortener } from "@dkrh/db/schema";

const table1 = eUrlShortener;

export async function findByID(id: string) {
  const [url] = await db
    .select({
      id: table1.id,
      isLocked: table1.isLocked,
    })
    .from(table1)
    .where(eq(table1.id, id));

  return url;
}

export async function updateLock(
  id: string,
  isLocked: boolean,
) {
  const [updated] = await db
    .update(table1)
    .set({
      isLocked,
    })
    .where(eq(table1.id, id))
    .returning();

  return updated;
}