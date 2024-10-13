import { Post } from "@/entities/post.entity";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { IPostRepository } from "@/repositories/interfaces/post.repository.interface";

export class FindAllPostUseCase {
  constructor(private postRepository: IPostRepository) {}

  async handler(): Promise<Array<Post>> {
    const posts = await this.postRepository.findAll();

    if (!posts) {
      throw new ResourceNotFoundError();
    }

    return posts;
  }
}
