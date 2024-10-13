import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { Post } from "@/entities/post.entity";
import { PostRepository } from "@/repositories/pg/post.repository";
import { CreatePostUseCase } from "@/use-cases/posts/create-post";
import { database } from "@/lib/pg/db";
import { User } from "@/entities/user.entity";
import { CustomRequest } from "@/middlewares/auth";
import { JwtPayload } from "jsonwebtoken";
import { RoleRepository } from "@/repositories/pg/role.repository";

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a post
 *     description: This endpoint allows a user with the role of 'teacher' to create a new post. Authorization token must be set in the request header.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []  # Assuming you are using bearer token for authorization
 *     parameters:
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
 *                 description: The title of the post.
 *                 example: "My First Post"
 *               content:
 *                 type: string
 *                 description: The content of the post.
 *                 example: "This is the content of my first post."
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the created post.
 *                   example: 1
 *                 title:
 *                   type: string
 *                   description: The title of the created post.
 *                   example: "My First Post"
 *                 content:
 *                   type: string
 *                   description: The content of the created post.
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
 *                   example: null
 *                 updated_by:
 *                   type: integer
 *                   description: The ID of the user who last updated the post.
 *                   example: null
 *       401:
 *         description: Unauthorized - User does not have permission to create a post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       400:
 *         description: Bad Request - Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation error"
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
export async function create(request: Request, response: Response, next: NextFunction) {
  try {
    const registerBodySchema = z.object({
      title: z.string(),
      content: z.string(),
    });
  
    const { title, content } = registerBodySchema.parse(request.body);

    const token = (request as CustomRequest).token as JwtPayload;    
    const user = { id: Number(token.id), role_id: token.role_id } as User;
    
    const roleRepository = new RoleRepository(database.clientInstance);
    const role = await roleRepository.findByIdentifier(user.role_id);
    
    if (!role || role.description !== 'teacher') {
      return response.status(401).json({ message: 'Unauthorized' });
    }

    const postRepository = new PostRepository(database.clientInstance);
    const createPostUseCase = new CreatePostUseCase(postRepository);

    const post = new Post(title, content);
    post.created_at = new Date();    

   const result = await createPostUseCase.handler(post, user);

    return response.status(201).json(result);

  } catch (error) {
    next(error);
  }
}
