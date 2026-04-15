import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, AUTORIZACIONWEB, AUTORIZACIONWEBDETALLE } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { AutorizacionResponseDto } from './dto/autorizacion-response.dto';

const autorizacionesSelect = Prisma.validator<Prisma.AUTORIZACIONWEBSelect>()({
    ID: true,
    ORDEN_SERVICIO: true,
    FECHA_ORDEN: true,
    ESTADO: true
});
@Injectable()
export class AutorizacionesRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findByIdentify(identify: string): Promise<AutorizacionResponseDto[]> {
        const data = await this.prisma.aUTORIZACIONWEB.findMany({
            where: {
                "BENEFICIARIO_DOCUMENTO_ID": identify,
                "ESTADO": "APROBADA"
            },
            include: { AUTORIZACIONWEBDETALLE: true }
        });
        return plainToInstance<AutorizacionResponseDto, any[]>(
            AutorizacionResponseDto,
            JSON.parse(JSON.stringify(data)),
            { excludeExtraneousValues: true }
        );
    }
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
    async update(id: number, data: Partial<AUTORIZACIONWEB>) {
    return this.prisma.aUTORIZACIONWEB.update({
      where: { "ID": id },
      data,
      select: autorizacionesSelect,
    });
  }
}