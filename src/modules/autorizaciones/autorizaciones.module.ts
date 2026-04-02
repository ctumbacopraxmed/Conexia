import { Module } from '@nestjs/common';
import { AutorizacionesController } from './autorizaciones.controller';
import { AutorizacionesService } from './autorizaciones.service';
import { AutorizacionesRepository } from './autorizaciones.repository';

@Module({
    controllers: [AutorizacionesController],
    providers: [AutorizacionesService, AutorizacionesRepository],
    exports: [AutorizacionesService, AutorizacionesRepository]
})
export class AutorizacionesModule { }
