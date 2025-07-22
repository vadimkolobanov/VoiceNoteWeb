<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let code = '';
	let isLoading = false;
	let errorMessage = '';

	onMount(() => {
		if (localStorage.getItem('accessToken')) {
			goto('/');
		}
	});

	async function handleSubmit() {
		if (!browser) return;
		isLoading = true;
		errorMessage = '';
		try {
			const response = await fetch('/api/v1/auth/code', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ code })
			});
			if (response.ok) {
				const data = await response.json();
				localStorage.setItem('accessToken', data.access_token);
				window.location.href = '/'; // Полная перезагрузка для обновления layout
			} else {
				const errorData = await response.json();
				errorMessage = errorData.detail || 'Произошла ошибка';
			}
		} catch (e) {
			errorMessage = 'Сетевая ошибка. Проверьте подключение.';
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-background p-4">
	<div class="w-full max-w-md space-y-8">
		<div class="text-center">
			<svg
					xmlns="http://www.w3.org/2000/svg"
					width="48"
					height="48"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="mx-auto h-12 w-12 text-primary"
			>
				<path
						d="M12 2a3.5 3.5 0 0 0-3.5 3.5v1.07A4.5 4.5 0 0 0 5 10.5V14a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5a4.5 4.5 0 0 0-3.5-4.43V5.5A3.5 3.5 0 0 0 12 2z"
				/>
				<path d="M8 15v1a4 4 0 0 0 8 0v-1" />
			</svg>
			<h1 class="mt-6 text-3xl font-bold tracking-tight text-foreground">Вход в VoiceNote AI</h1>
			<p class="mt-2 text-muted-foreground">
				Введите 6-значный код, который вы получили от бота в Telegram.
			</p>
		</div>
		<form class="space-y-6" on:submit|preventDefault={handleSubmit}>
			<div>
				<label for="code" class="sr-only">Код активации</label>
				<input
						id="code"
						name="code"
						type="text"
						bind:value={code}
						required
						class="relative block w-full appearance-none rounded-md border border-border bg-input px-3 py-3 text-foreground placeholder-muted-foreground focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
						placeholder="ABC-123"
						on:input={() => (errorMessage = '')}
				/>
			</div>

			{#if errorMessage}
				<p class="text-sm text-destructive">{errorMessage}</p>
			{/if}

			<div>
				<button
						type="submit"
						disabled={isLoading}
						class="group relative flex w-full justify-center rounded-md bg-primary px-3 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
				>
					{isLoading ? 'Проверка...' : 'Войти'}
				</button>
			</div>
		</form>
		<div class="text-center text-sm text-muted-foreground">
			<p>
				Нет кода? Откройте
				<a href="https://t.me/tgnote_by_bot" target="_blank" class="font-medium text-primary hover:underline">бота в Telegram</a>
				и отправьте команду <code class="bg-secondary p-1 rounded-sm">/code</code>.
			</p>
		</div>
	</div>
</div>