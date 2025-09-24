# docker/postgres/Dockerfile
FROM postgres:16-alpine

# Копируем кастомные конфигурационные файлы для повышения безопасности
# Эти файлы ужесточают правила аутентификации и подключений к БД
COPY postgresql.conf /etc/postgresql/postgresql.conf
COPY pg_hba.conf /etc/postgresql/pg_hba.conf

# Запускаем PostgreSQL с нашими безопасными конфигурационными файлами
CMD ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf", "-c", "hba_file=/etc/postgresql/pg_hba.conf"]