import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { AutorizacionesRepository } from './autorizaciones.repository';
import { CreateAutorizacionDto } from './dto/create-autorizaciones.dto';

@Injectable()
export class AutorizacionesService {
    constructor(private autorizacionesRepository: AutorizacionesRepository) { }

    async findOne(id: number) {
        const role = await this.getAutorizacionesOrThrow(id);
        return role;
    }
    async create(dto: CreateAutorizacionDto) {
        await this.validateAutorizacionDuplicada(dto.ORDEN_SERVICIO);
        return this.autorizacionesRepository.create({
            ORDEN_SERVICIO: dto.ORDEN_SERVICIO,
            FECHA_ORDEN: dto.FECHA_ORDEN,
            PRESTADOR_DOCUMENTO_ID: dto.PRESTADOR_DOCUMENTO_ID,
            NUMERO_POLIZA: dto.NUMERO_POLIZA,
            NUMERO_FAMILIA: dto.NUMERO_FAMILIA,
            NUMERO_AFILIADO: dto.NUMERO_AFILIADO,
            BENEFICIARIO_DOCUMENTO_ID: dto.BENEFICIARIO_DOCUMENTO_ID,
            FECHA_CREACION: dto.FECHA_CREACION,
            USUARIO_CREACION_ID: dto.USUARIO_CREACION_ID,

            AUTORIZACIONWEBDETALLE: {
                create: dto.AutorizacionDetalle.map(d => ({
                    ...d,
                    ORDEN_SERVICIO: dto.ORDEN_SERVICIO
                }))
            }
        });
    }

    private async getAutorizacionesOrThrow(id: number) {
        const autorizacion = await this.autorizacionesRepository.findById(id);
        if (!autorizacion) {
            throw new NotFoundException('Autorizacion not found');
        }
        return autorizacion;
    }

    private async validateAutorizacionDuplicada(order: number) {
        const autorizacion = await this.autorizacionesRepository.findByOrder(order);
        if (autorizacion) {
            throw new ConflictException('La autorización ya existe');
        }
    }

    private parseDateOnly(date: string): Date {
        const [year, month, day] = date.split('-').map(Number);
        return new Date(year, month - 1, day);
    }
}
