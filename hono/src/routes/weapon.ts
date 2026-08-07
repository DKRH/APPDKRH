import { Hono } from "hono";
import { c_weapons } from "@/db/schema";
import * as audit from "@/db/audit";

const app = new Hono();

app.get("/", async (c) => {
	return await audit.auditedList({
		c,
		table: c_weapons,
		searchableColumns: [
			c_weapons.printname,
			c_weapons.classname,
			c_weapons.group,
		],
	});
});

app.post("/", async (c) => {
	const body = await c.req.json();
	return await audit.auditedInsert(c, c_weapons, {
		...body,
	});
});

app.put("/:id", async (c) => {
	const id = c.req.param("id");
	const body = await c.req.json();
	return await audit.auditedUpdate(c, c_weapons, c_weapons.id, id, {
		...body,
	});
});

app.delete("/:id", async (c) => {
	const id = c.req.param("id");
	return await audit.auditedDelete(c, c_weapons, c_weapons.id, id);
});

app.put("/:id/restore", async (c) => {
	const id = c.req.param("id");
	return await audit.auditedRestore(c, c_weapons, c_weapons.id, id);
});

app.delete("/:id/forever", async (c) => {
	const id = c.req.param("id");
	return await audit.auditedDeleteForever(c, c_weapons, c_weapons.id, id);
});

export default app;