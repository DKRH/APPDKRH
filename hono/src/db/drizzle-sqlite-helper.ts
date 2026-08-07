import {
	sqliteTable,
	text,
	integer,
	real,
  	index,
} from "drizzle-orm/sqlite-core";
import { randomUUID, } from "crypto";

export function timestamp(name: string) {
    return integer(name, { mode: "timestamp" });
}
export function boolean(name: string) {
    return integer(name, { mode: "boolean" });
}
export function uuidkey(name: string) {
    return text(name).primaryKey().$defaultFn(() => randomUUID());
}
export function uuid(name: string) {
    return text(name);
}
export function varchar(name: string, options?: { length: number }) {
    return text(name);
}
export function decimal(name: string, options?: { precision: number, scale: number }) {
    return real(name);
}