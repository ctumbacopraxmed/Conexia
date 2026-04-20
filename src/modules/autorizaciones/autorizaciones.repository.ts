import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, autorizacionweb, autorizacionwebdetalle } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { AutorizacionResponseDto } from './dto/autorizacion-response.dto';

const autorizacionesSelect = Prisma.validator<Prisma.autorizacionwebSelect>()({
    id: true,
    orden_servicio: true,
    fecha_orden: true,
    estado: true
});
@Injectable()
export class AutorizacionesRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findByIdentify(identify: string): Promise<AutorizacionResponseDto[]> {
        const data = await this.prisma.autorizacionweb.findMany({
            where: {
                "beneficiario_documento_id": identify,
                "estado": "APROBADO",
                "fecha_pago_caja": null,
                "factura_caja": null,
                "bloqueopagoapp": null
            },
            include: { autorizacionwebdetalle: true }
        });
        const mapped = data.map(item => ({
            ...item,
            orden_servicio:
                item.clase === 'SUIT'
                    ? item.orden_suit
                    : item.orden_servicio,

            autorizacionwebdetalle: item.autorizacionwebdetalle.map(det => ({
                ...det,
                orden_servicio:
                    item.clase === 'SUIT'
                        ? item.orden_suit
                        : det.orden_servicio,
            }))
        }));
        return plainToInstance<AutorizacionResponseDto, any[]>(
            AutorizacionResponseDto,
            JSON.parse(JSON.stringify(mapped)),
            { excludeExtraneousValues: true }
        );
    }
    async findAll(params: any) {
        const where: any = {};
        if (params.id) {
            where.id = Number(params.id);
        }
        if (params.orden) {
            const orden = Number(params.orden);
            where.OR = [
                { orden_servicio: orden },
                { orden_suit: orden }
            ];
        }
        if (params.cedula) {
            where.beneficiario_documento_id = params.cedula;
        }
        if (params.clase) {
            where.clase = params.clase;
        }
        if (params.estado) {
            where.estado = params.estado;
        }
        if (params.bloqueo) {
            const mapBloqueo = {
                PROCESO: 1,
                PENDIENTE: 2,
                RECHAZADO: 3
            };
            where.bloqueopagoapp = mapBloqueo[params.bloqueo];
        }
        if (params.fechaInicio || params.fechaFin) {
            where.fecha_orden = {};
            if (params.fechaInicio) {
                where.fecha_orden.gte = new Date(params.fechaInicio);
            }
            if (params.fechaFin) {
                where.fecha_orden.lte = new Date(params.fechaFin + 'T23:59:59.999Z');
            }
        }
        return this.prisma.autorizacionweb.findMany({
            where,
            include: { autorizacionwebdetalle: true },
        });
    }
    async findById(id: number) {
        return this.prisma.autorizacionweb.findUnique({
            where: { id },
            include: { autorizacionwebdetalle: true }
        });
    }
    async findByOrder(order: number) {
        return this.prisma.autorizacionweb.findFirst({
            where: { "orden_servicio": order },
            select: autorizacionesSelect
        });
    }
    async create(data: Prisma.autorizacionwebCreateInput) {
        return this.prisma.autorizacionweb.create({
            data,
            include: { autorizacionwebdetalle: true }
        });
    }
    async update(id: number, data: Partial<autorizacionweb>) {
        return this.prisma.autorizacionweb.update({
            where: { id },
            data,
            select: autorizacionesSelect,
        });
    }
}