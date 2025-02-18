import { User } from "@/entities/user.entity";
import { IUserRepository } from "@/repositories/interfaces/user.repository.interface";

export class UpdateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async handler(user: User): Promise<User | null> {
    return await this.userRepository.update(user);
  }
}