<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import { BotMessageSquare, LoaderCircle } from 'lucide-svelte';

	let code = '';
	let isLoading = false;
	let errorMessage = '';

	async function handleLogin() {
		if (!code || code.length < 6) {
			errorMessage = 'Пожалуйста, введите 6-значный код.';
			return;
		}
		isLoading = true;
		errorMessage = '';

		try {
			await new Promise((res) => setTimeout(res, 500));

			const response = await fetch('/api/v1/auth/code', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ code: code.toUpperCase() })
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.detail || 'Неверный код или истек срок его действия.');
			}

			if (data.access_token) {
				localStorage.setItem('accessToken', data.access_token);
				window.location.href = '/';
			}
		} catch (error: any) {
			errorMessage = error.message;
			code = '';
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="flex items-center justify-center min-h-screen bg-gray-100 px-4">
	<div class="w-full max-w-md">
		<div class="text-center mb-6">
			<div class="inline-block bg-primary text-primary-foreground p-4 rounded-2xl mb-4">
				<BotMessageSquare class="h-10 w-10" />
			</div>
			<h1 class="text-3xl font-bold">Вход в VoiceNote AI</h1>
			<p class="text-muted-foreground mt-2">
				Введите 6-значный код, который вы получили от бота в Telegram.
			</p>
		</div>

		<Card.Root class="shadow-xl rounded-2xl">
			<Card.Content class="p-6">
				<form on:submit|preventDefault={handleLogin} class="space-y-6">
					<div>
						<label for="code-input" class="text-sm font-medium text-muted-foreground"
						>Код активации</label
						>
						<input
								id="code-input"
								type="text"
								bind:value={code}
								placeholder="••••••"
								maxlength="6"
								class="mt-1 flex h-14 w-full rounded-xl border border-input bg-background px-3 py-2 text-3xl ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-center tracking-[0.5em] uppercase"
								disabled={isLoading}
								on:input={() => (errorMessage = '')}
						/>
					</div>
					{#if errorMessage}
						<p class="text-sm font-medium text-destructive text-center">{errorMessage}</p>
					{/if}
					<Button type="submit" class="w-full h-12 text-lg" disabled={isLoading || code.length < 6}>
						{#if isLoading}
							<LoaderCircle class="mr-2 h-5 w-5 animate-spin" />
						{/if}
						Войти
					</Button>
				</form>
			</Card.Content>
		</Card.Root>
		<p class="px-8 text-center text-sm text-muted-foreground mt-6">
			Нет кода? Откройте
			<a href="https://t.me/YOUR_BOT_USERNAME_HERE" target="_blank" class="underline hover:text-primary">
				бота в Telegram
			</a>
			и отправьте команду <code>/code</code>.
		</p>
	</div>
</div>