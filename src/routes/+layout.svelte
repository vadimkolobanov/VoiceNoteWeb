<script lang="ts">
	import { goto } from '$app/navigation';
	import type { LayoutData } from './$types';
	import { user, isAuthenticated } from '../stores/auth';
	import '../app.css';
	import Button from '$lib/components/ui/button/button.svelte';
	import { LogOut, BotMessageSquare, Menu, X } from 'lucide-svelte';
	import { page } from '$app/stores';

	export let data: LayoutData;
	let mobileMenuOpen = false;

	$: {
		if (data.user) {
			user.set(data.user);
			isAuthenticated.set(true);
		} else {
			user.set(null);
			isAuthenticated.set(false);
		}
	}

	function handleLogout() {
		localStorage.removeItem('accessToken');
		user.set(null);
		isAuthenticated.set(false);
		// Прямой редирект на страницу логина
		goto('/login');
	}

	// Закрываем мобильное меню при переходе на другую страницу
	$: $page.url.pathname, (mobileMenuOpen = false);
</script>

<div class="min-h-screen bg-gray-50 text-gray-900 antialiased">
	{#if $isAuthenticated}
		<header class="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-lg">
			<!-- Увеличиваем высоту хедера (h-16 -> h-20) и отступы (container) -->
			<div class="container flex h-20 items-center max-w-7xl">
				<a href="/" class="mr-8 flex items-center space-x-3">
					<BotMessageSquare class="h-8 w-8 text-primary" />
					<!-- Увеличиваем шрифт логотипа (text-lg -> text-xl) -->
					<span class="font-bold text-xl">VoiceNote AI</span>
				</a>
				<!-- Увеличиваем шрифт и отступы в навигации (text-sm -> text-base, gap-6 -> gap-8) -->
				<nav class="hidden items-center gap-8 text-base font-medium md:flex">
					<a href="/notes" class="text-foreground/70 transition-colors hover:text-foreground">Заметки</a>
					<a href="/birthdays" class="text-foreground/70 transition-colors hover:text-foreground">Дни рождения</a>
					<a href="/shopping-list" class="text-foreground/70 transition-colors hover:text-foreground">Покупки</a>
					<a href="/profile" class="text-foreground/70 transition-colors hover:text-foreground">Профиль</a>
				</nav>
				<div class="flex flex-1 items-center justify-end space-x-4">
					<!-- Увеличиваем шрифт приветствия (text-sm -> text-base) -->
					<span class="text-base text-muted-foreground hidden sm:inline"
					>Привет, {$user?.first_name}!</span
					>
					<!-- Увеличиваем размер кнопки (size="sm" -> size="default") -->
					<Button on:click={handleLogout} variant="ghost" size="default" class="hidden md:flex">
						<LogOut class="h-4 w-4 mr-2" />
						Выйти
					</Button>
					<Button
							on:click={() => (mobileMenuOpen = !mobileMenuOpen)}
							variant="ghost"
							size="icon"
							class="md:hidden"
					>
						{#if mobileMenuOpen}
							<X class="h-6 w-6" />
						{:else}
							<Menu class="h-6 w-6" />
						{/if}
					</Button>
				</div>
			</div>

			<!-- Мобильное меню (увеличиваем шрифты) -->
			{#if mobileMenuOpen}
				<div class="md:hidden absolute top-20 left-0 w-full bg-white shadow-lg p-4">
					<nav class="flex flex-col gap-4 text-lg">
						<a href="/notes" class="py-2 border-b">Заметки</a>
						<a href="/birthdays" class="py-2 border-b">Дни рождения</a>
						<a href="/shopping-list" class="py-2 border-b">Покупки</a>
						<a href="/profile" class="py-2 border-b">Профиль</a>
						<Button on:click={handleLogout} variant="destructive" size="lg" class="w-full mt-4">
							<LogOut class="h-5 w-5 mr-2" />
							Выйти
						</Button>
					</nav>
				</div>
			{/if}
		</header>
	{/if}

	<main class="container max-w-7xl py-8">
		<slot />
	</main>
</div>