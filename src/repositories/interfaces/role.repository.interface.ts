import { Role } from "@/entities/role.entity";

export interface IRoleRepository {
  findById(id: number): Promise<Role | null>;
}