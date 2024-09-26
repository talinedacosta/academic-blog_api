import { Post } from "@/entities/post.entity";
import { User } from "@/entities/user.entity";
import { PostRepository } from "@/repositories/post.repository";

export class CreatePostUseCase {
  constructor(private postRepository: PostRepository) {}

  async handler(post: Post, user: User): Promise<Post> {
    return await this.postRepository.create(post, user);
  }
}