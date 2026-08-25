import { Hono } from "hono";

//import { authProxy } from "../proxy/auth";
import { erpProxy } from "@/proxy/erp";
//import { aiProxy } from "../proxy/ai";
//import { msProxy } from "../proxy/ms";

export const protectedApi = new Hono();

//api.route("/auth", authProxy);
protectedApi.route("/erp", erpProxy);
//api.route("/ai", aiProxy);
//api.route("/ms", msProxy);