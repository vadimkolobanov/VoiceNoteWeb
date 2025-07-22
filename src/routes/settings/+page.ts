import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const ssr = false;

export const load: PageLoad = async ({ fetch }) => {
    try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            throw redirect(307, '/login');
        }

        const response = await fetch('/api/v1/profile/me', {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
            if (response.status === 401) throw redirect(307, '/login');
            throw new Error('Failed to fetch profile');
        }

        const profile = await response.json();
        return {
            profile
        };
    } catch (e: any) {
        if (e.status === 307) throw e;
        return { error: e.message };
    }
};