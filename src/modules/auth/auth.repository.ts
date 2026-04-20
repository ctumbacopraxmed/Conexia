import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByToken(token: string) {
    return this.prisma.token.findUnique({
      where: { token },
    });
  }
  async create(data: { token: string; userId: number }) {
    return this.prisma.token.create({
      data: {
        token: data.token,
        userId: data.userId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 horas
      },
    });
  }
}
