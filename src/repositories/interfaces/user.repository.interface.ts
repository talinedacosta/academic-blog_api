import { User } from "@/entities/user.entity";

export interface IUserRepository {
  findById(id: number): Promise<User | null>;
  findByIdentifier(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: User): Promise<User>;
  update(user: User): Promise<User | null>;
  updatePassword(user: User): Promise<User | null>;
  remove(id: number): Promise<boolean>;
}