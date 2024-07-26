import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { version } from './../package.json'
import { INestApplication } from "@nestjs/common";


function addSwagger(app: INestApplication) {
    const config = new DocumentBuilder()
        .setTitle('Realt Notifier')
        .setDescription('Service to parse realt new notes')
        .setVersion(version)
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    addSwagger(app);

    await app.listen(4500);
}

bootstrap();
