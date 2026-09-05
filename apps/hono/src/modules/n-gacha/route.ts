import { Hono } from "hono";

import * as service from "./service";

const app = new Hono();

/*
|--------------------------------------------------------------------------
| Banners
|--------------------------------------------------------------------------
*/

app.get("/banners",service.getBanners);
app.get("/banners/:id",service.getBanner);

/*
|--------------------------------------------------------------------------
| Pull
|--------------------------------------------------------------------------
*/

app.post("/banners/:id/pull",service.pull);

/*
|--------------------------------------------------------------------------
| Current User
|--------------------------------------------------------------------------
*/

app.get("/pity/:id",service.getPity);
app.get("/history",service.getHistory);

export default app;