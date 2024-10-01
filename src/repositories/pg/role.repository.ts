import { Role } from "@/entities/role.entity";
import { Repository } from "./default.repository";
import { PoolClient } from "pg";
import { IRoleRepository } from "../interfaces/role.repository.interface";

export class RoleRepository extends Repository<Role> implements IRoleRepository {
  constructor(conn: PoolClient) {
    super(conn, "role", { unique_identifier: "id" });
  }
}
