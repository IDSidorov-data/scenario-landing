// [NEW] server-only, НЕ импортировать в клиентский код
import { createClient } from '@supabase/supabase-js';

/**
 * Фабрика для создания серверного клиента Supabase.
 * Гарантирует, что SUPABASE_KEY (service_role) не попадет в клиентский бандл.
 * @returns {SupabaseClient | null} - Возвращает инстанс клиента или null, если переменные окружения не заданы в dev-режиме.
 * @throws {Error} - Бросает ошибку, если переменные отсутствуют в production.
 */
export function getSupabaseServerClient() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_KEY;

    if (!url || !key) {
        if (process.env.NODE_ENV === 'production') {
            throw new Error('SUPABASE_URL or SUPABASE_KEY are not set in the production environment.');
        }
        // В dev-режиме возвращаем null, чтобы API мог работать в MOCK-режиме.
        return null;
    }

    // persistSession: false - важно для серверных окружений, где нет долгоживущих сессий.
    return createClient(url, key, { auth: { persistSession: false } });
}