import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		proxy: {
			// Проксируем все запросы, начинающиеся с /api
			'/api': {
				target: 'http://localhost:8000', // Адрес нашего FastAPI бэкенда
				changeOrigin: true // Необходимо для корректной работы прокси
			}
		}
	}
});