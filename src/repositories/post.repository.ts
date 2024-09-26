import { Post } from "@/entities/post.entity";
import { Repository } from "./default.repository";
import { User } from "@/entities/user.entity";
import { PoolClient } from "pg";

export class PostRepository extends Repository<Post> {
  constructor(conn: PoolClient) {
    super(conn, "post", { unique_identifier: "id" });
  }

  public async create(post: Post, user: User): Promise<Post> {
    const result = await this.connection.query(`INSERT INTO ${this.table} (title, content, created_by, created_at) VALUES ($1, $2, $3, CURRENT_DATE) RETURNING *`, [
      post.title,
      post.content,
      user.id,
    ]);

    return result.rows[0];
  }

  public async findByCreatedBy(createdBy: number): Promise<Array<Post>> {
    const result = await this.connection.query(`SELECT * FROM ${this.table} WHERE created_by = $1 ORDER BY created_at DESC`, [createdBy]);

    return result.rows;
  }

  public async findAll(): Promise<Array<Post>> {
    const result = await this.connection.query(`SELECT * FROM ${this.table} ORDER BY created_at DESC`);

    return result.rows;
  }

  public async update(post: Post, user: User): Promise<Post | null> {
    const result = await this.connection.query(`UPDATE ${this.table} SET title = $1, content = $2, updated_by = $3, updated_at = CURRENT_DATE WHERE id = $3 RETURNING *`, [
      post.title,
      post.content,
      post.id,
      user.id,
    ]);

    if (result.rowCount === 0) return null;

    return result.rows[0];
  }

  public async delete(id: number): Promise<boolean> {
    const result = await this.connection.query(`DELETE FROM ${this.table} WHERE id = $1`, [id]);

    return result.rowCount === 1;
  }
}
