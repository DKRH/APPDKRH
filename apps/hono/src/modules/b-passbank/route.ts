import { Hono } from "hono";

import * as service from "./service";
import {
	createPassbankValidator,
	updatePassbankValidator,
} from "./validation";

const app = new Hono();

app.get(
	"/",
	service.getAll,
);

app.get(
	"/:id",
	service.getById,
);

app.post(
	"/",
	createPassbankValidator,
	service.createData,
);

app.put(
	"/:id",
	updatePassbankValidator,
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