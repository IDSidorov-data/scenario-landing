import { test, expect } from '@playwright/test';

test('полный пользовательский сценарий на странице демо', async ({ page }) => {
  // Ожидание кастомного события
  const demoLoaded = page.evaluate(() => {
    return new Promise(resolve => {
      window.addEventListener('demo_loaded', (e: any) => {
        resolve(e.detail.preset);
      });
    });
  });

  // 1. Открыть страницу /demo
  await page.goto('/demo');
  await expect(page.locator('h1')).toHaveText('Демонстрация продукта');

  // 2. Кликнуть на пресет и дождаться загрузки iframe
  await page.getByRole('button', { name: 'Сценарий роста' }).click();
  const loadedPreset = await demoLoaded;
  expect(loadedPreset).toBe('growth');

  // 3. Заполнить форму
  await page.getByLabel('Email').fill('test.user@example.com');
  await page.getByLabel('Сообщение').fill('Это тестовый запрос демо.');

  // 4. Отметить согласие
  await page.getByLabel('Я согласен на обработку персональных данных').check();

  // 5. Отправить форму
  await page.getByRole('button', { name: 'Запросить демо' }).click();

  // 6. Ожидать текст успеха
  await expect(page.locator('role=status')).toHaveText('Спасибо! Мы скоро свяжемся с вами.');
});