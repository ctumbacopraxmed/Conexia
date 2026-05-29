import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsDateString, MaxLength, IsInt, Min } from 'class-validator';

export enum Estado {
  APROBADO = 'APROBADO',
  PAGADO = 'PAGADO',
}

export enum Bloqueo {
  PROCESO = 'PROCESO',
  PENDIENTE = 'PENDIENTE',
  RECHAZADO = 'RECHAZADO'
}

export class FilterAutorizacionDto {
  @ApiProperty({ required: true })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;
  @ApiProperty({ required: true })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  orden?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cedula?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  clase?: string;

  @ApiPropertyOptional({ enum: Estado })
  @IsOptional()
  @IsString()
  estado?: Estado;

  @ApiPropertyOptional({ enum: Bloqueo })
  @IsOptional()
  @IsString()
  bloqueo?: Bloqueo;

  @ApiProperty({ required: true, example: new Date().toISOString().split('T')[0] })
  @IsDateString()
  @MaxLength(10)
  fechaInicio: Date;

  @ApiProperty({ required: true, example: new Date().toISOString().split('T')[0] })
  @IsDateString()
  @MaxLength(10)
  fechaFin: Date;
}