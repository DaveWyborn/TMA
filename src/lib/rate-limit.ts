import { Redis } from "@upstash/redis";
import { createHash } from "crypto";
import type { NextRequest } from "next/server";

export type Tier = "anon" | "free" | "paid";
export type ToolName =
  | "meta-checker"
  | "keyword-analyser"
  | "page-speed"
  | "robots-checker";

const LIMITS: Record<Tier, number | null> = {
  anon: 2,
  free: 10,
  paid: null,
};

const hasUpstash =
  !!process.env.UPSTASH_REDIS_REST_URL &&
  !!process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = hasUpstash ? Redis.fromEnv() : null;

// In-memory fallback for local dev before Upstash is provisioned.
// Resets on server restart; values lost between deploys — only safe for dev.
type MemEntry = { count: number; expiresAt: number };
const memStore = new Map<string, MemEntry>();

function secondsUntilMidnightUTC(now = new Date()): number {
  const next = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + 1,
      0,
      0,
      0,
      0
    )
  );
  return Math.max(1, Math.floor((next.getTime() - now.getTime()) / 1000));
}

function ipFromRequest(req: NextRequest | Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "0.0.0.0";
}

function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 16);
}

function todayUTC(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(
    2,
    "0"
  )}${String(d.getUTCDate()).padStart(2, "0")}`;
}

async function incrementMem(key: string, ttl: number): Promise<number> {
  const now = Date.now();
  const existing = memStore.get(key);
  if (existing && existing.expiresAt > now) {
    existing.count += 1;
    return existing.count;
  }
  memStore.set(key, { count: 1, expiresAt: now + ttl * 1000 });
  return 1;
}

async function incrementRedis(key: string, ttl: number): Promise<number> {
  const count = await redis!.incr(key);
  if (count === 1) {
    await redis!.expire(key, ttl);
  }
  return count;
}

export interface RateLimitResult {
  ok: boolean;
  limit: number | null;
  remaining: number | null;
  tier: Tier;
  resetSeconds: number;
}

export async function checkAndIncrement(
  req: NextRequest | Request,
  tool: ToolName,
  tier: Tier,
  userId: string | null
): Promise<RateLimitResult> {
  const limit = LIMITS[tier];

  if (limit === null) {
    return {
      ok: true,
      limit: null,
      remaining: null,
      tier,
      resetSeconds: 0,
    };
  }

  const identity =
    tier === "anon" ? `ip:${hashIp(ipFromRequest(req))}` : `u:${userId}`;
  const key = `rl:${todayUTC()}:${tool}:${identity}`;
  const ttl = secondsUntilMidnightUTC();

  const count = redis
    ? await incrementRedis(key, ttl)
    : await incrementMem(key, ttl);

  const ok = count <= limit;
  const remaining = Math.max(0, limit - count);

  return { ok, limit, remaining, tier, resetSeconds: ttl };
}

export async function peekRemaining(
  req: NextRequest | Request,
  tool: ToolName,
  tier: Tier,
  userId: string | null
): Promise<{ limit: number | null; remaining: number | null }> {
  const limit = LIMITS[tier];
  if (limit === null) return { limit: null, remaining: null };

  const identity =
    tier === "anon" ? `ip:${hashIp(ipFromRequest(req))}` : `u:${userId}`;
  const key = `rl:${todayUTC()}:${tool}:${identity}`;

  let count = 0;
  if (redis) {
    const raw = await redis.get<number>(key);
    count = raw ?? 0;
  } else {
    const entry = memStore.get(key);
    if (entry && entry.expiresAt > Date.now()) count = entry.count;
  }
  return { limit, remaining: Math.max(0, limit - count) };
}
