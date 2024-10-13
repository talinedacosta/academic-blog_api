import { Post } from "@/entities/post.entity";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { IPostRepository } from "@/repositories/interfaces/post.repository.interface";

export class FindPostBySearchUseCase {
  constructor(private postRepository: IPostRepository) {}

  async handler(search: string): Promise<Array<Post>> {
    const post = await this.postRepository.findBySearch(search);

    if (!post) {
      throw new ResourceNotFoundError();
    }

    return post;
  }
}
