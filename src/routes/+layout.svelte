<script lang="ts">
	import { page } from '$app/stores';
	import { user, isAuthenticated } from '$lib/stores/auth';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import '$lib/styles/app.css';

	export let data;

	let mobileMenuOpen = false;

	$: if (data.user) {
		user.set(data.user);
		isAuthenticated.set(true);
	} else {
		user.set(null);
		isAuthenticated.set(false);
	}

	function handleLogout() {
		if (browser) {
			localStorage.removeItem('accessToken');
			user.set(null);
			isAuthenticated.set(false);
			goto('/login');
		}
	}

	$: if ($page.url.pathname) {
		mobileMenuOpen = false;
	}
</script>

{#if $isAuthenticated}
	<div class="flex h-screen w-full flex-col">
		<header
				class="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-card/80 px-4 backdrop-blur-md sm:px-6"
		>
			<a href="/" class="flex items-center gap-2 font-semibold">
				<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="h-6 w-6 text-primary"
						aria-hidden="true"
				>
					<path
							d="M12 2a3.5 3.5 0 0 0-3.5 3.5v1.07A4.5 4.5 0 0 0 5 10.5V14a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5a4.5 4.5 0 0 0-3.5-4.43V5.5A3.5 3.5 0 0 0 12 2z"
					/>
					<path d="M8 15v1a4 4 0 0 0 8 0v-1" />
				</svg>
				<span class="hidden sm:inline-block text-lg">VoiceNote</span>
			</a>
			<nav
					class="hidden flex-col gap-1 rounded-lg bg-secondary p-1 font-medium md:flex md:flex-row md:items-center text-base"
			>
				<a
						href="/notes"
						class="px-4 py-1.5 rounded-md transition-colors"
						class:bg-background={$page.url.pathname.startsWith('/notes')}
						class:hover:bg-muted={!$page.url.pathname.startsWith('/notes')}>Заметки</a
				>
				<a
						href="/birthdays"
						class="px-4 py-1.5 rounded-md transition-colors"
						class:bg-background={$page.url.pathname.startsWith('/birthdays')}
						class:hover:bg-muted={!$page.url.pathname.startsWith('/birthdays')}>Дни рождения</a
				>
				<a
						href="/shopping-list"
						class="px-4 py-1.5 rounded-md transition-colors"
						class:bg-background={$page.url.pathname.startsWith('/shopping-list')}
						class:hover:bg-muted={!$page.url.pathname.startsWith('/shopping-list')}>Покупки</a
				>
				<!-- ИСПРАВЛЕНИЕ 1: ДОБАВЛЕНА ССЫЛКА -->
				<a
						href="/settings"
						class="px-4 py-1.5 rounded-md transition-colors"
						class:bg-background={$page.url.pathname.startsWith('/settings')}
						class:hover:bg-muted={!$page.url.pathname.startsWith('/settings')}>Настройки</a
				>
			</nav>

			<div class="ml-auto"></div>

			<div class="flex items-center gap-3">
				<a
						href="/profile"
						class="relative flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-primary to-purple-600 text-primary-foreground hover:opacity-90 transition-opacity"
						aria-label="Профиль"
				>
					<span class="font-bold text-lg">{($user?.first_name || 'U').charAt(0)}</span>
				</a>
				<button
						on:click={handleLogout}
						class="hidden sm:flex items-center justify-center h-10 w-10 rounded-full bg-secondary text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
						aria-label="Выйти"
				>
					<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"
					><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline
							points="16 17 21 12 16 7"
					/><line x1="21" y1="12" x2="9" y2="12" /></svg
					>
				</button>
			</div>

			<button on:click={() => (mobileMenuOpen = !mobileMenuOpen)} class="p-2 sm:hidden" aria-label="Открыть меню">
				{#if mobileMenuOpen}
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
				{:else}
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
				{/if}
			</button>
		</header>

		{#if mobileMenuOpen}
			<div class="sm:hidden border-b bg-card">
				<nav class="grid gap-2 p-4 text-lg font-medium">
					<a href="/notes" class="flex items-center gap-4 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground">Заметки</a>
					<a href="/birthdays" class="flex items-center gap-4 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground">Дни рождения</a>
					<a href="/shopping-list" class="flex items-center gap-4 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground">Покупки</a>
					<a href="/profile" class="flex items-center gap-4 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground">Профиль</a>
					<a href="/settings" class="flex items-center gap-4 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground">Настройки</a>
					<button on:click={handleLogout} class="flex items-center gap-4 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground text-left">Выйти</button>
				</nav>
			</div>
		{/if}

		<div class="flex-1 overflow-auto">
			<main class="container mx-auto max-w-7xl p-4 sm:px-6 md:py-8">
				<slot />
			</main>
		</div>

		<footer class="mt-auto border-t bg-card/80 p-4 text-center text-xs text-muted-foreground">
			<div class="container mx-auto flex flex-wrap justify-center gap-x-6 gap-y-2">
				<a href="https://voicenote.ru" target="_blank" rel="noopener noreferrer" class="hover:text-primary transition-colors">voicenote.ru</a>
				<a href="https://t.me/voicenote_news" target="_blank" rel="noopener noreferrer" class="hover:text-primary transition-colors">Канал новостей</a>
				<a href="https://t.me/tgnote_by_bot" target="_blank" rel="noopener noreferrer" class="hover:text-primary transition-colors">Открыть бота</a>
			</div>
		</footer>
	</div>
{:else}
	<slot />
{/if}