import { Hono } from "hono";
import QRCode from "qrcode";

const app = new Hono();

app.get("/generate", async (c) => {
  const ssid = c.req.query("ssid") ?? "";
  const password = c.req.query("password") ?? "";
  const security = c.req.query("security") ?? "WPA";
  const hidden = c.req.query("hidden") === "true";

  const payload =
    `WIFI:T:${security};S:${escapeWifi(ssid)};P:${escapeWifi(password)};H:${hidden};;`;

    const svg = await QRCode.toString(payload, {
    type: "svg",
    });

  c.header("Content-Type", "image/svg+xml");
  return c.body(svg);
});

function escapeWifi(text: string) {
  return text.replace(/([\\;,":])/g, "\\$1");
}

export default app;