import { Post } from "@/entities/post.entity";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { IPostRepository } from "@/repositories/interfaces/post.repository.interface";

export class FindPostByIdUseCase {
  constructor(private postRepository: IPostRepository) {}

  async handler(id: number): Promise<Post> {
    const post = await this.postRepository.findById(id);

    if (!post) {
      throw new ResourceNotFoundError();
    }

    return post;
  }
}
