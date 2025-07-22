// src/routes/notes/[note_id]/+page.ts
import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const ssr = false; // Работаем только в браузере

export const load: PageLoad = async ({ params, fetch }) => {
    if (!browser) {
        return { note: null };
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
        throw redirect(307, '/login');
    }

    const noteId = params.id; // Используем note_id, как в имени папки

    try {
        const response = await fetch(`/api/v1/notes/${noteId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.ok) {
            const noteData = await response.json();
            return {
                note: noteData,
                apiError: null
            };
        } else {
            if (response.status === 401) {
                throw redirect(307, '/login');
            }
            const errorData = await response.json();
            return {
                note: null,
                apiError: errorData.detail || 'Не удалось загрузить заметку.'
            };
        }
    } catch (e: any) {
        console.error('Failed to load note:', e);
        if (e.status === 307) throw e;
        return {
            note: null,
            apiError: 'Произошла сетевая ошибка. Попробуйте снова.'
        };
    }
};