import { Module } from '@nestjs/common';
import { AutorizacionesController } from './autorizaciones.controller';
import { AutorizacionesService } from './autorizaciones.service';
import { AutorizacionesRepository } from './autorizaciones.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
    controllers: [AutorizacionesController],
    providers: [AutorizacionesService, AutorizacionesRepository],
    exports: [AutorizacionesService, AutorizacionesRepository],
    imports: [AuthModule],
})
export class AutorizacionesModule { }
