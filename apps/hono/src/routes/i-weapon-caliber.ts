import { Hono } from "hono";
import { iWeaponCalibers } from "@dkrh/db/schema";
import * as audit  from "@/db/audit";

const app = new Hono();
const table1 = iWeaponCalibers;

app.get("/", async (c) => {
    return await audit.auditedList({
        c,
        table: table1,
        searchableColumns: [
            table1.name,
            table1.desc,
        ],
    });
});

app.post("/", async (c) => {
    const body = await c.req.json();
    return await audit.auditedInsert(c, table1, {
        ...body,
    });
});

app.put("/:id", async (c) => {
    const id = c.req.param("id");
    const body = await c.req.json();
    return await audit.auditedUpdate(c, table1, table1.id, id, {
        ...body,
    });
});

app.delete("/:id", async (c) => {
    const id = c.req.param("id");
    return await audit.auditedDelete(c, table1, table1.id, id);
});

app.put("/:id/restore", async (c) => {
    const id = c.req.param("id");
    return await audit.auditedRestore(c, table1, table1.id, id);
});

app.delete("/:id/forever", async (c) => {
    const id = c.req.param("id");
    return await audit.auditedDeleteForever(c, table1, table1.id, id);
});

export default app;
