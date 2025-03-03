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
   * Update user
   * @returns Array<User>
   */
  public async update({ name, email, password, role_id, id }: User): Promise<User | null> {
    const result = await this.connection.query(`UPDATE "${this.table}" SET name = $1, email = $3, password = $4, role_id = $5 WHERE id = $2 RETURNING *`, [name, id, email, password, role_id]);

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
   * Remove user
   * @returns Array<User>
   */
  public async remove(id: number): Promise<boolean> {
    const result = await this.connection.query(`DELETE FROM "${this.table}" WHERE id = $1`, [id]);

    return result.rowCount === 1;
  }

  /**
   * Find user by email
   * @returns Array<User>
   */
  public async findByEmail(email: string): Promise<User | null> {
    const result = await this.connection.query(`SELECT * FROM "${this.table}" WHERE email = $1`, [email]);

    if (result.rowCount === 0) return null;

    return result.rows[0];
  }

  /**
   * Find user by id
   * @returns Array<User>
   */
  public async findById(id: number): Promise<User | null> {
    const result = await this.connection.query(`SELECT * FROM "${this.table}" WHERE id = $1`, [id]);

    if (result.rowCount === 0) return null;

    return result.rows[0];
  }

   /**
   * Find all users
   * @returns Array<User>
   */
   public async findAll(): Promise<User[] | null> {
    const result = await this.connection.query(`SELECT name, email, id, role_id, created_at FROM "${this.table}"`);

    if (result.rowCount === 0) return null;

    return result.rows;
  }

  /**
   * Find all users by role
   * @returns Array<User>
   */
  public async findAllByRole(role: number): Promise<User[] | null> {
    const result = await this.connection.query(`SELECT name, email, id, role_id, created_at FROM "${this.table}" WHERE role_id = $1`, [role]);

    if (result.rowCount === 0) return null;

    return result.rows;
  }
}
