import { Controller, Get, Param, ParseIntPipe, Body, Post } from '@nestjs/common';
import { AutorizacionesService } from './autorizaciones.service';
import { CreateAutorizacionDto } from './dto/create-autorizaciones.dto';
import { UpdateAutorizacionDto } from './dto/update-autorizaciones.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { responseData, responseNovo } from '../../common/filters/response.wrapper';

@ApiTags('Autorizaciones')
@Controller('autorizaciones')
export class AutorizacionesController {
    constructor(private autorizacionesService: AutorizacionesService) { }

    @Get(':cedula')
    @ApiOperation({ summary: 'Obtener autorización por Identificación' })
    async getAutorizacion(@Param('cedula') cedula: string) {
        const result = await this.autorizacionesService.findIdentify(cedula);
        if (result.length === 0) {
            return responseNovo(false, null, 'ORDEN DE SERVICIO WEB', 404, 'AUTORIZACIÓN NO ENCONTRADA');
        }
        return responseNovo(true, result, 'ORDEN DE SERVICIO WEB', 200, 'CORRECTO');
    }

    @Post()
    @ApiOperation({ summary: 'Crear un nueva autorización' })
    async createAutorizacion(@Body() dto: CreateAutorizacionDto) {
        const result = await this.autorizacionesService.create(dto);
        return responseData({
            message: 'Autorización creada exitosamente'
        });
    }
    @Post(':id')
    @ApiOperation({ summary: 'Actualizar autorización' })
    async updateAutorizacion(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateAutorizacionDto,
    ) {
        const result = await this.autorizacionesService.update(id, dto);
        return responseData({
            message: 'Autorización procesada'
        });
    }

}
