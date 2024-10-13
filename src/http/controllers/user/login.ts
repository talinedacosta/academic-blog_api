import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { database } from "@/lib/pg/db";
import { UserRepository } from "@/repositories/pg/user.repository";
import bcrypt from "bcrypt";
import { FindUserByEmailUseCase } from "@/use-cases/users/find-user-by-email";
import jwt from 'jsonwebtoken';
import { env } from "@/env";

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     description: This endpoint allows a user to log in by providing their email and password.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address.
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: "P@ssw0rd"
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authenticated sessions.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: The ID of the user.
 *                       example: 123
 *                     name:
 *                       type: string
 *                       description: The name of the user.
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       description: The email of the user.
 *                       example: "john.doe@example.com"
 *                     role_id:
 *                       type: integer
 *                       description: The role ID of the user.
 *                       example: 1
 *       400:
 *         description: Bad Request - User not exists or password incorrect
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not exists"
 *       401:
 *         description: Bad Request - Password incorrect
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password incorrect"
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
export async function login(request: Request, response: Response, next: NextFunction) {
  try {
    const registerBodySchema = z.object({
      email: z.string().email(),
      password: z.string(),
    });
  
    const { email, password } = registerBodySchema.parse(request.body);
    
    const userRepository = new UserRepository(database.clientInstance);
    const findUserByEmailUseCase = new FindUserByEmailUseCase(userRepository);

    const user = await findUserByEmailUseCase.handler(email); 

    if (!user) {
      return response.status(400).json({ message: 'User not exists' });
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      return response.status(400).json({ message: 'Password incorrect' });
    }

    const token = jwt.sign({ id: user.id, name: user.name, role_id: user.role_id }, env.JWT_SECRET, { expiresIn: '2h' });
    
    return response.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role_id: user.role_id,
      }
    });

  } catch (error) {
    next(error);
  }
}
