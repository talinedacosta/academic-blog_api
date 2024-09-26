import { PostRepository } from "@/repositories/post.repository";

export class DeletePostUseCase {
  constructor(private postRepository: PostRepository) {}

  handler(id: number): Promise<boolean> {
    return this.postRepository.delete(id);
  }
}