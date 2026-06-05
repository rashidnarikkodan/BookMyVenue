import { injectable } from 'inversify';
import { Redis } from '@upstash/redis';
import env from '../configs/env.config';
import { IRedisService } from './interfaces/redis.service.interface';
import logger from '@/libs/logger';

@injectable()
export class RedisService implements IRedisService {
  private client: Redis;

  constructor() {
    this.client = new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    });

    logger.info('[Redis] Upstash Redis client initialized');
  }

  async get(key: string): Promise<string | null> {
    const val = await this.client.get<string | number>(key);
    return val !== null && val !== undefined ? String(val) : null;
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.client.set(key, value, { ex: ttlSeconds });
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async incr(key: string): Promise<number> {
    return this.client.incr(key);
  }

  async expire(key: string, ttlSeconds: number): Promise<void> {
    await this.client.expire(key, ttlSeconds);
  }

  async ttl(key: string): Promise<number> {
    return this.client.ttl(key);
  }
}
