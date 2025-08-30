import rateLimit from "express-rate-limit";

interface RateLimiterOptions {
  windowMs?: number;
  max?: number;
}

const DEFAULT_WINDOW_MS =
  parseInt(process.env.RATE_LIMIT_WINDOW_MS as string) || 30 * 60 * 1000; // 30 minutes
const DEFAULT_MAX = parseInt(process.env.RATE_LIMIT_MAX as string) || 100; // 100 requests

const createRateLimitMessage = (windowMs: number) =>
  `Too many requests from this IP, please try again after ${
    windowMs / (1000 * 60)
  } minutes`;

const rateLimiter = (options: RateLimiterOptions = {}) => {
  const windowMs = options.windowMs ?? DEFAULT_WINDOW_MS;
  const max = options.max ?? DEFAULT_MAX;

  return rateLimit({
    windowMs,
    max,
    message: createRateLimitMessage(windowMs),
    ...options,
  });
};

export default rateLimiter;
