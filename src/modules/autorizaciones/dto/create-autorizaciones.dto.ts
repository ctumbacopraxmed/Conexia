import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsNumber, IsString, IsOptional, ValidateNested, IsArray } from 'class-validator';

export class CreateAutorizacionDetalleDto {

    @ApiProperty({ required: true })
    @IsString()
    CODIGO_SERVICIO: string;

    @ApiProperty({ required: true })
    @IsNumber()
    CANTIDAD_SERVICIO: number;

    @ApiProperty({ required: true })
    @IsString()
    CODIGO_DIAGNOSTICO: string;

    @ApiProperty({ required: true })
    @IsNumber()
    VALOR_ECUSANITAS: number;

    @ApiProperty({ required: true })
    @IsNumber()
    VALOR_CUBIERTO: number;

    @ApiProperty({ required: true })
    @IsNumber()
    VALOR_COPAGO_TOTAL: number;

    @ApiProperty({ required: true })
    @IsNumber()
    VALOR_DEDUCIBLE: number;

    @ApiProperty({ required: true })
    @IsNumber()
    PORCENTAJE_COBERTURA: number;

    @ApiProperty({ required: true })
    @IsNumber()
    COPAGO_MINIMO: number;

    @ApiProperty({ required: true })
    @IsNumber()
    VALOR_DESCUENTO: number;

    @ApiProperty({ required: true })
    @IsString()
    CODIGO_DIAGNOSTICO_ORIGEN: string;
}


export class CreateAutorizacionDto {
    @ApiProperty({ required: true })
    @IsNumber()
    ORDEN_SERVICIO: number;

    @ApiProperty({ required: true, type: String, example: 'YYYY-MM-DDT00:00:00.000Z' })
    @IsDateString()
    FECHA_ORDEN: string;

    @ApiProperty({ required: true })
    @IsString()
    PRESTADOR_DOCUMENTO_ID: string;

    @ApiProperty({ required: true })
    @IsNumber()
    NUMERO_POLIZA: number;

    @ApiProperty({ required: true })
    @IsNumber()
    NUMERO_FAMILIA: number;

    @ApiProperty({ required: true })
    @IsNumber()
    NUMERO_AFILIADO: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    BENEFICIARIO_DOCUMENTO_ID?: string;

    @ApiProperty({ required: true, type: String, example: 'YYYY-MM-DDT00:00:00.000Z' })
    @IsDateString()
    FECHA_CREACION: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    USUARIO_CREACION_ID?: string;

    @ApiProperty({
        type: [CreateAutorizacionDetalleDto],
        required: true
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateAutorizacionDetalleDto)
    AutorizacionDetalle!: CreateAutorizacionDetalleDto[];
}
