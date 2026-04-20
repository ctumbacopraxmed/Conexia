import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsString, MaxLength  } from 'class-validator';


export class UpdateAutorizacionDto {
    @ApiProperty({ required: true, example: 'YYYY-MM-DD' })
    @IsDateString()
    fecha_pago_caja: Date;

    @ApiProperty({ required: true, example: '000-000-000000000' })
    @IsString()
    @MaxLength(17)
    factura_caja: string;

    @ApiProperty({ required: true })
    @IsNumber()
    orden_suit: number;

    @ApiHideProperty()
    estado: string;

    @ApiHideProperty()
    bloqueopagoapp: number;
}
