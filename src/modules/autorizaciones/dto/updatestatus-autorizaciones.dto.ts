import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export enum Bloqueo {
  PROCESO = 'PROCESO',
  PENDIENTE = 'PENDIENTE',
  RECHAZADO = 'RECHAZADO'
}
export class UpdateStatusAutorizacionDto {
    @ApiProperty({ required: true, description: 'Valores permitidos: PROCESO, PENDIENTE, RECHAZADO', enum: Bloqueo })
    @IsEnum(Bloqueo)
    bloqueo: Bloqueo;
}
