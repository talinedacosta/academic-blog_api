import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { database } from "@/lib/pg/db";
import { UserRepository } from "@/repositories/pg/user.repository";
import bcrypt from "bcrypt";
import { FindUserByEmailUseCase } from "@/use-cases/users/find-user-by-email";
import jwt from 'jsonwebtoken';
import { env } from "@/env";

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

    const token = jwt.sign({ id: user.id, name: user.name, role_id: user.role_id }, env.JWT_SECRET, { expiresIn: '1h' });
    
    return response.status(201).json({
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
