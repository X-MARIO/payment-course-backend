import { LogLevel } from '@nestjs/common/services/logger.service';

/**
 * Возвращает конфигурацию уровней логирования в зависимости от окружения.
 * @returns Массив уровней логов для NestJS.
 */
export const getLoggerConfig = (): LogLevel[] => {
  return process.env.NODE_ENV === 'production'
    ? ['log', 'warn', 'error']
    : ['log', 'error', 'warn', 'debug', 'verbose'];
};
