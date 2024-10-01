import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { database } from "@/lib/pg/db";
import { User } from "@/entities/user.entity";
import { UserRepository } from "@/repositories/pg/user.repository";
import { CreateUserUseCase } from "@/use-cases/users/create-user";
import bcrypt from "bcrypt";
import { FindUserByEmailUseCase } from "@/use-cases/users/find-user-by-email";

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
      return response.status(400).json({ message: 'This email has already been used' });
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
