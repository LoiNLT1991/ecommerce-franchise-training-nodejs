import { BaseRepository } from "../../core/repository";
import { IRole } from "./role.interface";
import RoleSchema from "./role.model";

export class RoleRepository extends BaseRepository<IRole> {
  constructor() {
    super(RoleSchema);
  }
}
