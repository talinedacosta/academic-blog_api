import { NextFunction, Request, Response } from "express";
import { PostRepository } from "@/repositories/pg/post.repository";
import { database } from "@/lib/pg/db";
import { FindAllPostUseCase } from "@/use-cases/posts/find-all";

export async function findAll(request: Request, response: Response, next: NextFunction) {
  try {        
    const postRepository = new PostRepository(database.clientInstance);
    const findAllPostUseCase = new FindAllPostUseCase(postRepository);  
   
   const result = await findAllPostUseCase.handler();

    return response.status(200).json(result);

  } catch (error) {
    next(error);
  }
}
