import { Controller, Get, Param, ParseIntPipe, Body, Post, Query, UseGuards } from '@nestjs/common';
import { AutorizacionesService } from './autorizaciones.service';
import { CreateAutorizacionDto } from './dto/create-autorizaciones.dto';
import { UpdateAutorizacionDto } from './dto/update-autorizaciones.dto';
import { UpdateStatusAutorizacionDto } from './dto/updatestatus-autorizaciones.dto';
import { FilterAutorizacionDto } from './dto/filter-autorizaciones.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { responseData, responseNovo } from '../../common/filters/response.wrapper';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PermissionsGuard } from '../auth/permissions.guard';
import { Permissions } from '../../common/decorators/permisos-auth.derorator';
export enum Estado {
    APROBADO = 'APROBADO',
    PAGADO = 'PAGADO',
}
@ApiTags('Autorizaciones')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('autorizaciones')
export class AutorizacionesController {
    constructor(private autorizacionesService: AutorizacionesService) { }
    @Permissions('VER_REGISTROS')
    @Get(':cedula/:estado')
    @ApiOperation({
        summary: 'Obtener autorización por Identificación',
        description: 'Obtiene las autorizaciones APROBADAS (Pendientes por gestionar) y PAGADAS (Historial)'
    })
    @ApiParam({
        name: 'estado',
        enum: Estado,
        required: true,
    })
    async getAutorizacion(
        @Param('cedula') cedula: string,
        @Param('estado') estado: Estado,
    ) {
        const result = await this.autorizacionesService.findIdentify(cedula, estado);
        if (result.length === 0) {
            return responseNovo(false, null, 'ORDEN DE SERVICIO WEB', 200, 'AUTORIZACIÓN NO ENCONTRADA');
        }
        return responseNovo(true, result, 'ORDEN DE SERVICIO WEB', 200, 'CORRECTO');
    }
    @Permissions('VER_TODO')
    @Get()
    @ApiOperation({
        summary: 'Buscar autorizaciones',
        description: 'Obtiene toda la información de la base de datos, tener precaucion con los rangos de fechas.'
    })
    async findAll(@Query() query: FilterAutorizacionDto) {
        const result = await this.autorizacionesService.findAll(query);
        return responseData(result);
    }
    @Permissions('CREAR_REGISTROS')
    @Post()
    @ApiOperation({
        summary: 'Crear un nueva autorización',
        description: 'Proceso que guarda los registros a la Nube'
    })
    async createAutorizacion(@Body() dto: CreateAutorizacionDto) {
        const result = await this.autorizacionesService.create(dto);
        return responseData({
            message: 'Autorización creada exitosamente'
        });
    }
    @Permissions('UPDATE_REGISTROS')
    @Post(':id')
    @ApiOperation({
        summary: 'Actualizar autorización',
        description: 'Registra los pagos de una autorización marcandola como PAGADA.(Fin del proceso)'
    })
    async updateAutorizacion(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateAutorizacionDto,
    ) {
        const result = await this.autorizacionesService.update(id, dto);
        return responseData({
            message: 'Autorización procesada'
        });
    }
    @Permissions('UPDATE_REGISTROS')
    @Post(':id/status')
    @ApiOperation({
        summary: 'Actualizar estado de autorización',
        description: 'Genera el bloqueo de pago de una autorización, marcandola como PROCESO(1), PENDIENTE(2) o RECHAZADO(3).'
    })
    async updateStatusAutorizacion(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateStatusAutorizacionDto,
    ) {
        const result = await this.autorizacionesService.updateStatus(id, dto);
        return responseData({
            message: 'Autorización procesada'
        });
    }

}
