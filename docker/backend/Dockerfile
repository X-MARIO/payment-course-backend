# Этап 1: Установка зависимостей для кэширования
FROM node:22-alpine AS dependencies
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# ----------------------------------------------------------------

# Этап 2: Сборка production-версии приложения
FROM node:22-alpine AS builder
WORKDIR /usr/src/app
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY . .
RUN yarn build

# ----------------------------------------------------------------

# Этап 3: Финальный production-образ (МАКСИМАЛЬНО безопасный)
# Используем distroless образ, содержащий только Node.js
FROM gcr.io/distroless/nodejs22-debian12 AS production
WORKDIR /app
ENV NODE_ENV=production

# Создаем непривилегированного пользователя. В distroless он уже есть, но мы явно его указываем.
USER nonroot

# Копируем production-зависимости и скомпилированный код
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 4000
# CMD должен быть в формате exec, чтобы правильно обрабатывать сигналы ОС
CMD ["dist/main.js"]

# ----------------------------------------------------------------

# Этап 4: Образ для разработки с hot-reload
FROM node:22-alpine AS development
WORKDIR /usr/src/app

# Создаем непривилегированного пользователя и группу
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Используем уже установленные зависимости и выставляем права
COPY --from=dependencies --chown=appuser:appgroup /usr/src/app/node_modules ./node_modules
# Копируем исходный код и выставляем права
COPY --chown=appuser:appgroup . .

# Переключаемся на непривилегированного пользователя
USER appuser

EXPOSE ${HTTP_PORT}
# Команда для запуска в режиме разработки
CMD [ "yarn", "start:dev" ]