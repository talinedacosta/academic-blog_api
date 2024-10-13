import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { Post } from "@/entities/post.entity";
import { PostRepository } from "@/repositories/pg/post.repository";
import { CreatePostUseCase } from "@/use-cases/posts/create-post";
import { database } from "@/lib/pg/db";
import { User } from "@/entities/user.entity";
import { CustomRequest } from "@/middlewares/auth";
import { JwtPayload } from "jsonwebtoken";
import { RoleRepository } from "@/repositories/pg/role.repository";

export async function create(request: Request, response: Response, next: NextFunction) {
  try {
    const registerBodySchema = z.object({
      title: z.string(),
      content: z.string(),
    });
  
    const { title, content } = registerBodySchema.parse(request.body);

    const token = (request as CustomRequest).token as JwtPayload;    
    const user = { id: Number(token.id), role_id: token.role_id } as User;
    
    const roleRepository = new RoleRepository(database.clientInstance);
    const role = await roleRepository.findByIdentifier(user.role_id);
    
    if (!role || role.description !== 'teacher') {
      return response.status(401).json({ message: 'Unauthorized' });
    }

    const postRepository = new PostRepository(database.clientInstance);
    const createPostUseCase = new CreatePostUseCase(postRepository);

    const post = new Post(title, content);
    post.created_at = new Date();    

   const result = await createPostUseCase.handler(post, user);

    return response.status(201).json(result);

  } catch (error) {
    next(error);
  }
}
