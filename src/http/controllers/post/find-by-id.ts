import { NextFunction, Request, Response } from "express";
import { PostRepository } from "@/repositories/pg/post.repository";
import { database } from "@/lib/pg/db";
import { FindPostByIdUseCase } from "@/use-cases/posts/find-by-id";
import { z } from "zod";

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Retrieve a post by ID
 *     description: This endpoint retrieves a specific post based on its ID.
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the post to retrieve.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Post retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the post.
 *                   example: 1
 *                 title:
 *                   type: string
 *                   description: The title of the post.
 *                   example: "My First Post"
 *                 content:
 *                   type: string
 *                   description: The content of the post.
 *                   example: "This is the content of my first post."
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   description: The timestamp when the post was created.
 *                   example: "2023-10-13T12:34:56Z"
 *                 created_by:
 *                   type: integer
 *                   description: The ID of the user who created the post.
 *                   example: 1
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   description: The timestamp when the post was updated.
 *                   example: "2023-10-13T12:34:56Z"
 *                 updated_by:
 *                   type: integer
 *                   description: The ID of the user who last updated the post.
 *                   example: 1
 *                 created_by_name:
 *                   type: string
 *                   description: The name of the user who created the post.
 *                   example: "Jhon Doe"
 *                 updated_by_name:
 *                   type: string
 *                   description: The name of the user who created the post.
 *                   example: "Jhon Doe"
 *       404:
 *         description: Post not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Post not found"
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
export async function findById(request: Request, response: Response, next: NextFunction) {
  try {
    const registerBodySchema = z.object({
      id: z.coerce.number(),
    });

    const { id } = registerBodySchema.parse(request.params);

    const postRepository = new PostRepository(database.clientInstance);
    const findPostByIdUseCase = new FindPostByIdUseCase(postRepository);

    const result = await findPostByIdUseCase.handler(id);

    return response.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
