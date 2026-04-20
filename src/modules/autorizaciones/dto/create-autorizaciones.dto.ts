import { ApiProperty,ApiHideProperty  } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { IsDateString, IsNumber, IsString, IsOptional, ValidateNested, IsArray, Min } from 'class-validator';

export class CreateAutorizacionDetalleDto {

    @ApiProperty({ required: true })
    @IsString()
    codigo_servicio: string;

    @ApiProperty({ required: true, minimum: 1 })
    @IsNumber()
    @Min(1)
    cantidad_servicio: number;

    @ApiProperty({ required: true })
    @IsString()
    codigo_diagnostico: string;

    @ApiProperty({ required: true })
    @Transform(({ value }) => Number(parseFloat(value).toFixed(2)))
    @IsNumber()
    valor_ecusanitas: number;

    @ApiProperty({ required: true })
    @Transform(({ value }) => Number(parseFloat(value).toFixed(2)))
    @IsNumber()
    valor_cubierto: number;

    @ApiProperty({ required: true })
    @Transform(({ value }) => Number(parseFloat(value).toFixed(2)))
    @IsNumber()
    valor_copago_total: number;

    @ApiProperty({ required: true })
    @Transform(({ value }) => Number(parseFloat(value).toFixed(2)))
    @IsNumber()
    valor_deducible: number;

    @ApiProperty({ required: true })
    @Transform(({ value }) => Number(parseFloat(value).toFixed(2)))
    @IsNumber()
    porcentaje_cobertura: number;

    @ApiProperty({ required: true })
    @Transform(({ value }) => Number(parseFloat(value).toFixed(2)))
    @IsNumber()
    copago_minimo: number;

    @ApiProperty({ required: true })
    @Transform(({ value }) => Number(parseFloat(value).toFixed(2)))
    @IsNumber()
    valor_descuento: number;

    @ApiProperty({ required: true })
    @IsString()
    codigo_diagnostico_origen: string;
}


export class CreateAutorizacionDto {
    @ApiProperty({ required: true })
    @IsNumber()
    orden_servicio: number;

    @ApiProperty({ required: true, type: String, example: 'YYYY-MM-DDT00:00:00.000Z' })
    @IsDateString()
    fecha_orden: string;

    @ApiProperty({ required: true })
    @IsString()
    prestador_documento_id: string;

    @ApiProperty({ required: true })
    @IsNumber()
    numero_poliza: number;

    @ApiProperty({ required: true })
    @IsNumber()
    numero_familia: number;

    @ApiProperty({ required: true })
    @IsNumber()
    numero_afiliado: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    beneficiario_documento_id?: string;

    @ApiProperty({ required: true, type: String, example: 'YYYY-MM-DDT00:00:00.000Z' })
    @IsDateString()
    fecha_creacion: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    usuario_creacion_id?: string;

    @ApiHideProperty()
    tipo: string;

    @ApiHideProperty()
    clase: string;

    @ApiHideProperty()
    tipoatencion: string;

    @ApiHideProperty()
    estado: string;

    @ApiProperty({
        type: [CreateAutorizacionDetalleDto],
        required: true
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateAutorizacionDetalleDto)
    AutorizacionDetalle!: CreateAutorizacionDetalleDto[];
}
