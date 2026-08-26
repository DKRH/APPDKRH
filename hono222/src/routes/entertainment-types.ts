import { Hono } from "hono";
import { hEntertainmentTrackerType } from "@dkrh/db/schema";
import * as audit  from "@/db/audit";

const app = new Hono();

app.get("/", async (c) => {
	return await audit.auditedList({
		c,
		table: hEntertainmentTrackerType,
		searchableColumns: [
			hEntertainmentTrackerType.name,
			hEntertainmentTrackerType.desc,
		],
	});
});

app.post("/", async (c) => {
	const body = await c.req.json();
	return await audit.auditedInsert(c, hEntertainmentTrackerType, {
		...body,
	});
});

app.put("/:id", async (c) => {
	const id = c.req.param("id");
	const body = await c.req.json();
	return await audit.auditedUpdate(c, hEntertainmentTrackerType, hEntertainmentTrackerType.id, id, {
		...body,
	});
});

app.delete("/:id", async (c) => {
	const id = c.req.param("id");
	return await audit.auditedDelete(c, hEntertainmentTrackerType, hEntertainmentTrackerType.id, id);
});

app.put("/:id/restore", async (c) => {
	const id = c.req.param("id");
	return await audit.auditedRestore(c, hEntertainmentTrackerType, hEntertainmentTrackerType.id, id);
});

app.delete("/:id/forever", async (c) => {
	const id = c.req.param("id");
	return await audit.auditedDeleteForever(c, hEntertainmentTrackerType, hEntertainmentTrackerType.id, id);
});

export default app;
