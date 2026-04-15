import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsString, MaxLength  } from 'class-validator';


export class UpdateAutorizacionDto {
    @ApiProperty({ required: true, example: 'YYYY-MM-DD' })
    @IsDateString()
    FECHA_PAGO_CAJA: Date;

    @ApiProperty({ required: true, example: '000-000-000000000' })
    @IsString()
    @MaxLength(17)
    FACTURA_CAJA: string;

    @ApiProperty({ required: true })
    @IsNumber()
    ORDEN_SUIT: number;

    @ApiHideProperty()
    ESTADO: string;
}
