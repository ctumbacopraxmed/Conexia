import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { AutorizacionesRepository } from './autorizaciones.repository';
import { CreateAutorizacionDto } from './dto/create-autorizaciones.dto';
import { UpdateAutorizacionDto } from './dto/update-autorizaciones.dto';

@Injectable()
export class AutorizacionesService {
    constructor(private autorizacionesRepository: AutorizacionesRepository) { }

    async findIdentify(identify: string) {
        const data = await this.autorizacionesRepository.findByIdentify(identify);
        return data;
    }
    async findOne(id: number) {
        const data = await this.getAutorizacionesOrThrow(id);
        return data;
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
            TIPO: 'AS',
            CLASE: 'MANUAL',
            TIPOATENCION: 'AMBULATORIA',
            ESTADO: 'APROBADA',
            AUTORIZACIONWEBDETALLE: {
                create: dto.AutorizacionDetalle.map(d => ({
                    ...d,
                    ORDEN_SERVICIO: dto.ORDEN_SERVICIO
                }))
            }
        });
    }
    async update(id: number, dto: UpdateAutorizacionDto) {
        const validated = await this.getAutorizacionesOrThrow(id);
        if(validated.ESTADO === 'PAGADA') {
            throw new ConflictException('La autorización ya se encuentra pagada');
        }
        const updateData: any = {};
        if (dto.FECHA_PAGO_CAJA !== undefined) {
            updateData.FECHA_PAGO_CAJA = new Date(dto.FECHA_PAGO_CAJA);
        }
        if (dto.FACTURA_CAJA !== undefined) {
            updateData.FACTURA_CAJA = dto.FACTURA_CAJA;
        }
        if (dto.ORDEN_SUIT !== undefined) {
            updateData.ORDEN_SUIT = dto.ORDEN_SUIT;
        }
        updateData.ESTADO = dto.ESTADO ?? 'PAGADA';
        return this.autorizacionesRepository.update(id, updateData);
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
