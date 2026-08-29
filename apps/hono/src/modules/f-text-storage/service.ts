import { fTextStorage } from "@dkrh/db/schema";

import * as audit from "@/db/audit";

import { type Context } from "hono";

import type {
  FTextStorage,
  NewFTextStorage,
  UpdateFTextStorage,
} from "@dkrh/types";

const table1 = fTextStorage;

export async function getAll(c: Context) {
  return await audit.auditedList({
    c,
    table: table1,
    searchableColumns: [
      table1.url,
      table1.content,
    ],
  });
}

export async function createData(c: Context) {
  const body = await c.req.json<NewFTextStorage>();

  return await audit.auditedInsert(
    c,
    table1,
    {
      ...body,
    },
  );
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

  const body = await c.req.json<
    Partial<NewFTextStorage>
  >();

  return await audit.auditedUpdate(
    c,
    table1,
    table1.id,
    id,
    {
      ...body,
    },
  );
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