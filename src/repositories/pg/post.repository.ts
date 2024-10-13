import { Post } from "@/entities/post.entity";
import { Repository } from "./default.repository";
import { User } from "@/entities/user.entity";
import { PoolClient } from "pg";
import { IPostRepository } from "../interfaces/post.repository.interface";

/**
 * Post repository
 */
export class PostRepository extends Repository<Post> implements IPostRepository {
  constructor(conn: PoolClient) {
    super(conn, "post", { unique_identifier: "id" });
  }

  /**
   * Create a new post
   * @param post Post 
   * @param user 
   * @returns Post
   */
  public async create(post: Post, user: User): Promise<Post> {
    const result = await this.connection.query(`INSERT INTO ${this.table} (title, content, created_by, created_at) VALUES ($1, $2, $3, CURRENT_DATE) RETURNING *`, [
      post.title,
      post.content,
      user.id,
    ]);

    return result.rows[0];
  }

  /**
   * Find all posts created by a user
   * @param createdBy 
   * @returns Array<Post>
   */
  public async findByCreatedBy(createdBy: number): Promise<Array<Post>> {
    const result = await this.connection.query(`SELECT * FROM ${this.table} WHERE created_by = $1 ORDER BY created_at DESC`, [createdBy]);

    return result.rows;
  }

  /**
   * Find a post by id
   * @param id 
   * @returns Post | null
   */
  public async findById(id: number): Promise<Post | null> {
    const result = await this.connection.query(`SELECT 
    p.*, 
    uc.name AS created_by_name, 
    uu.name AS updated_by_name
    FROM 
        ${this.table} p
    LEFT JOIN 
        "user" uc ON p.created_by = uc.id
    LEFT JOIN 
        "user" uu ON p.updated_by = uu.id WHERE p.id = $1`, [id]);

    if (result.rowCount === 0) return null;

    return result.rows[0];
  }

  /**
   * Find all posts
   * @returns Array<Post>
   */
  public async findAll(): Promise<Array<Post>> {
    const result = await this.connection.query(`SELECT 
    p.*, 
    uc.name AS created_by_name, 
    uu.name AS updated_by_name
    FROM 
        ${this.table} p
    LEFT JOIN 
        "user" uc ON p.created_by = uc.id
    LEFT JOIN 
        "user" uu ON p.updated_by = uu.id
    ORDER BY created_at DESC`);

    return result.rows;
  }


  /**
   * Find all posts by search
   * @param search 
   * @returns Array<Post>
   */
  public async findBySearch(search: string): Promise<Array<Post>> {
    const result = await this.connection.query(`SELECT 
    p.*, 
    uc.name AS created_by_name, 
    uu.name AS updated_by_name
    FROM 
        ${this.table} p
    LEFT JOIN 
        "user" uc ON p.created_by = uc.id
    LEFT JOIN 
        "user" uu ON p.updated_by = uu.id
    WHERE 
        p.title ILIKE $1 OR p.content ILIKE $1
    ORDER BY created_at DESC`, [`%${search}%`]);

    return result.rows;
  }

  /**
   * Update a post
   * @param post 
   * @param user 
   * @returns Post | null
   */
  public async update(post: Post, user: User): Promise<Post | null> {
    const result = await this.connection.query(
      `UPDATE ${this.table} SET title = $1, content = $2, updated_by = $3, updated_at = CURRENT_DATE WHERE id = $4 RETURNING *`,
      [post.title, post.content, user.id, post.id]
    );

    if (result.rowCount === 0) return null;

    return result.rows[0];
  }

  /**
   * Remove a post by id
   * @param id 
   * @returns boolean
   */
  public async remove(id: number): Promise<boolean> {
    const result = await this.connection.query(`DELETE FROM ${this.table} WHERE id = $1`, [id]);

    return result.rowCount === 1;
  }
}
