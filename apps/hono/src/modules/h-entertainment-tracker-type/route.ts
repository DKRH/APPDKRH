import { Hono } from "hono";

import * as service from "./service";

const app = new Hono();

app.get(
	"/",
	service.getAll,
);

app.post(
	"/",
	service.createData,
);

app.put(
	"/:id",
	service.editData,
);

app.delete(
	"/:id",
	service.deleteData,
);

app.put(
	"/:id/restore",
	service.restoreData,
);

app.delete(
	"/:id/forever",
	service.deleteDataForever,
);

export default app;