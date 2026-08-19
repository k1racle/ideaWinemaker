# Запуск SQLite и админ-панели

## Локальная настройка

1. Скопировать нужные переменные из `.env.example` в `.env`.
2. Сгенерировать хеш пароля:

   ```bash
   npm run auth:hash -- "сложный пароль"
   ```

3. Скопировать всю полученную строку `NUXT_ADMIN_PASSWORD_HASH='...'` в `.env`. Одинарные кавычки обязательны: они сохраняют символы `$` внутри scrypt-хеша.
   Проверить соответствие пароля хешу можно локально:

   ```bash
   npm run auth:verify -- "ваш пароль"
   ```

4. Задать `NUXT_ADMIN_LOGIN` и случайный `NUXT_SESSION_PASSWORD` длиной не менее 32 символов.
5. Создать схему и импортировать существующие массивы:

   ```bash
   npm run db:setup
   ```

6. Запустить приложение:

   ```bash
   npm run dev
   ```

Админ-панель находится по адресу `/admin/login`.

## Production

- Приложение запускать как Node/Nitro server после `npm run build`, не через `npm run generate`.
- `NUXT_DATABASE_PATH` должен быть абсолютным путём на постоянном writable-диске.
- Команды `db:migrate`, `db:seed`, `db:setup`, `db:backup` и `db:generate` автоматически читают `.env` из корня проекта. Для другого файла передать `ENV_FILE=/etc/ideawinemaker.env`.
- Перед первым запуском выполнить `npm run db:setup`; повторный seed не создаёт дубликаты.
- Файл SQLite, его WAL-файлы и каталог с существующими изображениями должны входить в резервное копирование.
- Согласованную резервную копию SQLite можно создать командой `npm run db:backup`; каталог задаётся через `DATABASE_BACKUP_DIR`.
- Не менять `NUXT_SESSION_PASSWORD` без необходимости: это завершит текущие сессии.
- Не хранить `.env`, SQLite и резервные копии в Git.

## Docker Compose

1. Создать `.env` на основе `.env.example` и заполнить логин, хеш пароля и `NUXT_SESSION_PASSWORD`.
2. Собрать и запустить контейнер:

   ```bash
   docker compose up --build -d
   ```

3. Проверить состояние и логи:

   ```bash
   docker compose ps
   docker compose logs -f app
   ```

Сайт будет доступен на `http://localhost:3002`, админка — на `http://localhost:3002/admin/login`. Адрес и внешний порт можно изменить переменными `APP_HOST` и `APP_PORT`; для production с Nginx рекомендуется оставить `APP_HOST=127.0.0.1`.

Миграции запускаются при каждом старте контейнера. Seed по умолчанию также запускается повторно и безопасно пропускает существующие записи; отключить его можно через `RUN_DB_SEED=false`.

SQLite и резервные копии хранятся в Docker volume `ideawinemaker_data`. Обычная команда `docker compose down` сохраняет данные, а `docker compose down -v` удаляет volume вместе с базой. Создать согласованную резервную копию можно так:

```bash
docker compose exec app node scripts/backup-database.ts
```

После обновления исходников:

```bash
docker compose up --build -d
```

## Проверки

```bash
npm run typecheck
npm test
npm run build
```

Исходные массивы в `shared/mock/winemakers.ts`, `shared/mock/wines.ts`, `shared/mock/terroirs.ts` и массив магазинов в `shared/mock/commerce.ts` сохранены. Они нужны для первичного seed, но публичные страницы читают эти данные только из SQLite API. Массив партнёров из `commerce.ts` по-прежнему используется напрямую.
