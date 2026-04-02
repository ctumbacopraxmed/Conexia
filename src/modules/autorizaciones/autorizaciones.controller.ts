import { Controller, Get, Param, ParseIntPipe, Body, Post } from '@nestjs/common';
import { AutorizacionesService } from './autorizaciones.service';
import { CreateAutorizacionDto } from './dto/create-autorizaciones.dto';
import {
    ApiTags,
    ApiOperation,
    ApiBearerAuth
} from '@nestjs/swagger';
import { responseData } from '../../common/filters/response.wrapper';

@ApiTags('Autorizaciones')
@Controller('autorizaciones')
export class AutorizacionesController {
    constructor(private autorizacionesService: AutorizacionesService) { }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener autorización por ID' })
    async getAutorizacion(@Param('id', ParseIntPipe) id: number) {
        const result = await this.autorizacionesService.findOne(id);
        return responseData(result);
    }

    @Post()
    @ApiOperation({ summary: 'Crear un nueva autorización' })
    async createAutorizacion(@Body() dto: CreateAutorizacionDto) {
        const result = await this.autorizacionesService.create(dto);
        return responseData({
            message: 'Autorización creada exitosamente'
        });
    }

}
