import { Hono } from "hono";
import { b_passbank } from "@dkrh/db/schema";
import * as audit  from "@/db/audit";

const app = new Hono();

app.get("/", async (c) => {
	return await audit.auditedList({
		c,
		table: b_passbank,
		searchableColumns: [
			b_passbank.title,
			b_passbank.username,
			b_passbank.note,
		],
	});
});

app.post("/", async (c) => {
	const body = await c.req.json();
	return await audit.auditedInsert(c, b_passbank, {
		...body,
	});
});

app.put("/:id", async (c) => {
	const id = c.req.param("id");
	const body = await c.req.json();
	return await audit.auditedUpdate(c, b_passbank, b_passbank.id, id, {
		...body,
	});
});

app.delete("/:id", async (c) => {
	const id = c.req.param("id");
	return await audit.auditedDelete(c, b_passbank, b_passbank.id, id);
});

app.put("/:id/restore", async (c) => {
	const id = c.req.param("id");
	return await audit.auditedRestore(c, b_passbank, b_passbank.id, id);
});

app.delete("/:id/forever", async (c) => {
	const id = c.req.param("id");
	return await audit.auditedDeleteForever(c, b_passbank, b_passbank.id, id);
});

export default app;
