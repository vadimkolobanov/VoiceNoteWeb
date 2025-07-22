# --- Этап 1: Сборка приложения ---
# Используем официальный образ Node.js (выберите LTS-версию, например 20)
FROM node:20-alpine AS builder

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все остальные файлы проекта
COPY . .

# Собираем приложение в продакшен-режиме
RUN npm run build


# --- Этап 2: Запуск приложения ---
# Используем тот же базовый образ для уменьшения размера
FROM node:20-alpine

WORKDIR /app

# Копируем только необходимые для запуска файлы из этапа сборки
# Это папка build, package.json и node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Указываем порт, на котором будет работать приложение внутри контейнера
EXPOSE 3000

# Указываем переменную окружения для SvelteKit, чтобы он слушал все адреса
ENV HOST=0.0.0.0 PORT=3000

# Команда для запуска нашего Node.js сервера
CMD [ "node", "build/index.js" ]