import { User } from "@/entities/user.entity";
import { IUserRepository } from "@/repositories/interfaces/user.repository.interface";

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  handler(user: User): Promise<User> {
    return this.userRepository.create(user);
  }
}