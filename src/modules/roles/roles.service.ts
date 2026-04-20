import { Injectable } from '@nestjs/common';
import { RolesRepository } from './roles.repository';

@Injectable()
export class RolesService {
  constructor(private rolesRepository: RolesRepository) {}

  async findRoleDefault(name: string) {
    return this.rolesRepository.findByName(name);
  }
}
