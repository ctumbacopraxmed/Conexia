import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, AUTORIZACIONWEB, AUTORIZACIONWEBDETALLE } from '@prisma/client';

const autorizacionesSelect = Prisma.validator<Prisma.AUTORIZACIONWEBSelect>()({
    ID: true,
    ORDEN_SERVICIO: true,
    FECHA_ORDEN: true,
});

@Injectable()
export class AutorizacionesRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: number) {
        return this.prisma.aUTORIZACIONWEB.findUnique({
            where: { "ID": id },
            include: { AUTORIZACIONWEBDETALLE: true }
        });
    }
    async findByOrder(order: number) {
        return this.prisma.aUTORIZACIONWEB.findFirst({
            where: { "ORDEN_SERVICIO": order },
            select: autorizacionesSelect
        });
    }
    async create(data: Prisma.AUTORIZACIONWEBCreateInput) {
        return this.prisma.aUTORIZACIONWEB.create({
            data,
            include: { AUTORIZACIONWEBDETALLE: true }
        });
    }
}