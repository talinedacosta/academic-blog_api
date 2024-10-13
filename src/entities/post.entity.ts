/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier for the post.
 *         title:
 *           type: string
 *           description: The title of the post.
 *         content:
 *           type: string
 *           description: The content of the post.
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date when the post was created.
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The date when the post was last updated.
 *         created_by:
 *           type: integer
 *           description: The ID of the user who created the post.
 *         updated_by:
 *           type: integer
 *           description: The ID of the user who last updated the post.
 *         created_by_name:
 *           type: string
 *           description: The name of the user who created the post.
 *         updated_by_name:
 *           type: string
 *           description: The name of the user who last updated the post.
 *       required:
 *         - title
 *         - content
 */
export class Post {
  id?: number;
  title: string;
  content: string;
  created_at?: Date;
  updated_at?: Date;
  created_by?: number;
  updated_by?: number;
  created_by_name?: string;
  updated_by_name?: string;

  constructor(title: string, content: string) {
    this.title = title;
    this.content = content;
  }
}
