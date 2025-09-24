FROM postgres:16.3-alpine

# Копируем скрипты для инициализации (если понадобятся в будущем)
# COPY ./init.sql /docker-entrypoint-initdb.d/

# Копируем наши ужесточенные конфигурации
COPY postgresql.conf /etc/postgresql/postgresql.conf
COPY pg_hba.conf /etc/postgresql/pg_hba.conf

# Запускаем PostgreSQL с нашей конфигурацией
CMD ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf", "-c", "hba_file=/etc/postgresql/pg_hba.conf"]