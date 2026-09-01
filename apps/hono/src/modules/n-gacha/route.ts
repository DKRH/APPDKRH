import { Hono } from "hono";

import * as service from "./service";

const app = new Hono();

/*
|--------------------------------------------------------------------------
| Banners
|--------------------------------------------------------------------------
*/

// GET /api/gacha/banners
app.get(
	"/banners",
	service.getBanners,
);

// GET /api/gacha/banners/:id
app.get(
	"/banners/:id",
	service.getBanner,
);

/*
|--------------------------------------------------------------------------
| Pull
|--------------------------------------------------------------------------
*/

// POST /api/gacha/banners/:id/pull
app.post(
	"/banners/:id/pull",
	service.pull,
);

/*
|--------------------------------------------------------------------------
| Current User
|--------------------------------------------------------------------------
*/

// GET /api/gacha/pity
app.get(
	"/pity",
	service.getPity,
);

// GET /api/gacha/history
app.get(
	"/history",
	service.getHistory,
);

export default app;