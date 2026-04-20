import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../users/users.repository';
import { TokenRepository } from './auth.repository';
import { RolesRepository } from '../roles/roles.repository';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly tokenRepository: TokenRepository,
    private readonly jwtService: JwtService,
    private readonly rolesRepository: RolesRepository,
  ) {}

  async login(email: string, password: string) {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid password');
    }
    const token = await this.generateAccessToken(user);
    return { token };
  }

  async register(email: string, password: string, name?: string) {
    const existingUser = await this.usersRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    const defaultRole = await this.rolesRepository.findByName('User');
    if (!defaultRole) {
      throw new ConflictException('Default role not configured');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersRepository.createFromAuth({
      email,
      password: hashedPassword,
      name,
      roleId: defaultRole.id,
    });
    const token = await this.generateAccessToken(user);
    return { token };
  }

  private async generateAccessToken(user: {
    id: number;
    email: string;
    name: string | null;
    role?: { name: string; permissions: { name: string }[] };
  }): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role?.name,
      permissions: user.role?.permissions.map((p) => p.name),
    };
    const token = await this.jwtService.signAsync(payload);
    await this.tokenRepository.create({
      token,
      userId: user.id,
    });
    return token;
  }
  async validateAccessToken(token: string, userId: number): Promise<void> {
    const dbToken = await this.tokenRepository.findByToken(token);
    if (!dbToken) {
      throw new UnauthorizedException('Token not found (logged out)');
    }
    if (dbToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Token expired');
    }
    const user = await this.usersRepository.findById(userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User inactive');
    }
  }
}
