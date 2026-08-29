import {
  dNotes,
  dLabels,
  dJNoteLabels,
} from "@dkrh/db/schema";

import * as audit from "@/db/audit";

import { db } from "@dkrh/db";

import {
  and,
  eq,
  isNull,
} from "drizzle-orm";

import { type Context } from "hono";

import type {
  DNotes,
  NewDNotes,
  UpdateDNotes,
  DNoteWithLabels,
  NewDNoteWithLabels,
  UpdateDNoteWithLabels,
} from "@dkrh/types";

const table1 = dNotes;

export async function getAll(c: Context) {
  return await audit.auditedList({
    c,
    table: table1,
    searchableColumns: [
      table1.title,
      table1.content,
    ],
  });
}

export async function getById(c: Context) {
  const id = c.req.param("id");

  if (!id) {
    return c.json(
      {
        message: "ID is required",
      },
      400,
    );
  }

  const [note] = await db
    .select()
    .from(table1)
    .where(
      and(
        eq(table1.id, id),
        isNull(table1.deletedAt),
      ),
    )
    .limit(1);

  if (!note) {
    return c.json(
      {
        message: "Note not found",
      },
      404,
    );
  }

  const labels = await db
    .select({
      id: dLabels.id,
      name: dLabels.name,
    })
    .from(dJNoteLabels)
    .innerJoin(
      dLabels,
      eq(
        dJNoteLabels.labelId,
        dLabels.id,
      ),
    )
    .where(
      and(
        eq(dJNoteLabels.noteId, id),
        isNull(dJNoteLabels.deletedAt),
        isNull(dLabels.deletedAt),
      ),
    );

  return c.json({
    ...note,
    labels,
  });
}

export async function createData(c: Context) {
  const body = await c.req.json<
    NewDNotes & {
      labelIds?: string[];
    }
  >();

  const {
    labelIds = [],
    ...noteData
  } = body;

  const note = await audit.auditedInsert(
    c,
    table1,
    {
      ...noteData,
    },
  );

  if (
    !note ||
    !Array.isArray(labelIds) ||
    labelIds.length === 0
  ) {
    return note;
  }

  const noteId = note.id;

  for (const labelId of labelIds) {
    await audit.auditedInsert(
      c,
      dJNoteLabels,
      {
        noteId,
        labelId,
      },
    );
  }

  return note;
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
    Partial<NewDNotes> & {
      labelIds?: string[];
    }
  >();

  const {
    labelIds,
    ...noteData
  } = body;

  const result = await audit.auditedUpdate(
    c,
    table1,
    table1.id,
    id,
    {
      ...noteData,
    },
  );

  if (Array.isArray(labelIds)) {
    const oldRelations = await db
      .select()
      .from(dJNoteLabels)
      .where(
        and(
          eq(
            dJNoteLabels.noteId,
            id,
          ),
          isNull(
            dJNoteLabels.deletedAt,
          ),
        ),
      );

    for (const relation of oldRelations) {
      await audit.auditedDelete(
        c,
        dJNoteLabels,
        dJNoteLabels.id,
        relation.id,
      );
    }

    for (const labelId of labelIds) {
      await audit.auditedInsert(
        c,
        dJNoteLabels,
        {
          noteId: id,
          labelId,
        },
      );
    }
  }

  return result;
}

export async function togglePinned(c: Context) {
  const id = c.req.param("id");

  if (!id) {
    return c.json(
      {
        message: "ID is required",
      },
      400,
    );
  }

  const body = await c.req.json<{
    isPinned: boolean;
  }>();

  return await audit.auditedUpdate(
    c,
    table1,
    table1.id,
    id,
    {
      isPinned: body.isPinned,
    },
  );
}

export async function toggleArchived(c: Context) {
  const id = c.req.param("id");

  if (!id) {
    return c.json(
      {
        message: "ID is required",
      },
      400,
    );
  }

  const body = await c.req.json<{
    isArchived: boolean;
  }>();

  return await audit.auditedUpdate(
    c,
    table1,
    table1.id,
    id,
    {
      isArchived: body.isArchived,
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