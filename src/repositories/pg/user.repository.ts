import { User } from "@/entities/user.entity";
import { Repository } from "./default.repository";
import { PoolClient } from "pg";
import { IUserRepository } from "../interfaces/user.repository.interface";

/**
 * User repository
 */
export class UserRepository extends Repository<User> implements IUserRepository {
  constructor(conn: PoolClient) {
    super(conn, "user", { unique_identifier: "id" });
  }

  /**
   * Create a new user
   * @param user 
   * @returns User
   */
  public async create(user: User): Promise<User> {
    const result = await this.connection.query(`INSERT INTO "${this.table}" (name, email, password, role_id) VALUES ($1, $2, $3, $4) RETURNING *`, [
      user.name,
      user.email,
      user.password,
      user.role_id,
    ]);

    return result.rows[0];
  }

  /**
   * Find all users
   * @returns Array<User>
   */
  public async update({ name, id }: User): Promise<User | null> {
    const result = await this.connection.query(`UPDATE "${this.table}" SET name = $1 WHERE id = $2 RETURNING *`, [name, id]);

    if (result.rowCount === 0) return null;

    return result.rows[0];
  }

  /**
   * Update user password
   * @param user 
   * @returns User | null
   */
  public async updatePassword({ password, id }: User): Promise<User | null> {
    const result = await this.connection.query(`UPDATE "${this.table}" SET password = $1 WHERE id = $2 RETURNING *`, [password, id]);

    if (result.rowCount === 0) return null;

    return result.rows[0];
  }

  /**
   * Find all users
   * @returns Array<User>
   */
  public async remove(id: number): Promise<boolean> {
    const result = await this.connection.query(`DELETE FROM "${this.table}" WHERE id = $1`, [id]);

    return result.rowCount === 1;
  }

  /**
   * Find all users
   * @returns Array<User>
   */
  public async findByEmail(email: string): Promise<User | null> {
    const result = await this.connection.query(`SELECT * FROM "${this.table}" WHERE email = $1`, [email]);

    if (result.rowCount === 0) return null;

    return result.rows[0];
  }

  /**
   * Find all users
   * @returns Array<User>
   */
  public async findById(id: number): Promise<User | null> {
    const result = await this.connection.query(`SELECT * FROM "${this.table}" WHERE id = $1`, [id]);

    if (result.rowCount === 0) return null;

    return result.rows[0];
  }
}
