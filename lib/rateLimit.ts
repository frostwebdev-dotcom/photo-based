/**
 * Best-effort in-memory rate limiter.
 * LIMITATION: On Vercel serverless, each function instance has its own memory.
 * Rate limits may not be shared across instances. For production-scale rate limiting,
 * consider using Vercel KV, Redis, or an external service.
 */

const store = new Map<string, { count: number; resetAt: number }>();

const LIMIT = 10;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: LIMIT - 1 };
  }

  if (now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: LIMIT - 1 };
  }

  if (entry.count >= LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: LIMIT - entry.count };
}
