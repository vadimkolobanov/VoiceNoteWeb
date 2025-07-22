import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, url }) => {
    const page = url.searchParams.get('page') || '1';
    const archived = url.searchParams.get('archived') === 'true';

    try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            throw redirect(307, '/login');
        }

        const response = await fetch(
            `/api/v1/notes?page=${page}&per_page=5&archived=${archived}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            if (response.status === 401) {
                throw redirect(307, '/login');
            }
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to fetch notes');
        }

        const notesData = await response.json();
        return {
            notes: notesData.items,
            pagination: {
                page: notesData.page,
                perPage: notesData.per_page,
                total: notesData.total,
                totalPages: notesData.total_pages
            },
            isArchived: archived
        };
    } catch (e: any) {
        if (e.status === 307) throw e; // Пробрасываем редирект дальше
        console.error('Error fetching notes:', e);
        return { error: e.message, notes: [], pagination: {} };
    }
};