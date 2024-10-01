import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { database } from "@/lib/pg/db";
import { User } from "@/entities/user.entity";
import { UserRepository } from "@/repositories/pg/user.repository";
import { RemoveUserUseCase } from "@/use-cases/users/remove-user";
import { JwtPayload } from "jsonwebtoken";
import { RoleRepository } from "@/repositories/pg/role.repository";
import { CustomRequest } from "@/middlewares/auth";

export async function remove(request: Request , response: Response, next: NextFunction) {
  try {
    const registerBodySchema = z.object({
      id: z.coerce.number(),
    });

    const { id } = registerBodySchema.parse(request.params);
    const token = (request as CustomRequest).token as JwtPayload;
    
    const user = { id: Number(token.id), role_id: token.role_id } as User;
    
    const roleRepository = new RoleRepository(database.clientInstance);
    const role = await roleRepository.findById(user.role_id); 
    console.log(role);
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
