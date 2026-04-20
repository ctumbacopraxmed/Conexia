import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) { }

  async findOne(id: number) {
    const user = await this.getUserOrThrow(id);
    return user;
  }
  async findByEmail(email: string) {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await this.usersRepository.findByEmail(normalizedEmail);
    if (!user || !user.isActive) {
      return null;
    }
    return user;
  }

  async findMe(userId: number) {
    return this.findOne(userId);
  }

  async create(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.usersRepository.create({
      email: dto.email.toLowerCase().trim(),
      password: hashedPassword,
      name: dto.name,
      role: {
        connect: { id: dto.roleId },
      },
    });
  }

  async createFromAuth(data: {
    email: string;
    password: string;
    name?: string;
    roleId: number;
  }) {
    return this.create({
      email: data.email,
      password: data.password,
      name: data.name,
      roleId: data.roleId,
    });
  }

  private async getUserOrThrow(id: number) {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
