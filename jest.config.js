// jest.config.js - ПРАВИЛЬНОЕ СОДЕРЖИМОЕ
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Укажите путь к вашему Next.js приложению для загрузки next.config.js и .env файлов в тестовой среде
  dir: './',
});

// Добавьте любую кастомную конфигурацию для Jest сюда
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  // Игнорируем папку с E2E тестами Playwright
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/tests/e2e/',
  ],
  moduleNameMapper: {
    // Обработка @/ псевдонимов
    '^@/(.*)$': '<rootDir>/$1',
  },
};

// createJestConfig обертывает вашу конфигурацию Next.js, чтобы Jest мог ее понять
module.exports = createJestConfig(customJestConfig);