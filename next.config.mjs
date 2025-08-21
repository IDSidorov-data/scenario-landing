// [MODIFIED] FIX: Добавлена опция для автоматического удаления source maps после загрузки в Sentry.
import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default withSentryConfig(
  nextConfig,
  {
    silent: true,
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
  },
  {
    widenClientFileUpload: true,
    hideSourceMaps: true,
    disableLogger: true,
    automaticVercelMonitors: true,
    // FIX: Добавлена опция для удаления source maps из публичного доступа после загрузки.
    sourcemaps: {
      deleteSourcemapsAfterUpload: true,
    },
  }
);