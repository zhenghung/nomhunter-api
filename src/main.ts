import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

    const config = app.get(ConfigService);

    // Swagger Generator
    const options = new DocumentBuilder()
        .setTitle('NomHunter API')
        .setDescription('NomHunter API documentation')
        .setVersion('3.0.3')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('/', app, document);

    const port: number = config.get<number>('http.port');
    await app.listen(port, '0.0.0.0');
    // eslint-disable-next-line no-console
    console.log(`Application is running on: ${await app.getUrl()}`);
}

void bootstrap();
