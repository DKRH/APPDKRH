import { AsyncLocalStorage } from "node:async_hooks";

export interface AuditContext {
	userId: string;
	ipAddress?: string;
	userAgent?: string;
	requestId?: string;
	method?: string;
	path?: string;
}

const storage =
	new AsyncLocalStorage<AuditContext>();

export function runAuditContext<T>(
	context: AuditContext,
	callback: () => T,
): T {
	return storage.run(context, callback);
}

export function getAuditContext() {
	const context = storage.getStore();

	if (!context) {
		throw new Error("Unauthorized");
	}

	return context;
}