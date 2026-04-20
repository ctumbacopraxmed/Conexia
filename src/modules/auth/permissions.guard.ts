import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
            'permissions',
            [context.getHandler(), context.getClass()],
        );

        if (!requiredPermissions) return true;

        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user?.permissions) {
            throw new ForbiddenException('No permissions found');
        }

        const userPermissions = user.permissions || [];

        const hasPermission = requiredPermissions.every(permission =>
            userPermissions.includes(permission),
        );

        if (!hasPermission) {
            throw new ForbiddenException('No tienes permisos');
        }

        return true;
    }
}