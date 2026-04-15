import { ApiProperty,ApiHideProperty  } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { IsDateString, IsNumber, IsString, IsOptional, ValidateNested, IsArray, Min } from 'class-validator';

export class CreateAutorizacionDetalleDto {

    @ApiProperty({ required: true })
    @IsString()
    CODIGO_SERVICIO: string;

    @ApiProperty({ required: true, minimum: 1 })
    @IsNumber()
    @Min(1)
    CANTIDAD_SERVICIO: number;

    @ApiProperty({ required: true })
    @IsString()
    CODIGO_DIAGNOSTICO: string;

    @ApiProperty({ required: true })
    @Transform(({ value }) => Number(parseFloat(value).toFixed(2)))
    @IsNumber()
    VALOR_ECUSANITAS: number;

    @ApiProperty({ required: true })
    @Transform(({ value }) => Number(parseFloat(value).toFixed(2)))
    @IsNumber()
    VALOR_CUBIERTO: number;

    @ApiProperty({ required: true })
    @Transform(({ value }) => Number(parseFloat(value).toFixed(2)))
    @IsNumber()
    VALOR_COPAGO_TOTAL: number;

    @ApiProperty({ required: true })
    @Transform(({ value }) => Number(parseFloat(value).toFixed(2)))
    @IsNumber()
    VALOR_DEDUCIBLE: number;

    @ApiProperty({ required: true })
    @Transform(({ value }) => Number(parseFloat(value).toFixed(2)))
    @IsNumber()
    PORCENTAJE_COBERTURA: number;

    @ApiProperty({ required: true })
    @Transform(({ value }) => Number(parseFloat(value).toFixed(2)))
    @IsNumber()
    COPAGO_MINIMO: number;

    @ApiProperty({ required: true })
    @Transform(({ value }) => Number(parseFloat(value).toFixed(2)))
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

    @ApiHideProperty()
    TIPO: string;

    @ApiHideProperty()
    CLASE: string;

    @ApiHideProperty()
    TIPOATENCION: string;

    @ApiHideProperty()
    ESTADO: string;

    @ApiProperty({
        type: [CreateAutorizacionDetalleDto],
        required: true
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateAutorizacionDetalleDto)
    AutorizacionDetalle!: CreateAutorizacionDetalleDto[];
}
