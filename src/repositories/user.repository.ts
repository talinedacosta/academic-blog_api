import { User } from "@/entities/user.entity";
import { Repository } from "./default.repository";
import { PoolClient } from "pg";

export class UserRepository extends Repository<User> {
  constructor(conn: PoolClient) {
    super(conn, "user", { unique_identifier: "id" });
  }

  public async create(user: User): Promise<User> {
    const result = await this.connection.query(`INSERT INTO "${this.table}" (name, email, password, role_id) VALUES ($1, $2, $3, $4) RETURNING *`, [
      user.name,
      user.email,
      user.password,
      user.role_id,
    ]);

    return result.rows[0];
  }

  public async update({ name, id }: User): Promise<User | null> {
    const result = await this.connection.query(`UPDATE "${this.table}" SET name = $1 WHERE id = $2 RETURNING *`, [name, id]);

    if (result.rowCount === 0) return null;

    return result.rows[0];
  }

  public async updatePassword({ password, id }: User): Promise<User | null> {
    const result = await this.connection.query(`UPDATE "${this.table}" SET password = $1 WHERE id = $2 RETURNING *`, [password, id]);

    if (result.rowCount === 0) return null;

    return result.rows[0];
  }

  public async delete(id: number): Promise<boolean> {
    const result = await this.connection.query(`DELETE FROM "${this.table}" WHERE id = $1`, [id]);

    return result.rowCount === 1;
  }
}
