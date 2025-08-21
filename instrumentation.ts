// [NEW] FIX: Перенос серверной инициализации Sentry в официальный instrumentation hook Next.js.
import * as Sentry from "@sentry/nextjs";

export function register() {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 1.0,
  });
}