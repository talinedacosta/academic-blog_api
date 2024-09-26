import { Role } from "@/entities/role.entity";
import { Repository } from "./default.repository";
import { PoolClient } from "pg";

export class RoleRepository extends Repository<Role> {
  constructor(conn: PoolClient) {
    super(conn, "roles", { unique_identifier: "id" });
  }
}
