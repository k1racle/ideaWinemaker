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

## Проверки

```bash
npm run typecheck
npm test
npm run build
```

Исходные массивы в `shared/mock/winemakers.ts`, `shared/mock/wines.ts`, `shared/mock/terroirs.ts` и массив магазинов в `shared/mock/commerce.ts` сохранены. Они нужны для первичного seed, но публичные страницы читают эти данные только из SQLite API. Массив партнёров из `commerce.ts` по-прежнему используется напрямую.
