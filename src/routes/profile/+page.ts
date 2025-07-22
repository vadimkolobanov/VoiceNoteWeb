import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
    try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            throw redirect(307, '/login');
        }

        // Параллельно запрашиваем профиль и достижения
        const profilePromise = fetch('/api/v1/profile/me', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const achievementsPromise = fetch('/api/v1/profile/me/achievements', {
            headers: { Authorization: `Bearer ${token}` }
        });

        const [profileResponse, achievementsResponse] = await Promise.all([
            profilePromise,
            achievementsPromise
        ]);

        if (!profileResponse.ok || !achievementsResponse.ok) {
            if (profileResponse.status === 401 || achievementsResponse.status === 401) {
                throw redirect(307, '/login');
            }
            throw new Error('Failed to fetch profile data');
        }

        const profile = await profileResponse.json();
        const achievements = await achievementsResponse.json();

        return {
            profile,
            achievements
        };
    } catch (e: any) {
        if (e.status === 307) throw e;
        console.error('Error fetching profile data:', e);
        return { error: e.message };
    }
};