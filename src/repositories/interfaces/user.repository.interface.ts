import { User } from "@/entities/user.entity";

export interface IUserRepository {
  findById(id: number): Promise<User | null>;
  create(user: User): Promise<User>;
  update(user: User): Promise<User | null>;
  updatePassword(user: User): Promise<User | null>;
  delete(id: number): Promise<boolean>;
}