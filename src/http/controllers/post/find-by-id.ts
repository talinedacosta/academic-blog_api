import { NextFunction, Request, Response } from "express";
import { PostRepository } from "@/repositories/pg/post.repository";
import { database } from "@/lib/pg/db";
import { FindPostByIdUseCase } from "@/use-cases/posts/find-by-id";
import { z } from "zod";

export async function findById(request: Request, response: Response, next: NextFunction) {
  try {
    const registerBodySchema = z.object({
      id: z.coerce.number(),
    });

    const { id } = registerBodySchema.parse(request.params);

    const postRepository = new PostRepository(database.clientInstance);
    const findPostByIdUseCase = new FindPostByIdUseCase(postRepository);

    const result = await findPostByIdUseCase.handler(id);

    return response.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
