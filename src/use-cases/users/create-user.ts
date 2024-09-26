import { User } from "@/entities/user.entity";
import { UserRepository } from "@/repositories/user.repository";

export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  handler(user: User): Promise<User> {
    return this.userRepository.create(user);
  }
}