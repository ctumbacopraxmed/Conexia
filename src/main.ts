import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const server = app.getHttpAdapter().getInstance();

  server.set('trust proxy', 1);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  const config = new DocumentBuilder()
    .setTitle('Mi API')
    .setDescription('API Data Conexia 2026-04-21')
    .setVersion('v1.5')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      tagsSorter: (a, b) => {
        const order = ['Autorizaciones', 'Auth', 'Roles', 'Users'];
        return order.indexOf(a) - order.indexOf(b);
      },
    },
  });
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
