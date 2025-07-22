<script lang="ts">
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import type { PageData } from './$types';

    export let data: PageData;

    let profile: typeof data.profile | null = null;
    let isLoading = false;
    let successMessage = '';
    let apiError = '';

    const timezones = {
        'Калининград (UTC+2)': 'Europe/Kaliningrad',
        'Москва (UTC+3)': 'Europe/Moscow',
        'Самара (UTC+4)': 'Europe/Samara',
        'Екатеринбург (UTC+5)': 'Asia/Yekaterinburg',
        'Омск (UTC+6)': 'Asia/Omsk',
        'Красноярск (UTC+7)': 'Asia/Krasnoyarsk',
        'Иркутск (UTC+8)': 'Asia/Irkutsk',
        'Якутск (UTC+9)': 'Asia/Yakutsk',
        'Владивосток (UTC+10)': 'Asia/Vladivostok',
        'Магадан (UTC+11)': 'Asia/Magadan',
        'Камчатка (UTC+12)': 'Asia/Kamchatka'
    };
    const digestTimes = ['05:00', '06:00', '07:00', '08:00', '09:00', '10:00'];

    onMount(() => {
        if (data.profile) {
            profile = { ...data.profile };
        }
    });

    async function handleSubmit() {
        if (!profile || !browser) return;
        isLoading = true;
        successMessage = '';
        apiError = '';

        const token = localStorage.getItem('accessToken');

        try {
            const response = await fetch('/api/v1/profile/me', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    timezone: profile.timezone,
                    daily_digest_enabled: profile.daily_digest_enabled,
                    daily_digest_time: profile.daily_digest_time
                })
            });

            if (response.ok) {
                successMessage = 'Настройки успешно сохранены!';
                setTimeout(() => (successMessage = ''), 3000);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Не удалось сохранить настройки.');
            }
        } catch (error: any) {
            apiError = error.message;
        } finally {
            isLoading = false;
        }
    }
</script>

<div class="mx-auto grid w-full max-w-6xl gap-2">
    <a
            href="/profile"
            class="text-sm text-muted-foreground hover:underline mb-4 inline-flex items-center gap-1"
    >
        <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg
        >
        Назад в профиль
    </a>
    <h1 class="text-3xl font-semibold">Настройки</h1>
</div>

<div
        class="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]"
>
    <nav class="grid gap-4 text-sm text-muted-foreground">
        <a href="#general" class="font-semibold text-primary">Основные</a>
    </nav>

    <div class="grid gap-6" id="general">
        <div class="rounded-lg border bg-card text-card-foreground p-6">
            <h2 class="text-xl font-semibold mb-2">Общие настройки</h2>
            <p class="text-muted-foreground mb-6">
                Здесь вы можете изменить основные параметры работы ассистента.
            </p>

            {#if profile}
                <form on:submit|preventDefault={handleSubmit} class="space-y-6">
                    <div>
                        <label for="timezone" class="block text-sm font-medium mb-1">Часовой пояс</label>
                        <p class="text-xs text-muted-foreground mb-2">
                            Важно для корректной работы напоминаний.
                        </p>
                        <select
                                id="timezone"
                                bind:value={profile.timezone}
                                class="mt-1 block w-full rounded-md border-border bg-input py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                        >
                            {#each Object.entries(timezones) as [name, value]}
                                <option {value}>{name}</option>
                            {/each}
                        </select>
                    </div>

                    {#if profile.is_vip}
                        <div class="border-t pt-6">
                            <h3 class="text-lg font-medium">Утренняя сводка (VIP)</h3>
                            <div class="flex items-center space-x-2 mt-4">
                                <input
                                        type="checkbox"
                                        id="digest-enabled"
                                        bind:checked={profile.daily_digest_enabled}
                                        class="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                                />
                                <label for="digest-enabled" class="text-sm font-medium"
                                >Получать утреннюю сводку</label
                                >
                            </div>
                            <p class="text-xs text-muted-foreground mt-1">
                                Ежедневный отчет о задачах и днях рождения.
                            </p>

                            {#if profile.daily_digest_enabled}
                                <div class="mt-4">
                                    <label for="digest-time" class="block text-sm font-medium mb-1"
                                    >Время получения сводки</label
                                    >
                                    <select
                                            id="digest-time"
                                            bind:value={profile.daily_digest_time}
                                            class="mt-1 block w-full rounded-md border-border bg-input py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                                    >
                                        {#each digestTimes as time}
                                            <option value={time}>{time}</option>
                                        {/each}
                                    </select>
                                </div>
                            {/if}
                        </div>
                    {/if}

                    <div class="flex justify-end items-center gap-4 pt-4">
                        {#if apiError}
                            <p class="text-sm text-destructive">{apiError}</p>
                        {/if}
                        {#if successMessage}
                            <p class="text-sm text-green-500">{successMessage}</p>
                        {/if}
                        <button
                                type="submit"
                                disabled={isLoading}
                                class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                        >
                            {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
                        </button>
                    </div>
                </form>
            {:else if data.error}
                <p class="text-red-500">Ошибка загрузки профиля: {data.error}</p>
            {:else}
                <p>Загрузка данных профиля...</p>
            {/if}
        </div>
    </div>
</div>