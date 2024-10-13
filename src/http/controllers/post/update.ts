import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { Post } from "@/entities/post.entity";
import { PostRepository } from "@/repositories/pg/post.repository";
import { database } from "@/lib/pg/db";
import { User } from "@/entities/user.entity";
import { RoleRepository } from "@/repositories/pg/role.repository";
import { CustomRequest } from "@/middlewares/auth";
import { JwtPayload } from "jsonwebtoken";
import { UpdatePostUseCase } from "@/use-cases/posts/update-post";

export async function update(request: Request, response: Response, next: NextFunction) {
  try {
    const registerBodySchema = z.object({
      title: z.string(),
      content: z.string(),
    });

    const registerParamsSchema = z.object({
      id: z.coerce.number(),
    });
  
    const { title, content } = registerBodySchema.parse(request.body);
    const { id } = registerParamsSchema.parse(request.params);

    const token = (request as CustomRequest).token as JwtPayload;    
    const user = { id: Number(token.id), role_id: token.role_id } as User;
    
    const roleRepository = new RoleRepository(database.clientInstance);
    const role = await roleRepository.findByIdentifier(user.role_id);
    
    if (!role || role.description !== 'teacher') {
      return response.status(401).json({ message: 'Unauthorized' });
    }

    const postRepository = new PostRepository(database.clientInstance);
   
    const findByIdentifier = await postRepository.findByIdentifier(id);
    
    if (!findByIdentifier) {
      return response.status(404).json({ message: 'Post not found' });
    }
   
    const updatePostUseCase = new UpdatePostUseCase(postRepository);
    
    const post = new Post(title, content);
    post.id = id;
    post.updated_at = new Date();
    post.updated_by = user.id;

   const result = await updatePostUseCase.handler(post, user);

    return response.status(201).json(result);

  } catch (error) {
    next(error);
  }
}
