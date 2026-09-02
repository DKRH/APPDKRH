import { Hono } from "hono";

import * as service from "./service";

const app = new Hono();


// ============================================================
// LABELS
// ============================================================

app.get("/labels", service.getLabels);
app.post("/labels", service.createLabel);
app.patch("/labels/:id", service.updateLabel);
app.delete("/labels/:id", service.deleteLabel);

// ============================================================
// NOTES
// ============================================================

app.get("/", service.getAll);
app.post("/", service.createData);

app.get("/:id", service.getOne);
app.patch("/:id", service.editData);

app.patch("/:id/pin", service.togglePin);
app.patch("/:id/archive", service.toggleArchive);
app.patch("/:id/restore", service.restore);

app.delete("/:id", service.deleteData);
app.delete("/:id/permanent", service.deleteForever);



// ============================================================
// NOTE <-> LABEL
// ============================================================

app.get(
	"/:id/labels",
	service.getNoteLabels,
);

app.post(
	"/:id/labels",
	service.addLabel,
);

app.delete(
	"/:id/labels",
	service.removeLabel,
);

export default app;