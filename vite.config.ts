import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		proxy: {
			// Проксируем все запросы, начинающиеся с /api
			'/api': {
				target: 'https://dev.voicenote.ru',
				changeOrigin: true // Необходимо для корректной работы прокси
			}
		}
	}
});