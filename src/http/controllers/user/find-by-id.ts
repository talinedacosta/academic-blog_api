import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { database } from "@/lib/pg/db";
import { UserRepository } from "@/repositories/pg/user.repository";
import { FindUserByIdUseCase } from "@/use-cases/users/find-user-by-id";

export async function findById(request: Request, response: Response, next: NextFunction) {
  try {
    const registerBodySchema = z.object({
      id: z.coerce.number(),
    });

    const { id } = registerBodySchema.parse(request.params);

    const userRepository = new UserRepository(database.clientInstance);
    const findUserByIdUseCase = new FindUserByIdUseCase(userRepository);

    const result = await findUserByIdUseCase.handler(id);

    return response.status(201).json(result);
  } catch (error) {
    next(error);
  }
}
