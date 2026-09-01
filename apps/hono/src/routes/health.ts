import { db,sql } from "@dkrh/db";
import { Hono } from "hono";

const app = new Hono();

app.get("/health", (c) => {
	return c.json({
		status: "ok",
	});
});

app.get("/health/db", async (c) => {
	try {
		await db.execute(sql`SELECT 1`);

		return c.json({
			status: "ok",
			database: "ok",
		});
	} catch {
		return c.json(
			{
				status: "error",
				database: "unavailable",
			},
			503,
		);
	}
});
export default app;