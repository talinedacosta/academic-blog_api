import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { database } from "@/lib/pg/db";
import { UserRepository } from "@/repositories/pg/user.repository";
import { FindUserByIdUseCase } from "@/use-cases/users/find-user-by-id";
import { CustomRequest } from "@/middlewares/auth";
import { JwtPayload } from "jsonwebtoken";
import { User } from "@/entities/user.entity";
import { RoleRepository } from "@/repositories/pg/role.repository";

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: This endpoint allows a user with the role of 'teacher' to retrieve user details by ID. Authorization token must be set in the request header.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []  # Assuming you are using bearer token for authorization
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user to be retrieved.
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token for authorization (e.g., "Bearer your_token_here")
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the user.
 *                   example: 1
 *                 name:
 *                   type: string
 *                   description: The name of the user.
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   description: The email of the user.
 *                   example: "john.doe@example.com"
 *                 role_id:
 *                   type: integer
 *                   description: The role ID associated with the user.
 *                   example: 2
 *       401:
 *         description: Unauthorized - User does not have permission to view user details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       404:
 *         description: Not Found - User not found
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

export async function findById(request: Request, response: Response, next: NextFunction) {
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
    const findUserByIdUseCase = new FindUserByIdUseCase(userRepository);

    const result = await findUserByIdUseCase.handler(id);
    const { password, ...data } = result;

    return response.status(200).json(data);
  } catch (error) {
    next(error);
  }
}
