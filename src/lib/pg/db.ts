import { Pool, PoolClient } from "pg";
import { env } from "@/env";

const CONFIG = {
  user: env.DB_USER,
  host: env.DB_HOST,
  database: env.NODE_ENV === "test" ? env.DB_NAME_TEST : env.DB_NAME,
  password: env.DB_PASS,
  port: env.DB_PORT,
};

export class Database {
  private pool: Pool;
  private client: PoolClient | undefined;

  constructor() {
    this.pool = new Pool(CONFIG);
  }

  public async connection() {
    try {
      this.client = await this.pool.connect();
    } catch (error) {
      console.error(`Error connecting to the database: ${error}`);
      throw new Error(`Error connecting to the database: ${error}`);
    }
  }

  public async testConnection() {
    try {
      console.info("Testing connection to the database...");
      await this.client?.query("SELECT NOW()");
      console.info("Connection to the database was successful");
    } catch (error) {
      console.error(`Error testing connection to the database: ${error}`);
      throw new Error(`Error testing connection to the database: ${error}`);
    }
  }

  public async releaseConnection() {
    if (this.client) {
      this.client.release();
      this.client = undefined;
    }
  }

  public async closePool() {
    await this.pool.end();
  }

  get clientInstance(): PoolClient {
    if (!this.client) {
      throw new Error("Database client is not available.");
    }
    return this.client;
  }
}

export const database = new Database();
