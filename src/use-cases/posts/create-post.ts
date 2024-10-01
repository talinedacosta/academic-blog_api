import { Post } from "@/entities/post.entity";
import { User } from "@/entities/user.entity";
import { IPostRepository } from "@/repositories/interfaces/post.repository.interface";

export class CreatePostUseCase {
  constructor(private postRepository: IPostRepository) {}

  async handler(post: Post, user: User): Promise<Post> {
    return await this.postRepository.create(post, user);
  }
}