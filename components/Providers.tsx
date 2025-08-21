// [NEW] FIX: Создан специальный клиентский компонент для всех провайдеров.
'use client';

import { Toaster } from 'react-hot-toast';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

export function Providers({ children }: { children: React.ReactNode }) {
  const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  return (
    <GoogleReCaptchaProvider reCaptchaKey={recaptchaKey || 'mock_key_for_dev'}>
      {children}
      <Toaster position="bottom-right" />
    </GoogleReCaptchaProvider>
  );
}