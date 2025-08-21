// FIX: Создан общий модуль для схемы Zod, чтобы избежать дублирования логики валидации.
import { z } from 'zod';

export const leadSchema = z.object({
  email: z.string().email({ message: "Неверный формат email адреса." }),
  message: z.string().optional(),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Необходимо дать согласие." }),
  }),
  preset: z.string().optional(),
  recaptchaToken: z.string().optional(),
});

export type LeadSchema = z.infer<typeof leadSchema>;
