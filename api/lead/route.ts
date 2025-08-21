// [MODIFIED]
import { NextResponse } from 'next/server';
import * as Sentry from "@sentry/nextjs";
import { supabase } from '@/lib/supabaseClient';
import { leadSchema } from '@/lib/schemas';

async function verifyRecaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET;
  if (!secret) {
    console.warn("RECAPTCHA_SECRET not set. Skipping verification (MOCK).");
    return true;
  }

  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${secret}&response=${token}`,
  });

  const data = await response.json();
  return data.success && data.score > 0.5;
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

    if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
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