import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './exception-base/exception-filter/global-exception-filter';
import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

dotenv.config({
  path: `${process.cwd()}/src/.env`,
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
    methods: '*',
  });
  const options = new DocumentBuilder()
    .setTitle('Expense Tracker API')
    .setDescription('The document for Expense Tracker API')
    .setVersion('1.0')
    .addServer(process.env.APP_DOMAIN)
    .addTag('Expense Tracker API')
    .addBearerAuth()
    .build();

  const document: OpenAPIObject = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('expense-tracker', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (error) => new BadRequestException(error),
    }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.listen(process.env.PORT, () => {
    const logger = new Logger();
    logger.log(`Server running on port: ${process.env.PORT}`);
  });
}

bootstrap();
