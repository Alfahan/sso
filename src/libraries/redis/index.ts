import { Redis } from 'ioredis';

export class RedisLibs {
	private redisClient: Redis;

	constructor(redisClient: Redis) {
		this.redisClient = redisClient;
	}

	// Set a key-value pair with an expiration time (TTL in seconds)
	async set(key: string, value: any, ttl?: number): Promise<void> {
		if (ttl) {
			await this.redisClient.set(key, value, 'EX', ttl); // Set with expiration
		} else {
			await this.redisClient.set(key, value); // Set without expiration
		}
	}

	// Get a value by key
	async get(key: string): Promise<string | null> {
		return await this.redisClient.get(key);
	}

	// Delete a key
	async del(key: string): Promise<number> {
		return await this.redisClient.del(key);
	}
}
