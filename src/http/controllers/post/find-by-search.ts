import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { database } from "@/lib/pg/db";
import { PostRepository } from "@/repositories/pg/post.repository";
import { FindPostBySearchUseCase } from "@/use-cases/posts/find-by-search";

/**
 * @swagger
 * /posts/search:
 *   get:
 *     summary: Search for posts
 *     description: This endpoint allows you to search for posts based on a query string.
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: search
 *         required: true
 *         description: The search term to filter posts.
 *         schema:
 *           type: string
 *           example: "First Post"
 *     responses:
 *       200:
 *         description: Posts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The ID of the post.
 *                     example: 1
 *                   title:
 *                     type: string
 *                     description: The title of the post.
 *                     example: "My First Post"
 *                   content:
 *                     type: string
 *                     description: The content of the post.
 *                     example: "This is the content of my first post."
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     description: The timestamp when the post was created.
 *                     example: "2023-10-13T12:34:56Z"
 *                   created_by:
 *                     type: integer
 *                     description: The ID of the user who created the post.
 *                     example: 1
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *                     description: The timestamp when the post was updated.
 *                     example: 1
 *                   updated_by:
 *                     type: integer
 *                     description: The ID of the user who last updated the post.
 *                     example: 1
 *                   created_by_name:
 *                     type: string
 *                     description: The name of the user who created the post.
 *                     example: "Jhon Doe"
 *                   updated_by_name:
 *                     type: string
 *                     description: The name of the user who created the post.
 *                     example: "Jhon Doe"
 *       400:
 *         description: Invalid search query
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Search query must be at least 1 character long"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
export async function search(request: Request , response: Response, next: NextFunction) {
  try {
    const registerBodySchema = z.object({
      search: z.string().min(1),
    });

    const { search } = registerBodySchema.parse(request.query);
    console.log(request.query)
    const postRepository = new PostRepository(database.clientInstance);
    const findPostBySearchUseCase = new FindPostBySearchUseCase(postRepository);

    const posts = await findPostBySearchUseCase.handler(search);

    return response.status(200).json(posts);

  } catch (error) {
    next(error);
  }
}
