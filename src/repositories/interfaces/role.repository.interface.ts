import { Role } from "@/entities/role.entity";

export interface IRoleRepository {
  findByIdentifier(id: number): Promise<Role | null>;
}