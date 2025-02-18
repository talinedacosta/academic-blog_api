import { User } from "@/entities/user.entity";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { IUserRepository } from "@/repositories/interfaces/user.repository.interface";

export class FindAllByRoleUseCase {
  constructor(private userRepository: IUserRepository) {}

  async handler(role_id: number): Promise<User[]> {
    const user = await this.userRepository.findAllByRole(role_id);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    return user;
  }
}