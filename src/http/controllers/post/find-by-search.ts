import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { database } from "@/lib/pg/db";
import { PostRepository } from "@/repositories/pg/post.repository";
import { FindPostBySearchUseCase } from "@/use-cases/posts/find-by-search";

export async function search(request: Request , response: Response, next: NextFunction) {
  try {
    const registerBodySchema = z.object({
      search: z.string().min(1),
    });

    const { search } = registerBodySchema.parse(request.query);
    console.log(request.query)
    const postRepository = new PostRepository(database.clientInstance);
    const findPostBySearchUseCase = new FindPostBySearchUseCase(postRepository);

    const posts = await findPostBySearchUseCase.handler(search);

    return response.status(200).json(posts);

  } catch (error) {
    next(error);
  }
}
