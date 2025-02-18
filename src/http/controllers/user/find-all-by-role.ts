import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { database } from "@/lib/pg/db";
import { UserRepository } from "@/repositories/pg/user.repository";
import { FindUserByIdUseCase } from "@/use-cases/users/find-user-by-id";
import { CustomRequest } from "@/middlewares/auth";
import { JwtPayload } from "jsonwebtoken";
import { User } from "@/entities/user.entity";
import { RoleRepository } from "@/repositories/pg/role.repository";
import { FindAllByRoleUseCase } from "@/use-cases/users/find-all-by-role";

export async function findAllByRole(request: Request, response: Response, next: NextFunction) {
  try {
    const registerBodySchema = z.object({
      role: z.coerce.number(),
    });

    const { role } = registerBodySchema.parse(request.params);
    const token = (request as CustomRequest).token as JwtPayload;
    
    const user = { id: Number(token.id), role_id: token.role_id } as User;
    
    const roleRepository = new RoleRepository(database.clientInstance);
    const userRole = await roleRepository.findByIdentifier(user.role_id);
    
    if (!userRole || userRole.description !== 'teacher') {
      return response.status(401).json({ message: 'Unauthorized' });
    }

    const userRepository = new UserRepository(database.clientInstance);
    const findAllByRoleUseCase = new FindAllByRoleUseCase(userRepository);

    const result = await findAllByRoleUseCase.handler(role);

    return response.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
