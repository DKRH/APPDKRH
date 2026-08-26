import { eUrlShortener } from "@dkrh/db/schema";
import * as audit from "@/db/audit";
import { type Context } from "hono";
import * as repo from "./repo";

const table1 = eUrlShortener;

export async function getAll(c: Context) {
  return await audit.auditedList({
    c,
    table: table1,
    searchableColumns: [
      table1.originalURL,
      table1.shortenURL,
      table1.isLocked,
      table1.password,
      table1.expireDateUTC,
    ],
  });
}

function generateShortCode(length = 7) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  const values = crypto.getRandomValues(
    new Uint32Array(length),
  );

  return Array.from(
    values,
    (value) => chars[value % chars.length],
  ).join("");
}
export async function createData(c: Context) {
  const body = await c.req.json();

  const shortCode = generateShortCode();

  return await audit.auditedInsert(c, table1, {
    originalURL: body.originalURL,
    shortenURL: shortCode,
    password: body.password ?? null,
    expireDateUTC: body.expireDateUTC
      ? new Date(body.expireDateUTC)
      : null,
    isLocked: false,
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

  return await audit.auditedUpdate(
    c,
    table1,
    table1.id,
    id,
    {
      originalURL: body.originalURL,
      password: body.password ?? null,
      expireDateUTC: body.expireDateUTC
        ? new Date(body.expireDateUTC)
        : null,
      isLocked: body.isLocked ?? false,
    },
  );
}
export async function changeLock(c: Context) {
  const id = c.req.param("id");

  if (!id) {
    return c.json(
      {
        message: "ID is required",
      },
      400,
    );
  }

  const url = await repo.findByID(id);

  if (!url) {
    return c.json(
      {
        message: "Short URL not found",
      },
      404,
    );
  }

  const newLockedState = !url.isLocked;

  const updated = await repo.updateLock(
    id,
    newLockedState,
  );

  return c.json({
    message: newLockedState
      ? "Short URL locked"
      : "Short URL unlocked",

    data: updated,
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