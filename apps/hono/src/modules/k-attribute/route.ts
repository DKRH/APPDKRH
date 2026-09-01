import { Hono } from "hono";
import * as service from "./service";

const app = new Hono();

// GET all
app.get("/", service.getAll);

// POST create new
app.post("/", service.createData);

// Edit by ID
app.put("/:id", service.editData);

app.delete("/:id", service.deleteData);
app.put("/:id/restore", service.restoreData);
app.delete("/:id/forever", service.deleteDataForever);

export default app;
