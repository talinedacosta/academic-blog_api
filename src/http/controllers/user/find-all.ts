import { NextFunction, Request, Response } from "express";
import { database } from "@/lib/pg/db";
import { UserRepository } from "@/repositories/pg/user.repository";
import { CustomRequest } from "@/middlewares/auth";
import { JwtPayload } from "jsonwebtoken";
import { User } from "@/entities/user.entity";
import { RoleRepository } from "@/repositories/pg/role.repository";
import { FindAllUseCase } from "@/use-cases/users/find-all";

export async function findAll(request: Request, response: Response, next: NextFunction) {
  try {
    const token = (request as CustomRequest).token as JwtPayload;
    
    const user = { id: Number(token.id), role_id: token.role_id } as User;
    
    const roleRepository = new RoleRepository(database.clientInstance);
    const role = await roleRepository.findByIdentifier(user.role_id);
    
    if (!role || role.description !== 'teacher') {
      return response.status(401).json({ message: 'Unauthorized' });
    }

    const userRepository = new UserRepository(database.clientInstance);
    const findAllUseCase = new FindAllUseCase(userRepository);

    const result = await findAllUseCase.handler();

    return response.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
