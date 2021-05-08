import { Injectable, Logger } from "@nestjs/common";
import redis from "redis";
import { promisify } from "util";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class RedisService {
  private logger: Logger = new Logger(RedisService.name);

  private readonly client: redis.RedisClient;
  private readonly zAddAsync;
  private readonly zRevRangeAsync;
  private readonly zScoreAsync;
  private readonly delAsync;
  private readonly setAsync;
  private readonly getAsync;
  private readonly expireAsync;

  constructor(private readonly configService: ConfigService) {
    this.client = redis.createClient({
      host: this.configService.get<string>("redis.endpoint"),
      port: this.configService.get<number>("redis.port"),
      password: this.configService.get<string>("redis.password"),
    });
    this.client.flushdb();
    this.zAddAsync = this.callbackToPromise(this.client.zadd);
    this.zRevRangeAsync = this.callbackToPromise(this.client.zrevrange);
    this.zScoreAsync = this.callbackToPromise(this.client.zscore);
    this.delAsync = this.callbackToPromise(this.client.del);
    this.setAsync = this.callbackToPromise(this.client.set);
    this.getAsync = this.callbackToPromise(this.client.get);
    this.expireAsync = this.callbackToPromise(this.client.expire);
  }

  private callbackToPromise(functionWithCallback) {
    return promisify(functionWithCallback).bind(this.client);
  }

  /**
   * Adds element to a sorted set
   * @param set name
   * @param key element value
   * @param score number
   */
  async zAdd(set: any, key: string, score: number): Promise<number> {
    this.logger.debug(`Adding element ${key}:${score} to sorted set ${set}`);
    return this.zAddAsync(set, score, key);
  }

  /**
   * Retrieve sorted set with scores
   * @param set name
   */
  async zRevRangeWithScores(set: string): Promise<string[]> {
    this.logger.debug(`Get all elements in sorted set ${set}`);
    return this.zRevRangeAsync(set, 0, -1, "withscores");
  }

  /**
   * Get score of member from sorted set
   * @param set
   * @param key
   */
  async zScore(set: string, key: string): Promise<number> {
    this.logger.debug(`Get member ${key} score from sorted set ${set}`);
    return this.zScoreAsync(set, key);
  }

  /**
   * Delete value referenced
   * @param key
   */
  async delete(key: string): Promise<number> {
    this.logger.debug(`Deleting value and key of ${key}`);
    return this.delAsync(key);
  }

  /**
   * Get value of key
   * @param key
   */
  async get(key: string): Promise<string> {
    this.logger.debug(`Get value of key ${key}`);
    return this.getAsync(key);
  }

  /**
   * Set value of key with optional expire
   * @param key
   * @param value
   * @param expire seconds to expiry, <0 for no expiry
   */
  async set(key: string, value: string, expire?: number): Promise<void> {
    this.logger.debug(
      `Set key ${key} with value ${value} and expire ${expire} seconds`
    );
    await this.setAsync(key, value);
    if (expire > 0) {
      this.expireAsync(key, expire);
    }
  }
}
