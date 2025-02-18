import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { database } from "@/lib/pg/db";
import { User } from "@/entities/user.entity";
import { UserRepository } from "@/repositories/pg/user.repository";
import bcrypt from "bcrypt";
import { FindUserByEmailUseCase } from "@/use-cases/users/find-user-by-email";
import { UpdateUserUseCase } from "@/use-cases/users/update-user";

export async function update(request: Request, response: Response, next: NextFunction) {
  try {
    const registerBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string(),
      role_id: z.number(),
    });

    const registerParamsSchema = z.object({
      id: z.coerce.number(),
    });

    const { name, email, password, role_id } = registerBodySchema.parse(request.body);
    const { id } = registerParamsSchema.parse(request.params);

    const userRepository = new UserRepository(database.clientInstance);
    const findUserByEmailUseCase = new FindUserByEmailUseCase(userRepository);

    const userExists = await findUserByEmailUseCase.handler(email);

    if (userExists && userExists.id !== id) {
      return response.status(400).json({ message: "This email has already been used" });
    }

    const updateUserUseCase = new UpdateUserUseCase(userRepository);
    const newPassword = password ? await bcrypt.hash(password, 10) : userExists!.password;

    const user = new User(name, email, newPassword, role_id);

    const result = await updateUserUseCase.handler(user);

    return response.status(201).json(result);
  } catch (error) {
    next(error);
  }
}
