import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

// Определяем интерфейс для данных пользователя, которые мы будем хранить
export interface UserProfile {
    telegram_id: number;
    first_name: string;
    username: string | null;
    is_vip: boolean;
    level: number;
    xp: number;
    timezone: string;
    // Добавим недостающие поля из API ответа
    default_reminder_time: string; // В JSON время придет как строка
    pre_reminder_minutes: number;
    daily_digest_enabled: boolean;
    daily_digest_time: string; // В JSON время придет как строка
}

// Создаем "записываемое" (writable) хранилище
// Начальное значение null - пользователь не авторизован
export const user: Writable<UserProfile | null> = writable(null);
export const isAuthenticated: Writable<boolean> = writable(false);