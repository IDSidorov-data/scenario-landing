import { NextResponse } from 'next/server';
import * as Sentry from "@sentry/nextjs";
import { getSupabaseServerClient } from '@/lib/serverSupabase';
import { leadSchema } from '@/lib/schemas';

/**
 * Усиленная функция проверки reCAPTCHA с таймаутом и безопасной отправкой данных.
 * @param {string} token - Токен от клиента reCAPTCHA.
 * @returns {Promise<boolean>} - true, если проверка пройдена.
 */
async function verifyRecaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      console.error('RECAPTCHA_SECRET is not set in production. Rejecting request.');
      return false; // fail-closed: в продакшене без ключа запросы отклоняются
    }
    console.warn('RECAPTCHA_SECRET is not set. Allowing request in development (MOCK).');
    return true;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000); // 3 секунды таймаут

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret, response: token }), // Безопасное кодирование
      signal: controller.signal,
    });

    if (!response.ok) {
      console.error(`reCAPTCHA verification failed with status: ${response.status}`);
      return false;
    }

    const data = await response.json();
    const score = data.score ?? 0;
    const threshold = parseFloat(process.env.RECAPTCHA_SCORE_THRESHOLD ?? '0.5');
    return !!data.success && score >= threshold;
  } catch (error) {
    console.error('reCAPTCHA verification request error:', error);
    return process.env.NODE_ENV !== 'production';
  } finally {
    clearTimeout(timeout); // Гарантированная очистка таймаута
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const recaptchaVerified = await verifyRecaptcha(body.recaptchaToken);
    if (!recaptchaVerified) {
      return NextResponse.json({ ok: false, error: 'Проверка на робота не пройдена.' }, { status: 403 });
    }

    const validation = leadSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ ok: false, error: validation.error.errors[0].message }, { status: 400 });
    }

    const { email, message, preset } = validation.data;

    const supabase = getSupabaseServerClient();

    if (supabase) {
      const { data, error } = await supabase
        .from('leads')
        .insert([{ email, message, preset, source: 'landing_cta' }])
        .select()
        .single();

      if (error) {
        throw new Error(`Supabase error: ${error.message}`);
      }
      return NextResponse.json({ ok: true, id: data.id }, { status: 200 });
    } else {
      console.log(`[MOCK] Lead saved: { email: ${email}, message: "${message}", preset: "${preset}" }`);
      const mockId = `mock-lead-${Date.now()}`;
      return NextResponse.json({ ok: true, id: mockId }, { status: 200 });
    }

  } catch (error) {
    Sentry.captureException(error);
    console.error('API Error:', error);
    return NextResponse.json({ ok: false, error: 'Произошла внутренняя ошибка сервера.' }, { status: 500 });
  }
}