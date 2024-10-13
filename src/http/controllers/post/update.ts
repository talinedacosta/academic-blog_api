import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { Post } from "@/entities/post.entity";
import { PostRepository } from "@/repositories/pg/post.repository";
import { database } from "@/lib/pg/db";
import { User } from "@/entities/user.entity";
import { RoleRepository } from "@/repositories/pg/role.repository";
import { CustomRequest } from "@/middlewares/auth";
import { JwtPayload } from "jsonwebtoken";
import { UpdatePostUseCase } from "@/use-cases/posts/update-post";

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Update a post
 *     description: This endpoint allows a user with the role of 'teacher' to update a post. Authorization token must be set in the request header.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []  # Assuming you are using bearer token for authorization
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the post to be updated.
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token for authorization (e.g., "Bearer your_token_here")
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The new title of the post.
 *                 example: "Updated Post Title"
 *               content:
 *                 type: string
 *                 description: The new content of the post.
 *                 example: "This is the updated content of the post."
 *     responses:
 *       200:
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the updated post.
 *                   example: 1
 *                 title:
 *                   type: string
 *                   description: The title of the updated post.
 *                   example: "Updated Post Title"
 *                 content:
 *                   type: string
 *                   description: The content of the updated post.
 *                   example: "This is the updated content of the post."
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   description: The timestamp when the post was updated.
 *                   example: "2023-10-13T12:34:56Z"
 *       401:
 *         description: Unauthorized - User does not have permission to update a post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       404:
 *         description: Not Found - Post not found
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

export async function update(request: Request, response: Response, next: NextFunction) {
  try {
    const registerBodySchema = z.object({
      title: z.string(),
      content: z.string(),
    });

    const registerParamsSchema = z.object({
      id: z.coerce.number(),
    });
  
    const { title, content } = registerBodySchema.parse(request.body);
    const { id } = registerParamsSchema.parse(request.params);

    const token = (request as CustomRequest).token as JwtPayload;    
    const user = { id: Number(token.id), role_id: token.role_id } as User;
    
    const roleRepository = new RoleRepository(database.clientInstance);
    const role = await roleRepository.findByIdentifier(user.role_id);
    
    if (!role || role.description !== 'teacher') {
      return response.status(401).json({ message: 'Unauthorized' });
    }

    const postRepository = new PostRepository(database.clientInstance);
   
    const findByIdentifier = await postRepository.findByIdentifier(id);
    
    if (!findByIdentifier) {
      return response.status(404).json({ message: 'Post not found' });
    }
   
    const updatePostUseCase = new UpdatePostUseCase(postRepository);
    
    const post = new Post(title, content);
    post.id = id;
    post.updated_at = new Date();
    post.updated_by = user.id;

   const result = await updatePostUseCase.handler(post, user);

    return response.status(201).json(result);

  } catch (error) {
    next(error);
  }
}
