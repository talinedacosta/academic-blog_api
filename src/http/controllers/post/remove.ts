import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { database } from "@/lib/pg/db";
import { User } from "@/entities/user.entity";
import { JwtPayload } from "jsonwebtoken";
import { RoleRepository } from "@/repositories/pg/role.repository";
import { CustomRequest } from "@/middlewares/auth";
import { PostRepository } from "@/repositories/pg/post.repository";
import { RemovePostUseCase } from "@/use-cases/posts/remove-post";

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Remove a post
 *     description: This endpoint allows a user with the role of 'teacher' to remove a post. Authorization token must be set in the request header.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []  # Assuming you are using bearer token for authorization
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the post to be removed.
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token for authorization (e.g., "Bearer your_token_here")
 *     responses:
 *       204:
 *         description: Post removed successfully
 *       400:
 *         description: Bad Request - Post not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Post not found"
 *       401:
 *         description: Unauthorized - User does not have permission to remove a post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
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

export async function remove(request: Request , response: Response, next: NextFunction) {
  try {
    const registerBodySchema = z.object({
      id: z.coerce.number(),
    });

    const { id } = registerBodySchema.parse(request.params);
    const token = (request as CustomRequest).token as JwtPayload;
    
    const user = { id: Number(token.id), role_id: token.role_id } as User;
    
    const roleRepository = new RoleRepository(database.clientInstance);
    const role = await roleRepository.findByIdentifier(user.role_id);
    
    if (!role || role.description !== 'teacher') {
      return response.status(401).json({ message: 'Unauthorized' });
    }
    
    const postRepository = new PostRepository(database.clientInstance);
    const removePostUseCase = new RemovePostUseCase(postRepository);

    const removed = await removePostUseCase.handler(id);

    if (!removed) {
      return response.status(400).json({ message: 'Post not found' });
    }

    return response.status(204).json();

  } catch (error) {
    next(error);
  }
}
