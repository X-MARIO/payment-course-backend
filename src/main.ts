import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import * as hpp from 'hpp';
import * as process from 'node:process';

import { AppModule } from './app.module';
import { getCorsConfig, getLoggerConfig, setupSwagger } from './config';

// import { PrismaService } from './prisma/prisma.service'; // Раскомментируйте, когда будет PrismaService

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: getLoggerConfig(),
  });

  const config = app.get(ConfigService);
  const logger = new Logger('Bootstrap'); // Используем более конкретный контекст для логгера

  // Устанавливает HTTP-заголовки для защиты от веб-уязвимостей
  app.use(helmet());
  // Сжимает ответы сервера для улучшения производительности
  app.use(compression());
  // Парсит Cookie и предоставляет их в req.cookies
  app.use(cookieParser());

  // Защищает от HTTP Parameter Pollution
  app.use(hpp());

  // Включаем обработчики для Graceful Shutdown
  app.enableShutdownHooks();

  // Настройка CORS
  app.enableCors(getCorsConfig(config));

  // Включаем graceful shutdown
  app.enableShutdownHooks();
  // const prismaService = app.get(PrismaService); // Раскомментируйте для Prisma
  // await prismaService.enableShutdownHooks(app); // Раскомментируйте для Prisma

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

  // Настраиваем Swagger для документирования API, но только не в production
  if (process.env.NODE_ENV !== 'production') {
    setupSwagger(app);
  }

  const port = config.getOrThrow<number>('HTTP_PORT');
  const host = config.getOrThrow<string>('HTTP_HOST');

  try {
    await app.listen(port, '0.0.0.0'); // Слушаем на всех интерфейсах для работы в Docker

    logger.log(`🚀 Server is running on: ${host}`); // Выводим только host, port не выводим
    if (process.env.NODE_ENV !== 'production') {
      logger.log(`📚 Swagger docs available at: ${host}/api/docs`);
    }
    logger.log(
      `✅ Application successfully started in ${
        process.env.NODE_ENV || 'development'
      } mode`,
    );
  } catch (error) {
    // Проверяем, является ли ошибка экземпляром Error для безопасного доступа к свойствам
    if (error instanceof Error) {
      logger.error(`📄 Сообщение: ${error.message}`);
      // Безопасный доступ к свойству stack
      logger.error(`📄 Стек вызовов: ${error.stack}`);
    } else {
      // Логируем ошибку, если она не является объектом Error
      logger.error(`📄 Неизвестная ошибка: ${JSON.stringify(error)}`);
    }
    process.exit(1);
  }
}

void bootstrap();
