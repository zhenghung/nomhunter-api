import { Injectable, Logger } from "@nestjs/common";
import redis from "redis";
import { promisify } from "util";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class RedisService {
  private logger: Logger = new Logger(RedisService.name);

  private readonly redisClient: redis.RedisClient;
  private readonly zAddAsync;
  private readonly zRevRangeAsync;
  private readonly delAsync;

  constructor(private readonly configService: ConfigService) {
    this.redisClient = redis.createClient({
      host: this.configService.get<string>("redis.endpoint"),
      port: this.configService.get<number>("redis.port"),
      password: this.configService.get<string>("redis.password"),
    });
    this.zAddAsync = promisify(this.redisClient.zadd).bind(this.redisClient);
    this.zRevRangeAsync = promisify(this.redisClient.zrevrange).bind(
      this.redisClient
    );
    this.delAsync = promisify(this.redisClient.del).bind(this.redisClient);
  }

  /**
   * Adds element to a sorted set
   * @param set name
   * @param key element value
   * @param score number
   */
  async zAdd(set: any, key: string, score: number): Promise<number> {
    this.logger.log(`Adding element ${key}:${score} to sorted set ${set}`);
    return this.zAddAsync(set, score, key);
  }

  /**
   * Retrieve sorted set with scores
   * @param set name
   */
  async zRevRangeWithScores(set: string): Promise<string[]> {
    this.logger.log(`Get all elements in sorted set ${set}`);
    return this.zRevRangeAsync(set, 0, -1, "withscores");
  }

  /**
   * Delete value referenced
   * @param key
   */
  async delete(key: string): Promise<number> {
    return this.delAsync(key);
  }
}
