import { Hono } from "hono";

const app = new Hono();

app.all("*", async (c) => {
    const url = new URL(c.req.url);

    const target =
        "http://localhost:8002" +
        url.pathname.replace("/api/erp", "") +
        url.search;

    return fetch(target, {
        method: c.req.method,
        headers: c.req.raw.headers,
        body:
            c.req.method === "GET" ||
            c.req.method === "HEAD"
                ? undefined
                : await c.req.raw.arrayBuffer(),
    });
});

export const erpProxy = app;