import { Expose, Type, Transform } from 'class-transformer';
import { format } from 'date-fns';

export class AutorizacionDetalleDto {
    @Expose({ name: 'orden_servicio' })
    numOrden: number;
    @Expose({ name: 'codigo_servicio' })
    codigoServicio: string;
    @Expose({ name: 'servicio_nombre' })
    nombreServicio: string;
    @Expose({ name: 'cantidad_servicio' })
    cantidad: number;
    @Expose({ name: 'valor_cubierto' })
    @Transform(({ value }) => value ? Number(value) : 0)
    valorCubierto: number;
    @Expose({ name: 'valor_copago_total' })
    @Transform(({ value }) => value ? Number(value) : 0)
    valorCopago: number;
    @Expose({ name: 'valor_deducible' })
    @Transform(({ value }) => value ? Number(value) : 0)
    valorDeducible: number;
    @Expose({ name: 'valor_copago_terceros' })
    @Transform(({ value }) => value ? Number(value) : 0)
    valorTerceros: number;
}

export class AutorizacionResponseDto {
    @Expose({ name: 'id' })
    autorizacionId: number;
    @Expose({ name: 'numero_poliza' })
    contrato: string;
    @Expose({ name: 'numero_familia' })
    familia: string;
    @Expose({ name: 'titular_familia_documento_id' })
    titularFamilia: string;
    @Expose({ name: 'titular_familia_documento_tipo' })
    tipoDocumentoTitular: string;
    @Expose({ name: 'titular_familia_nombre' })
    nombreTitular: string;
    @Expose({ name: 'numero_afiliado' })
    afiliado: string;
    @Expose({ name: 'beneficiario_documento_id' })
    identificacionAfiliado: string;
    @Expose({ name: 'beneficiario_documento_tipo' })
    tipoDocumentoAfiliado: string;
    @Expose({ name: 'beneficiario_nombre' })
    nombreAfiliado: string;
    @Expose({ name: 'orden_servicio' })
    ordenServicio: string;
    @Expose({ name: 'fecha_orden' })
    @Transform(({ value }) =>
        value ? format(new Date(value), 'dd/MM/yyyy') : null
    )
    fechaOrden: string;
    @Expose({ name: 'centro_medico_nombre' })
    nombreCM: string;
    @Expose({ name: 'estado' })
    estado: string;
    @Expose({ name: 'clase' })
    clase: string;
    @Expose({ name: 'fecha_pago_caja' })
    fechaFactura: string;
    @Expose({ name: 'factura_caja' })
    numFactura: string;
    @Expose()
    @Transform(({ obj }) => {
        const detalles = obj.autorizacionwebdetalle;
        if (!detalles || !Array.isArray(detalles)) return 0;

        const total = detalles.reduce(
            (total, item) => total + Number(item.valor_cubierto * item.cantidad_servicio || 0),
            0
        );

        return Number(total.toFixed(2));
    })
    valorCubierto: number;
    @Expose()
    @Transform(({ obj }) => {
        const detalles = obj.autorizacionwebdetalle;
        if (!detalles || !Array.isArray(detalles)) return 0;
        const total = detalles.reduce((acc, item) => {
            const copago = Number(item.valor_copago_total * item.cantidad_servicio || 0);
            const deducible = Number(item.valor_deducible || 0);
            const terceros = Number(item.valor_copago_terceros * item.cantidad_servicio || 0);
            return acc + copago + deducible + terceros;
        }, 0);


        return Number(total.toFixed(2));
    })
    valorCopago: number;

    @Expose({ name: 'autorizacionwebdetalle' })
    @Type(() => AutorizacionDetalleDto)
    listaCopago: AutorizacionDetalleDto[];
}