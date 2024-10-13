import { IPostRepository } from "@/repositories/interfaces/post.repository.interface";

export class RemovePostUseCase {
  constructor(private postRepository: IPostRepository) {}

  async handler(id: number): Promise<boolean> {
    return await this.postRepository.remove(id);
  }
}