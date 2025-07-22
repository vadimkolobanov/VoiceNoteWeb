<script lang="ts">
    import type { PageData } from './$types';
    import * as Card from '$lib/components/ui/card';
    import Button from '$lib/components/ui/button/button.svelte';
    import { Settings, Star, Crown, Trophy } from 'lucide-svelte';

    export let data: PageData;
</script>

<div class="space-y-4">
    <h1 class="text-3xl font-bold">Профиль</h1>

    {#if data.error}
        <p class="text-red-500">{data.error}</p>
    {:else if data.profile}
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <!-- Левая колонка - Профиль -->
            <div class="lg:col-span-1 space-y-6">
                <Card.Root>
                    <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
                        <Card.Title class="text-sm font-medium">Ваш Профиль</Card.Title>
                        {#if data.profile.is_vip}
                            <Crown class="h-4 w-4 text-yellow-500" />
                        {:else}
                            <Star class="h-4 w-4 text-muted-foreground" />
                        {/if}
                    </Card.Header>
                    <Card.Content>
                        <div class="text-2xl font-bold">{data.profile.first_name}</div>
                        <p class="text-xs text-muted-foreground">@{data.profile.username || 'N/A'}</p>
                    </Card.Content>
                    <Card.Footer>
                        <a href="/profile/settings" class="w-full">
                            <Button class="w-full">
                                <Settings class="mr-2 h-4 w-4" /> Настройки
                            </Button>
                        </a>
                    </Card.Footer>
                </Card.Root>

                <Card.Root>
                    <Card.Header>
                        <Card.Title>Прогресс</Card.Title>
                    </Card.Header>
                    <Card.Content class="space-y-4">
                        <div class="flex justify-between">
                            <span class="font-medium">Уровень</span>
                            <span class="text-muted-foreground">{data.profile.level}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="font-medium">Опыт (XP)</span>
                            <span class="text-muted-foreground">{data.profile.xp}</span>
                        </div>
                    </Card.Content>
                </Card.Root>
            </div>

            <!-- Правая колонка - Достижения -->
            <div class="lg:col-span-2">
                <Card.Root>
                    <Card.Header>
                        <Card.Title class="flex items-center">
                            <Trophy class="mr-2 h-5 w-5 text-yellow-600" />
                            Достижения
                        </Card.Title>
                        <Card.Description>Ваши уникальные награды в VoiceNote AI.</Card.Description>
                    </Card.Header>
                    <Card.Content class="space-y-4">
                        {#if data.achievements && data.achievements.length > 0}
                            <div class="space-y-2">
                                {#each data.achievements as ach}
                                    <div
                                            class="flex items-center p-3 rounded-md {ach.is_earned
											? 'bg-green-50 border border-green-200 dark:bg-green-950 dark:border-green-800'
											: 'bg-gray-50 dark:bg-gray-800/50'}"
                                    >
                                        <span class="text-2xl mr-4">{ach.icon}</span>
                                        <div class="flex-grow">
                                            <p class="font-semibold">{ach.name}</p>
                                            <p class="text-sm text-muted-foreground">{ach.description}</p>
                                        </div>
                                        {#if ach.is_earned}
                                            <div
                                                    class="ml-4 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-full"
                                            >
                                                + {ach.xp_reward} XP
                                            </div>
                                        {/if}
                                    </div>
                                {/each}
                            </div>
                        {:else}
                            <p>Информация о достижениях загружается...</p>
                        {/if}
                    </Card.Content>
                </Card.Root>
            </div>
        </div>
    {/if}
</div>