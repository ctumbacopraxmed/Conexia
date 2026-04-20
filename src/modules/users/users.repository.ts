import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';


@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) { }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        role: {
          include: {
            permissions: true
          }
        }
      }
    });

    if (!user || !user.isActive) return null;

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        role: {
          include: {
            permissions: true
          }
        }
      }
    });
  }

  async create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data
    });
  }

  async createFromAuth(data: {
    email: string;
    password: string;
    name?: string;
    roleId: number;
  }) {
    return this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        name: data.name,
        roleId: data.roleId,
      }
    });
  }

}
