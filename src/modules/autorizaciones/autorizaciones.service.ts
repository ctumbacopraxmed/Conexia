import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { AutorizacionesRepository } from './autorizaciones.repository';
import { CreateAutorizacionDto } from './dto/create-autorizaciones.dto';
import { UpdateAutorizacionDto } from './dto/update-autorizaciones.dto';
import { UpdateStatusAutorizacionDto } from './dto/updatestatus-autorizaciones.dto';
import { FilterAutorizacionDto } from './dto/filter-autorizaciones.dto';
export enum Estado {
    APROBADO = 'APROBADO',
    PAGADO = 'PAGADO',
}
@Injectable()
export class AutorizacionesService {
    constructor(private autorizacionesRepository: AutorizacionesRepository) { }

    async findIdentify(identify: string, status: Estado) {
        const data = await this.autorizacionesRepository.findByIdentify(identify, status);
        return data;
    }
    async findAll(params: FilterAutorizacionDto) {
        const data = await this.autorizacionesRepository.findAll(params);
        return data;
    }
    async findOne(id: number) {
        const data = await this.getAutorizacionesOrThrow(id);
        return data;
    }
    async create(dto: CreateAutorizacionDto) {
        await this.validateAutorizacionDuplicada(dto.orden_servicio);
        return this.autorizacionesRepository.create({
            orden_servicio: dto.orden_servicio,
            fecha_orden: dto.fecha_orden,
            prestador_documento_id: dto.prestador_documento_id,
            prestador_nombre: dto.prestador_nombre,
            titular_familia_documento_id: dto.titular_familia_documento_id,
            titular_familia_documento_tipo: dto.titular_familia_documento_tipo,
            titular_familia_nombre: dto.titular_familia_nombre,
            numero_poliza: dto.numero_poliza,
            numero_familia: dto.numero_familia,
            numero_afiliado: dto.numero_afiliado,
            beneficiario_documento_id: dto.beneficiario_documento_id,
            beneficiario_documento_tipo: dto.beneficiario_documento_tipo,
            beneficiario_nombre: dto.beneficiario_nombre,
            fecha_creacion: dto.fecha_creacion,
            centro_medico_nombre: dto.centro_medico_nombre,
            usuario_creacion_id: dto.usuario_creacion_id,
            tipo: 'AP',
            clase: 'INTEGRACION',
            tipoatencion: 'AMBULATORIO',
            estado: 'APROBADO',
            autorizacionwebdetalle: {
                create: dto.AutorizacionDetalle.map(d => ({
                    ...d,
                    orden_servicio: dto.orden_servicio,
                    prestador_prestacion: dto.prestador_documento_id,
                    codigo_financiador: d.codigo_servicio
                }))
            }
        });
    }
    async update(id: number, dto: UpdateAutorizacionDto) {
        const validated = await this.getAutorizacionesOrThrow(id);
        if (validated.estado === 'PAGADO') {
            throw new ConflictException('La autorización ya se encuentra pagada');
        }
        const updateData: any = {};
        if (dto.fecha_pago_caja !== undefined) {
            updateData.fecha_pago_caja = new Date(dto.fecha_pago_caja);
        }
        if (dto.factura_caja !== undefined) {
            updateData.factura_caja = dto.factura_caja;
        }
        if (dto.orden_suit !== undefined) {
            updateData.orden_suit = dto.orden_suit;
        }
        updateData.estado = dto.estado ?? 'PAGADO';
        updateData.bloqueopagoapp = dto.bloqueopagoapp ?? null;
        return this.autorizacionesRepository.update(id, updateData);
    }
    async updateStatus(id: number, dto: UpdateStatusAutorizacionDto) {
        const validated = await this.getAutorizacionesOrThrow(id);
        if (validated.estado === 'PAGADO') {
            throw new ConflictException('La autorización ya se encuentra pagada');
        }
        const updateData: any = {};
        if (dto.bloqueo !== undefined) {
            const mapBloqueo = {
                PROCESO: 1,
                PENDIENTE: 2,
                RECHAZADO: 3
            };
            updateData.bloqueopagoapp = mapBloqueo[dto.bloqueo];
        }
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
