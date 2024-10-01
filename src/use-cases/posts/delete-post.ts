import { IPostRepository } from "@/repositories/interfaces/post.repository.interface";

export class DeletePostUseCase {
  constructor(private postRepository: PostRepository) {}
  constructor(private postRepository: IPostRepository) {}

  handler(id: number): Promise<boolean> {
    return this.postRepository.delete(id);
  }
}