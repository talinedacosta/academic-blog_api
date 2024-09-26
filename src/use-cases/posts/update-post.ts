import { Post } from "@/entities/post.entity";
import { User } from "@/entities/user.entity";
import { PostRepository } from "@/repositories/post.repository";

export class UpdatePostUseCase {
  constructor(private postRepository: PostRepository) {}

  handler(post: Post, user: User): Promise<Post | null> {
    return this.postRepository.update(post, user);
  }
}
