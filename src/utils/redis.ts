import { Redis } from "ioredis";
import dotenv from "dotenv";

dotenv.config();

/**
 * Returns Redis connection URL.
 * Throws an error if REDIS_URL is missing.
 * @returns {string}
 */

const redisClint = () => {
  const REDIS_URL = process.env.REDIS_URL as string;
  if (REDIS_URL) {
    console.log("Redis connected");
    return REDIS_URL;
  }
  throw new Error("REDIS_URL is missing");
};

export const redis = new Redis(redisClint());
