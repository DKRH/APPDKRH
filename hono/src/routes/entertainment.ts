import { Hono } from "hono";
import { hEntertainmentTracker } from "@/db/schema";
import * as audit  from "@/db/audit";

const app = new Hono();

app.get("/", async (c) => {
	return await audit.auditedList({
		c,
		table: hEntertainmentTracker,
		searchableColumns: [
			hEntertainmentTracker.typeId,
			hEntertainmentTracker.entryTitle,
			hEntertainmentTracker.lastMark,
			hEntertainmentTracker.statusDL,
			hEntertainmentTracker.statusPublication,
			hEntertainmentTracker.linkDL,
		],
	});
});

app.post("/", async (c) => {
	const body = await c.req.json();
	return await audit.auditedInsert(c, hEntertainmentTracker, {
		...body,
	});
});

app.put("/:id", async (c) => {
	const id = c.req.param("id");
	const body = await c.req.json();
	return await audit.auditedUpdate(c, hEntertainmentTracker, hEntertainmentTracker.id, id, {
		...body,
	});
});

app.delete("/:id", async (c) => {
	const id = c.req.param("id");
	return await audit.auditedDelete(c, hEntertainmentTracker, hEntertainmentTracker.id, id);
});

app.put("/:id/restore", async (c) => {
	const id = c.req.param("id");
	return await audit.auditedRestore(c, hEntertainmentTracker, hEntertainmentTracker.id, id);
});

app.delete("/:id/forever", async (c) => {
	const id = c.req.param("id");
	return await audit.auditedDeleteForever(c, hEntertainmentTracker, hEntertainmentTracker.id, id);
});

export default app;
