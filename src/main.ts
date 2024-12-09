import { Hono } from "hono";
import { logger } from "hono/logger";
import { CONFIG } from "./config.ts";
import { docsRouter } from "./routes/docs.tsx";
import { apiRouter } from "./routes/main.tsx";

const app = new Hono();
app.use("*", logger());

// Mount the docs router
app.route("/docs", docsRouter);
app.route("/api", apiRouter);

console.log(`CI Ninja server listening on port ${CONFIG.PORT}`);
Deno.serve({
  port: CONFIG.PORT,
}, app.fetch);