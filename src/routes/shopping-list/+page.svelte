<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { goto } from '$app/navigation';
    import Button from '$lib/components/ui/button/button.svelte';
    import * as Card from '$lib/components/ui/card';
    import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
    import Input from '$lib/components/ui/input/input.svelte';
    import { LoaderCircle, Users, Archive, Plus, ListChecks } from 'lucide-svelte';

    let list: any = null;
    let isLoading = true;
    let error = '';
    let newItemName = '';
    let pollingInterval: any;

    function getParticipantName(id: number) {
        if (!list?.participants) return 'Неизвестно';
        const participant = list.participants.find((p: any) => p.telegram_id === id);
        return participant?.first_name || `ID: ${id}`;
    }

    async function fetchList() {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            goto('/login');
            return;
        }

        try {
            const res = await fetch('/api/v1/shopping-list', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) {
                if (res.status === 404) {
                    // Если списка нет, создаем его, добавив фиктивный товар
                    await addItem('Молоко');
                    return;
                }
                throw new Error('Не удалось загрузить список');
            }
            list = await res.json();
            error = '';
        } catch (e: any) {
            error = e.message;
        } finally {
            isLoading = false;
        }
    }

    async function toggleItem(index: number, checked: boolean) {
        const token = localStorage.getItem('accessToken');
        list.llm_analysis_json.items[index].checked = checked; // Оптимистичное обновление

        const res = await fetch('/api/v1/shopping-list/items', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ item_index: index, checked })
        });
        if (res.ok) {
            list = await res.json(); // Обновляем с ответом сервера
        }
    }

    async function addItem(name: string) {
        if (!name.trim()) return;
        const token = localStorage.getItem('accessToken');
        newItemName = '';

        const res = await fetch('/api/v1/shopping-list/items/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ item_name: name })
        });
        if (res.ok) {
            list = await res.json();
        }
    }

    async function archiveList() {
        if (!confirm('Вы уверены, что хотите завершить и архивировать этот список?')) return;
        const token = localStorage.getItem('accessToken');
        await fetch('/api/v1/shopping-list/archive', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` }
        });
        list = null; // Очищаем список
        await fetchList(); // Пытаемся загрузить новый (или создать)
    }

    onMount(() => {
        fetchList();
        // Запускаем polling для обновления каждые 5 секунд
        pollingInterval = setInterval(fetchList, 5000);
    });

    onDestroy(() => {
        // Очищаем интервал при уходе со страницы
        clearInterval(pollingInterval);
    });
</script>

<div class="space-y-6">
    <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold flex items-center gap-2"><ListChecks /> Список покупок</h1>
        {#if list}
            <Button on:click={archiveList} variant="destructive">
                <Archive class="mr-2 h-4 w-4" />
                Завершить
            </Button>
        {/if}
    </div>

    {#if isLoading}
        <div class="flex justify-center py-12"><LoaderCircle class="h-8 w-8 animate-spin" /></div>
    {:else if error && !list}
        <p class="text-destructive">{error}</p>
    {:else if list}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 space-y-4">
                <Card.Root>
                    <Card.Header>
                        <Card.Title>Товары</Card.Title>
                        <Card.Description>Отмечайте купленные товары</Card.Description>
                    </Card.Header>
                    <Card.Content class="space-y-4">
                        {#if list.llm_analysis_json?.items?.length > 0}
                            {#each list.llm_analysis_json.items as item, i (item.item_name + i)}
                                <div class="flex items-center space-x-4 p-2 rounded-md hover:bg-gray-50">
                                    <Checkbox id={`item-${i}`} checked={item.checked} on:change={(e) => toggleItem(i, e.currentTarget.checked)} />
                                    <label for={`item-${i}`} class="flex-grow text-lg {item.checked ? 'line-through text-muted-foreground' : ''}">
                                        {item.item_name}
                                    </label>
                                    <span class="text-xs text-muted-foreground">
										Добавил: {getParticipantName(item.added_by)}
									</span>
                                </div>
                            {/each}
                        {:else}
                            <p class="text-muted-foreground text-center py-8">Список пуст. Добавьте первый товар!</p>
                        {/if}
                    </Card.Content>
                </Card.Root>

                <Card.Root>
                    <Card.Header>
                        <Card.Title>Добавить товар</Card.Title>
                    </Card.Header>
                    <Card.Content>
                        <form on:submit|preventDefault={() => addItem(newItemName)} class="flex gap-2">
                            <Input bind:value={newItemName} placeholder="Например, Хлеб" class="flex-grow" />
                            <Button type="submit"><Plus class="h-4 w-4 mr-2" /> Добавить</Button>
                        </form>
                    </Card.Content>
                </Card.Root>
            </div>

            <div class="lg:col-span-1">
                <Card.Root>
                    <Card.Header>
                        <Card.Title class="flex items-center gap-2"><Users /> Участники</Card.Title>
                    </Card.Header>
                    <Card.Content class="space-y-2">
                        {#each list.participants as p (p.telegram_id)}
                            <div class="text-sm">
                                <strong>{p.first_name}</strong>
                                {#if p.telegram_id === list.owner_id}
                                    <span class="ml-2 text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">Владелец</span>
                                {/if}
                            </div>
                        {/each}
                    </Card.Content>
                </Card.Root>
            </div>
        </div>
    {/if}
</div>