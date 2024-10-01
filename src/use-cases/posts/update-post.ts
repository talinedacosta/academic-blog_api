import { Post } from "@/entities/post.entity";
import { User } from "@/entities/user.entity";
import { IPostRepository } from "@/repositories/interfaces/post.repository.interface";

export class UpdatePostUseCase {
  constructor(private postRepository: IPostRepository) {}

  handler(post: Post, user: User): Promise<Post | null> {
    return this.postRepository.update(post, user);
  }
}
