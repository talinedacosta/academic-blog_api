import { database } from "@/lib/pg/db";

describe('Database Connection', () => {
  beforeAll(async () => {
    await database.connection();
    await database.testConnection();
  });

  afterAll(async () => {
    await database.releaseConnection();
    await database.closePool();
  });

  it('should connect to database', async () => {
    const result = await database.clientInstance.query('SELECT NOW()');
    expect(result).toBeDefined();
    expect(result.rows.length).toBe(1);
  });
});
