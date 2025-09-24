# Этап 1: Установка зависимостей для кэширования
FROM node:24-alpine AS dependencies
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# ----------------------------------------------------------------

# Этап 2: Сборка production-версии приложения
FROM node:24-alpine AS builder
WORKDIR /usr/src/app
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY . .
RUN yarn build

# ----------------------------------------------------------------

# Этап 3: Финальный production-образ (минимальный и безопасный)
FROM node:24-alpine AS production
WORKDIR /usr/src/app
ENV NODE_ENV=production
# Копируем только необходимые артефакты
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json
EXPOSE ${HTTP_PORT}
CMD [ "node", "dist/main" ]

# ----------------------------------------------------------------

# Этап 4: Образ для разработки с hot-reload
FROM node:24-alpine AS development
WORKDIR /usr/src/app
# Используем уже установленные зависимости
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
# Копируем исходный код
COPY . .
EXPOSE ${HTTP_PORT}
# Команда для запуска в режиме разработки
CMD [ "yarn", "start:dev" ]