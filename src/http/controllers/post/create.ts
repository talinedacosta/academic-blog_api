import { Request, Response } from "express";
import { z } from "zod";
import { Post } from "@/entities/post.entity";
import { PostRepository } from "@/repositories/pg/post.repository";
import { CreatePostUseCase } from "@/use-cases/posts/create-post";
import { database } from "@/lib/pg/db";
import { User } from "@/entities/user.entity";

export async function create(request: Request, response: Response) {
  const registerBodySchema = z.object({
    title: z.string(),
    content: z.string(),
  });

  const { title, content } = registerBodySchema.parse(request.body);

  try {
    const postRepository = new PostRepository(database.clientInstance);
    const createPostUseCase = new CreatePostUseCase(postRepository);

    const post = new Post(title, content);
    const user = { id: 1 } as User;
    post.created_at = new Date();
    post.updated_at = new Date();

   const result = await createPostUseCase.handler(post, user);

    return response.status(201).json(result);

  } catch (error) {
    const err = error as Error;
    console.error(err.message);
    return response.status(500).json({ message: "Internal server error" });
  }
}
