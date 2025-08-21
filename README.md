# Scenario Landing Page

Финансовый симулятор "Scenario" для принятия взвешенных бизнес-решений.

## Локальный запуск

1.  **Установка зависимостей:**
    ```bash
    npm install
    ```

2.  **Создание файла окружения:**
    Создайте файл `.env.local` в корне проекта и добавьте необходимые переменные.

3.  **Запуск dev-сервера:**
    ```bash
    npm run dev
    ```
    Проект будет доступен по адресу `http://localhost:3000`.

## Переменные окружения (Environment Variables)

-   `NEXT_PUBLIC_APP_URL`
    -   **Описание:** Полный публичный URL вашего приложения. Используется для SEO.
    -   **Пример:** `NEXT_PUBLIC_APP_URL=http://localhost:3000`

-   `NEXT_PUBLIC_STREAMLIT_URL`
    -   **Описание:** URL для iframe с демонстрацией Streamlit.
    -   **Пример:** `NEXT_PUBLIC_STREAMLIT_URL=https://demo-scenario.streamlit.app`

-   `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
    -   **Описание:** Публичный ключ Google reCAPTCHA v3.
    -   **Пример:** `NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key`

-   `RECAPTCHA_SECRET`
    -   **Описание:** Секретный ключ Google reCAPTCHA v3 для серверной валидации.
    -   **Пример:** `RECAPTCHA_SECRET=your_secret_key`

-   `SUPABASE_URL` (опционально)
    -   **Описание:** URL вашего проекта Supabase для сохранения лидов.
    -   **Пример:** `SUPABASE_URL=https://xyz.supabase.co`

-   `SUPABASE_KEY` (опционально)
    -   **Описание:** Сервисный (`service_role`) ключ вашего проекта Supabase.
    -   **Пример:** `SUPABASE_KEY=ey...`

-   `NEXT_PUBLIC_SENTRY_DSN` (опционально)
    -   **Описание:** DSN для интеграции с Sentry.
    -   **Пример:** `NEXT_PUBLIC_SENTRY_DSN=https://...`

-   `SENTRY_ORG` (опционально, для CI/CD)
    -   **Описание:** Название вашей организации в Sentry. Используется при сборке для загрузки source maps.
    -   **Пример:** `SENTRY_ORG=my-org`

-   `SENTRY_PROJECT` (опционально, для CI/CD)
    -   **Описание:** Название вашего проекта в Sentry.
    -   **Пример:** `SENTRY_PROJECT=scenario-landing`

-   `SENTRY_AUTH_TOKEN` (опционально, для CI/CD)
    -   **Описание:** Токен авторизации Sentry. Необходимо создать в настройках Sentry и добавить в секреты CI.
    -   **Пример:** `SENTRY_AUTH_TOKEN=...`

## Скрипты

-   `npm run dev`: Запуск сервера для разработки.
-   `npm run build`: Сборка производственной версии.
-   `npm run lint -- --fix`: Автоматическое исправление ошибок линтера.
-   `npm run test`: Запуск unit-тестов (Jest).
-   `npm run test:e2e`: Запуск end-to-end тестов (Playwright).
