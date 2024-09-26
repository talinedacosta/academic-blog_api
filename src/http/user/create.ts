import { Request, Response } from "express";
import { z } from "zod";
import { database } from "@/lib/pg/db";
import { User } from "@/entities/user.entity";
import { UserRepository } from "@/repositories/user.repository";
import { CreateUserUseCase } from "@/use-cases/users/create-user";

export async function create(request: Request, response: Response) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    role_id: z.number(),
  });

  const { name, email, password, role_id } = registerBodySchema.parse(request.body);

  try {
    const userRepository = new UserRepository(database.clientInstance);
    const createUserUseCase = new CreateUserUseCase(userRepository);

    const user = new User(name, email, password, role_id);    

    const result = await createUserUseCase.handler(user);

    return response.status(201).json(result);

  } catch (error) {
    const err = error as Error;
    console.error(err.message);
    return response.status(500).json({ message: "Internal server error" });
  }
}
