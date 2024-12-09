import "jsr:@std/dotenv/load";
export const CONFIG = {
  PORT: Number(Deno.env.get("PORT") || 3001),
  LOG_SERVER_URL: Deno.env.get("LOG_SERVER_URL") || "http://localhost:3002",
  AUTHORIZED_IPS: Deno.env.get("AUTHORIZED_IPS")?.split(",") ||
    ["127.0.0.1", "localhost"],
  GITHUB_IPS: Deno.env.get("GITHUB_IPS")?.split(",") || [
    "207.97.227.253",
    "50.57.128.197",
    "204.232.175.75",
    "108.171.174.178",
  ],
  AUTHORIZED_SUBNETS: Deno.env.get("AUTHORIZED_SUBNETS")?.split(",") || [
    "192.30.252.0/22",
    "185.199.108.0/22",
    "140.82.112.0/20",
    "143.55.64.0/20",
  ],
} as const;