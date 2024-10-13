import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { database } from "@/lib/pg/db";
import { UserRepository } from "@/repositories/pg/user.repository";
import { FindUserByIdUseCase } from "@/use-cases/users/find-user-by-id";
import { CustomRequest } from "@/middlewares/auth";
import { JwtPayload } from "jsonwebtoken";
import { User } from "@/entities/user.entity";
import { RoleRepository } from "@/repositories/pg/role.repository";

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
