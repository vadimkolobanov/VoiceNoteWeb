<script lang="ts">
    import { onMount } from 'svelte';
    import type { PageData } from './$types';

    export let data: PageData;

    // Прогресс бар для XP
    function getProgress(xp: number, level: number): number {
        const xpForCurrentLevel = ((level - 1) ** 2) * 100;
        const xpForNextLevel = (level ** 2) * 100;
        const xpInCurrentLevel = xp - xpForCurrentLevel;
        const xpNeededForLevelUp = xpForNextLevel - xpForCurrentLevel;
        return Math.round((xpInCurrentLevel / xpNeededForLevelUp) * 100);
    }
</script>

<div class="space-y-8">
    {#if data.error}
        <p class="text-destructive">{data.error}</p>
    {:else if data.profile}
        <div>
            <h1 class="text-3xl font-bold">Ваш Профиль</h1>
            <p class="text-muted-foreground">Обзор вашего прогресса и достижений в VoiceNote AI.</p>
        </div>

        <div class="grid gap-8 md:grid-cols-3">
            <!-- Левая колонка: Профиль и Прогресс -->
            <div class="md:col-span-1 space-y-8">
                <div class="bg-card border rounded-lg p-6">
                    <div class="flex items-center gap-4">
                        <div
                                class="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-600 text-3xl font-bold text-primary-foreground"
                        >
                            {data.profile.first_name.charAt(0)}
                        </div>
                        <div>
                            <div class="flex items-center gap-2">
                                <h2 class="text-xl font-bold">{data.profile.first_name}</h2>
                                {#if data.profile.is_vip}
									<span
                                            class="rounded-full bg-yellow-400/20 px-2 py-0.5 text-xs font-semibold text-yellow-400"
                                    >VIP</span
                                    >
                                {/if}
                            </div>
                            <p class="text-sm text-muted-foreground">@{data.profile.username || 'N/A'}</p>
                        </div>
                    </div>
                    <a
                            href="/settings"
                            class="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-muted"
                    >Настройки</a
                    >
                </div>

                <div class="bg-card border rounded-lg p-6">
                    <h3 class="text-lg font-semibold mb-4">Прогресс</h3>
                    <div class="space-y-4">
                        <div class="flex justify-between text-sm">
                            <span class="font-medium">Уровень</span>
                            <span class="text-muted-foreground">{data.profile.level}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="font-medium">Опыт (XP)</span>
                            <span class="text-muted-foreground">{data.profile.xp}</span>
                        </div>
                        <div>
                            <div>
                                <div class="h-2 w-full rounded-full bg-secondary">
                                    <div
                                            class="h-2 rounded-full bg-primary"
                                            style="width: {getProgress(data.profile.xp, data.profile.level)}%;"
                                    /> <!-- <--- ВОТ ПРОБЛЕМА -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Правая колонка: Достижения -->
            <div class="md:col-span-2">
                <div class="bg-card border rounded-lg p-6">
                    <h3 class="text-lg font-semibold mb-4">Достижения</h3>
                    <p class="text-sm text-muted-foreground mb-6">Ваши уникальные награды в VoiceNote AI.</p>
                    {#if data.achievements && data.achievements.length > 0}
                        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {#each data.achievements as ach}
                                <div
                                        class="rounded-lg border p-4 text-center transition-opacity"
                                        class:opacity-100={ach.is_earned}
                                        class:opacity-40={!ach.is_earned}
                                >
                                    <div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-2xl">
                                        {ach.icon}
                                    </div>
                                    <h4 class="font-bold">{ach.name}</h4>
                                    <p class="text-xs text-muted-foreground mt-1">{ach.description}</p>
                                    {#if ach.is_earned}
                                        <p class="mt-2 text-xs font-semibold text-primary">+ {ach.xp_reward} XP</p>
                                    {/if}
                                </div>
                            {/each}
                        </div>
                    {:else}
                        <p class="text-muted-foreground">Информация о достижениях загружается...</p>
                    {/if}
                </div>
            </div>
        </div>
    {/if}
</div>