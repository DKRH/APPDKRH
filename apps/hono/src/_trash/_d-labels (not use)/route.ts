import { Hono } from "hono";

import * as service from "./service";

const app = new Hono();

app.get("/", service.getAll);

app.post("/", service.createData);

app.patch("/:id", service.editData);

app.delete("/:id", service.deleteData);

app.post("/:id/restore", service.restoreData,);

app.delete("/:id/forever", service.deleteDataForever,);

export default app;