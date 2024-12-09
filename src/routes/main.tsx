import { isAuthorizedIP } from "../utils/ip.ts";
import { executeScript } from "../utils/script.ts";
import type { GithubPayload } from "../types.ts";
import { getConnInfo } from "hono/deno";
import { join } from "jsr:@std/path";
import { Hono } from "hono";

export const apiRouter = new Hono();

apiRouter.get("/", (c) => {
  return c.json({ status: "ok", name: "Deno CI", docs: "/docs" });
});

apiRouter.post("/webhook", async (c) => {
  const payload = await c.req.json<GithubPayload>().catch(() => null);

  if (!payload) {
    c.status(400);
    return c.json({ error: "No payload" });
  }

  const info = getConnInfo(c);
  const ip = info.remote.address;

  if (!isAuthorizedIP(ip)) {
    c.status(403);
    return c.json({ error: "Unauthorized IP" });
  }

  const ref = payload.ref;
  const branch = ref?.split("/")?.[2] || payload.repository.default_branch;
  const scriptPath = `./scripts/${payload.repository.name}-${
    branch || "main"
  }.sh`;
  const fullPath = join(Deno.cwd(), scriptPath);

  try {
    const fileInfo = await Deno.stat(fullPath);
    if (!fileInfo.isFile) {
      c.status(404);
      return c.json({ error: "Script not found" });
    }
  } catch {
    c.status(404);
    return c.json({ error: "Script not found" });
  }

  console.log(`Executing task at: ${scriptPath}`);

  try {
    await executeScript(fullPath, Deno.cwd(), {
      user: payload.sender.login,
      repository: payload.repository.name,
      url: payload.repository.svn_url,
    });
    return c.json({ success: true });
  } catch (error) {
    console.error(error);
    c.status(500);
    return c.json({ error: error });
  }
});
