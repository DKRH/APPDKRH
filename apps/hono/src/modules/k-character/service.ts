import { kMCharacters } from "@dkrh/db/schema";
import * as audit from "@/db/audit";
import { type Context } from "hono";

const table1 = kMCharacters;

export async function getAll(c: Context) {
  return await audit.auditedList({
    c,
    table: table1,
    searchableColumns: [
			table1.name,
			table1.weaponId,
			table1.universeId,
			table1.attributeId,
    ],
  });
}

export async function createData(c: Context) {
  const body = await c.req.json();

  return await audit.auditedInsert(c, table1, {
    ...body,
  });
}

export async function editData(c: Context) {
  const id = c.req.param("id");

  if (!id) {
    return c.json(
      {
        message: "ID is required",
      },
      400,
    );
  }

  const body = await c.req.json();

  return await audit.auditedUpdate(c, table1, table1.id, id, {
    ...body,
  });
}

export async function deleteData(c: Context) {
  const id = c.req.param("id");

  if (!id) {
    return c.json(
      {
        message: "ID is required",
      },
      400,
    );
  }

  return await audit.auditedDelete(
    c,
    table1,
    table1.id,
    id,
  );
}
export async function restoreData(c: Context) {
  const id = c.req.param("id");

  if (!id) {
    return c.json(
      {
        message: "ID is required",
      },
      400,
    );
  }

  return await audit.auditedRestore(
    c,
    table1,
    table1.id,
    id,
  );
}
export async function deleteDataForever(c: Context) {
  const id = c.req.param("id");

  if (!id) {
    return c.json(
      {
        message: "ID is required",
      },
      400,
    );
  }

  return await audit.auditedDeleteForever(
    c,
    table1,
    table1.id,
    id,
  );
}