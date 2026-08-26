/*import { Hono } from "hono";
import products from "./modules/products/route";

const api = new Hono().route(
	"/api",
	new Hono().route("/products", products),
);

export type AppType = typeof api;*/

export type { AppType } from "./app";