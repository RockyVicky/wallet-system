import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Wallet & Transaction API')
    .setDescription('The wallet management API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3001;
  const host = process.env.HOST || '0.0.0.0';
  await app.listen(port, host);
  logger.log(`Backend is running on: http://localhost:${port}`);
  logger.log(`Backend is listening on host: ${host}`);
  logger.log(`For network access, use your IP address on port ${port}`);
}
bootstrap();
