import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { database } from "@/lib/pg/db";
import { User } from "@/entities/user.entity";
import { UserRepository } from "@/repositories/pg/user.repository";
import { RemoveUserUseCase } from "@/use-cases/users/remove-user";
import { JwtPayload } from "jsonwebtoken";
import { RoleRepository } from "@/repositories/pg/role.repository";
import { CustomRequest } from "@/middlewares/auth";

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Remove a user by ID
 *     description: This endpoint allows a user with the role of 'teacher' to remove a user by ID. Authorization token must be set in the request header.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []  # Assuming you are using bearer token for authorization
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user to be removed.
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token for authorization (e.g., "Bearer your_token_here")
 *     responses:
 *       204:
 *         description: User removed successfully
 *       401:
 *         description: Unauthorized - User does not have permission to remove a user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       400:
 *         description: Bad Request - User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
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
    
    const userRepository = new UserRepository(database.clientInstance);
    const removeUserUseCase = new RemoveUserUseCase(userRepository);

    const removed = await removeUserUseCase.handler(id);

    if (!removed) {
      return response.status(400).json({ message: 'User not found' });
    }

    return response.status(204).json();

  } catch (error) {
    next(error);
  }
}
