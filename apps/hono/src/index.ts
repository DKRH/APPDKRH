import app from "./app";

export default {
  port: Number(
    process.env.HONO_API_PORT ?? 2601,
  ),
  fetch: app.fetch,
};