import { Hono } from "hono";
import weapon from "./routes/weapon";
import passbank from "./routes/passbank";

import entertainment from "./routes/entertainment";
import entertainmentTypes from "./routes/entertainment-types";

import iWeapon from "./routes/i-weapon";
import iWeaponCaliber from "./routes/i-weapon-caliber";
import iWeaponClass from "./routes/i-weapon-class";
import iWeaponOrigin from "./routes/i-weapon-origin";

export const protectedApi = new Hono();

protectedApi.route("/weapons", weapon);
protectedApi.route("/passbank", passbank);

protectedApi.route("/entertainment", entertainment);
protectedApi.route("/entertainment-types", entertainmentTypes);

protectedApi.route("/i-weapon", iWeapon);
protectedApi.route("/i-weapon-caliber", iWeaponCaliber);
protectedApi.route("/i-weapon-class", iWeaponClass);
protectedApi.route("/i-weapon-origin", iWeaponOrigin);