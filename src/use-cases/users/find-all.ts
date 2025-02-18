import { User } from "@/entities/user.entity";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { IUserRepository } from "@/repositories/interfaces/user.repository.interface";

export class FindAllUseCase {
  constructor(private userRepository: IUserRepository) {}

  async handler(): Promise<User[]> {
    const user = await this.userRepository.findAll();

    if (!user) {
      throw new ResourceNotFoundError();
    }

    return user;
  }
}
