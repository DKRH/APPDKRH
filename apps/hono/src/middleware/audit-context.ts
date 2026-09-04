import { randomUUID } from "node:crypto";
import type { Context, Next } from "hono";

import {
	runAuditContext,
} from "@dkrh/db/audit/context";

export async function auditContext(
	c: Context,
	next: Next,
) {
	const forwarded =
		c.req.header("x-forwarded-for");

	const context = {
		userId: c.get("userId"),

		ipAddress:
			forwarded?.split(",")[0]?.trim()
			?? c.req.header("x-real-ip"),

		userAgent:
			c.req.header("user-agent"),

		requestId:
			c.req.header("x-request-id")
			?? randomUUID(),

		method: c.req.method,

		path: c.req.path,
	};

	//console.log("AUDIT CONTEXT:", context);
	//console.log("c:", c);

	return runAuditContext(
		context,
		next,
	);
}