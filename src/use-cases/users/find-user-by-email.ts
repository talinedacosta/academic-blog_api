import { User } from "@/entities/user.entity";
import { IUserRepository } from "@/repositories/interfaces/user.repository.interface";

export class FindUserByEmailUseCase {
  constructor(private userRepository: IUserRepository) {}

  async handler(email: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);

    return user;
  }
}
