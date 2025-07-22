import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const ssr = false; // Отключаем Server-Side Rendering

export const load: LayoutLoad = async ({ url, fetch }) => {
    // Этот код теперь будет выполняться ТОЛЬКО в браузере
    const token = localStorage.getItem('accessToken');
    const isLoginPage = url.pathname === '/login';

    if (!token && !isLoginPage) {
        // Если токена нет и мы не на странице логина, перенаправляем на логин
        throw redirect(307, '/login');
    }

    if (token && isLoginPage) {
        // Если токен есть и мы пытаемся зайти на страницу логина, перенаправляем на главную
        throw redirect(307, '/');
    }

    if (token) {
        // Если токен есть, пытаемся получить данные пользователя
        try {
            const response = await fetch('/api/v1/profile/me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.ok) {
                const userData = await response.json();
                // Возвращаем данные, чтобы они были доступны в +layout.svelte
                return { user: userData, isAuthenticated: true };
            } else {
                // Если токен невалидный (например, истек), удаляем его и редиректим на логин
                localStorage.removeItem('accessToken');
                if (!isLoginPage) throw redirect(307, '/login');
            }
        } catch (e) {
            console.error('Failed to fetch user profile:', e);
            localStorage.removeItem('accessToken');
            if (!isLoginPage) throw redirect(307, '/login');
        }
    }

    // Возвращаем пустой объект для публичных страниц (login)
    return { user: null, isAuthenticated: false };
};