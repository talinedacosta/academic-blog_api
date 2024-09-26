import { PoolClient } from "pg";

export abstract class Repository<T> {
  protected unique_identifier?: string;

  constructor(protected connection: PoolClient, protected table: string, options?: { unique_identifier?: keyof T }) {
    this.unique_identifier = String(options?.unique_identifier);
  }

  async findById(unique_identifier?: string | number): Promise<T | null> {
    const result = await this.connection.query(`SELECT * FROM ${this.table} WHERE ${this.unique_identifier} = $1`, [unique_identifier]);

    if (result.rowCount === 0) return null;

    return result.rows[0];
  }
}