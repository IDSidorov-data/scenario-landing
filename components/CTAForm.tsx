// [MODIFIED]
"use client";

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import toast from 'react-hot-toast';
import { leadSchema, LeadSchema } from '@/lib/schemas';

type CTAFormProps = {
  preset?: string;
};

export default function CTAForm({ preset = 'default' }: CTAFormProps) {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const { register, handleSubmit, formState: { errors, isSubmitting, isValid } } = useForm<LeadSchema>({
    resolver: zodResolver(leadSchema),
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<LeadSchema> = async (data) => {
    if (!executeRecaptcha) {
      toast.error("reCAPTCHA не загрузилась. Попробуйте обновить страницу.");
      return;
    }

    const loadingToast = toast.loading('Отправка...');

    try {
      const recaptchaToken = await executeRecaptcha('lead_form');

      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, preset, recaptchaToken }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Произошла ошибка при отправке.');
      }

      toast.success('Спасибо! Мы скоро свяжемся с вами.', { id: loadingToast });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Неизвестная ошибка.';
      toast.error(`Ошибка: ${message}`, { id: loadingToast });
    }
  };

  return (
    <div className="mx-auto max-w-xl lg:max-w-2xl text-center">
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Готовы начать?</h2>
      <p className="mt-4 text-lg leading-8 text-gray-600">
        Запросите демо-версию или начните бесплатный пробный период уже сегодня.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-y-4 max-w-md mx-auto text-left">
        <div>
          <label htmlFor="email-address" className="sr-only">Email</label>
          <input id="email-address" type="email" autoComplete="email" placeholder="Введите ваш email" {...register('email')} className="min-w-0 w-full flex-auto rounded-md border-0 bg-gray-900/5 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-900/10 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6" />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="message" className="sr-only">Сообщение</label>
          <textarea id="message" rows={3} placeholder="Ваше сообщение (необязательно)" {...register('message')} className="min-w-0 w-full flex-auto rounded-md border-0 bg-gray-900/5 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-900/10 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6" />
        </div>
        <div className="flex items-start gap-x-3">
          <div className="flex h-6 items-center">
            <input id="consent" type="checkbox" {...register('consent')} className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-600" />
          </div>
          <div className="text-sm leading-6">
            <label htmlFor="consent" className="block text-gray-700">Я согласен на обработку персональных данных</label>
            {errors.consent && <p className="mt-1 text-red-600">{errors.consent.message}</p>}
          </div>
        </div>
        <button type="submit" disabled={!isValid || isSubmitting} className="flex-none rounded-md bg-brand-accent px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-cyan-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 disabled:bg-gray-400 disabled:cursor-not-allowed">
          {isSubmitting ? 'Отправка...' : 'Запросить демо'}
        </button>
      </form>
    </div>
  );
}