import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { database } from "@/lib/pg/db";
import { User } from "@/entities/user.entity";
import { UserRepository } from "@/repositories/pg/user.repository";
import { CreateUserUseCase } from "@/use-cases/users/create-user";
import bcrypt from "bcrypt";
import { FindUserByEmailUseCase } from "@/use-cases/users/find-user-by-email";

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     description: This endpoint creates a new user in the system.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the user.
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user.
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 description: The password for the user account.
 *                 example: "P@ssw0rd"
 *               role_id:
 *                 type: integer
 *                 description: The role ID for the user.
 *                 example: 1
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the created user.
 *                   example: 123
 *                 name:
 *                   type: string
 *                   description: The name of the created user.
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   description: The email of the created user.
 *                   example: "john.doe@example.com"
 *                 role_id:
 *                   type: integer
 *                   description: The role ID of the created user.
 *                   example: 1
 *       400:
 *         description: Bad Request - Email already in use
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "This email has already been used"
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
      name: z.string(),
      email: z.string().email(),
      password: z.string(),
      role_id: z.number(),
    });

    const { name, email, password, role_id } = registerBodySchema.parse(request.body);

    const userRepository = new UserRepository(database.clientInstance);
    const findUserByEmailUseCase = new FindUserByEmailUseCase(userRepository);

    const userExists = await findUserByEmailUseCase.handler(email);

    if (userExists) {
      return response.status(400).json({ message: "This email has already been used" });
    }

    const createUserUseCase = new CreateUserUseCase(userRepository);
    const newPassword = await bcrypt.hash(password, 10);

    const user = new User(name, email, newPassword, role_id);

    const result = await createUserUseCase.handler(user);

    return response.status(201).json({
      id: result.id,
      name: result.name,
      email: result.email,
      role_id: result.role_id,
    });
  } catch (error) {
    next(error);
  }
}
