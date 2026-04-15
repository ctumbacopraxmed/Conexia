import { Expose, Type, Transform } from 'class-transformer';
import { format } from 'date-fns';

export class AutorizacionDetalleDto {
    @Expose({ name: 'ORDEN_SERVICIO' })
    numOrden: number;

    @Expose({ name: 'CODIGO_SERVICIO' })
    codigoServicio: string;
    @Expose()
    @Transform(() => null)
    nombreServicio: string;
    @Expose({ name: 'VALOR_CUBIERTO' })
    @Transform(({ value }) => value ? Number(value) : 0)
    valorCubierto: number;
    @Expose({ name: 'VALOR_COPAGO_TOTAL' })
    @Transform(({ value }) => value ? Number(value) : 0)
    valorCopago: number;
}

export class AutorizacionResponseDto {
    @Expose({ name: 'NUMERO_POLIZA' })
    contrato: string;
    @Expose({ name: 'NUMERO_FAMILIA' })
    familia: string;
    @Expose()
    @Transform(() => null)
    titularFamilia: string;
    @Expose({ name: 'NUMERO_AFILIADO' })
    afiliado: string;
    @Expose({ name: 'BENEFICIARIO_DOCUMENTO_ID' })
    identificacionAfiliado: string;
    @Expose()
    @Transform(() => null)
    nombreAfiliado: string;
    @Expose({ name: 'ORDEN_SERVICIO' })
    ordenServicio: string;
    @Expose({ name: 'FECHA_ORDEN' })
    @Transform(({ value }) =>
        value ? format(new Date(value), 'dd/MM/yyyy') : null
    )
    fechaOrden: string;
    @Expose()
    @Transform(() => null)
    nombreCM: string;
    @Expose()
    @Transform(({ obj }) => {
        const detalles = obj.AUTORIZACIONWEBDETALLE;
        if (!detalles || !Array.isArray(detalles)) return 0;

        const total = detalles.reduce(
            (total, item) => total + Number(item.VALOR_CUBIERTO || 0),
            0
        );

        return Number(total.toFixed(2));
    })
    valorCubierto: number;
    @Expose()
    @Transform(({ obj }) => {
        const detalles = obj.AUTORIZACIONWEBDETALLE;
        if (!detalles || !Array.isArray(detalles)) return 0;
        const total = detalles.reduce(
            (total, item) => total + Number(item.VALOR_COPAGO_TOTAL || 0),
            0
        );
        return Number(total.toFixed(2));
    })
    valorCopago: number;

    @Expose({ name: 'AUTORIZACIONWEBDETALLE' })
    @Type(() => AutorizacionDetalleDto)
    listaCopago: AutorizacionDetalleDto[];
}