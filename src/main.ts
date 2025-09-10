import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as process from 'node:process';

import { AppModule } from './app.module';
import { getCorsConfig, getLoggerConfig } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: getLoggerConfig(),
  });

  const config = app.get(ConfigService);
  const logger = new Logger('Bootstrap'); // Используем более конкретный контекст для логгера

  // Настройка CORS
  app.enableCors(getCorsConfig(config));

  // Включаем graceful shutdown
  app.enableShutdownHooks();

  // Устанавливаем глобальный префикс для всех роутов
  app.setGlobalPrefix('api/v1');

  // Применяем глобальный ValidationPipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Автоматически удаляет свойства, которых нет в DTO
      transform: true, // Автоматически преобразует payload к типам DTO
      forbidNonWhitelisted: true, // Запрещает запросы с лишними свойствами
      transformOptions: {
        enableImplicitConversion: true, // Включает неявное преобразование типов
      },
    }),
  );

  const port = config.getOrThrow<number>('HTTP_PORT');
  const host = config.getOrThrow<string>('HTTP_HOST');

  try {
    await app.listen(port, '0.0.0.0'); // Слушаем на всех интерфейсах

    logger.log(`🚀 Server is running on: ${host}:${port}`);
    logger.log(
      `✅ Application successfully started in ${process.env.NODE_ENV} mode`,
    );
  } catch (error) {
    logger.error('❌ Failed to start server', error.stack);
    process.exit(1);
  }
}

bootstrap();
