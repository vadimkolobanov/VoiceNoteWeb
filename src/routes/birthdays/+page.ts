import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, url }) => {
    const page = url.searchParams.get('page') || '1';

    try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            throw redirect(307, '/login');
        }

        const response = await fetch(`/api/v1/birthdays?page=${page}&per_page=10`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            if (response.status === 401) throw redirect(307, '/login');
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to fetch birthdays');
        }

        const birthdaysData = await response.json();
        return {
            birthdays: birthdaysData.items,
            pagination: {
                page: birthdaysData.page,
                perPage: birthdaysData.per_page,
                total: birthdaysData.total,
                totalPages: birthdaysData.total_pages
            }
        };
    } catch (e: any) {
        if (e.status === 307) throw e;
        console.error('Error fetching birthdays:', e);
        return { error: e.message, birthdays: [], pagination: {} };
    }
};