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

app.post(
	"/:id/reset-password",
	service.resetPassword,
);

export default app;