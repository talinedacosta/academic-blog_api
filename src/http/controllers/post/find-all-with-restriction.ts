import { NextFunction, Request, Response } from "express";
import { PostRepository } from "@/repositories/pg/post.repository";
import { database } from "@/lib/pg/db";
import { FindAllPostUseCase } from "@/use-cases/posts/find-all";
import { CustomRequest } from "@/middlewares/auth";
import { JwtPayload } from "jsonwebtoken";
import { User } from "@/entities/user.entity";
import { RoleRepository } from "@/repositories/pg/role.repository";

/**
 * @swagger
 * /posts/admin:
 *   get:
 *     summary: Get all posts with restriction
 *     description: This endpoint get all posts but only for teachers.
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
 *     responses:
 *       200:
 *         description: A list of posts retrieved successfully
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
 *                     example: "2023-10-13T12:34:56Z"
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
 *       401:
 *         description: Unauthorized - User does not have permission to retrieve all posts
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
export async function findAllWithRestriction(request: Request, response: Response, next: NextFunction) {
  try {
    const token = (request as CustomRequest).token as JwtPayload;
    
    const user = { id: Number(token.id), role_id: token.role_id } as User;
    
    const roleRepository = new RoleRepository(database.clientInstance);
    const role = await roleRepository.findByIdentifier(user.role_id);
    
    if (!role || role.description !== 'teacher') {
      return response.status(401).json({ message: 'Unauthorized' });
    }
            
    const postRepository = new PostRepository(database.clientInstance);
    const findAllPostUseCase = new FindAllPostUseCase(postRepository);  
   
   const result = await findAllPostUseCase.handler();

    return response.status(200).json(result);

  } catch (error) {
    next(error);
  }
}
