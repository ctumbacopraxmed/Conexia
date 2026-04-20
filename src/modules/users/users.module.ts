import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { RolesModule } from '../roles/roles.module';
import { UsersRepository } from './users.repository';

@Module({
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
  imports: [RolesModule]
})
export class UsersModule { }
