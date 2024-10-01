import { IUserRepository } from "@/repositories/interfaces/user.repository.interface";

export class RemoveUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async handler(id: number): Promise<boolean> {
    return await this.userRepository.remove(id);
  }
}