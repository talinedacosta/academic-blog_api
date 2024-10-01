import { User } from "@/entities/user.entity";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { IUserRepository } from "@/repositories/interfaces/user.repository.interface";

export class FindUserByIdUseCase {
  constructor(private userRepository: IUserRepository) {}

  async handler(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    return user;
  }
}
