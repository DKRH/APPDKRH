import { Hono } from "hono";
import weapon from "./routes/weapon";
import passbank from "./routes/passbank";
import entertainment from "./routes/entertainment";
import entertainmentTypes from "./routes/entertainment-types";

export const protectedApi = new Hono();

protectedApi.route("/weapons", weapon);
protectedApi.route("/passbank", passbank);
protectedApi.route("/entertainment", entertainment);
protectedApi.route("/entertainment-types", entertainmentTypes);
