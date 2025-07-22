<script lang="ts">
    import { onMount, tick } from 'svelte';
    import type { ShoppingListNote } from './$types';
    import { browser } from '$app/environment';
    import { goto } from '$app/navigation';

    let list: ShoppingListNote | null = null;
    let isLoading = true;
    let error = '';
    let newItemName = '';

    async function fetchList() {
        if (!browser) return;
        isLoading = true;
        error = '';
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch('/api/v1/shopping-list', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                list = await response.json();
            } else if (response.status !== 404) {
                throw new Error('Не удалось загрузить список.');
            }
        } catch (e: any) {
            error = e.message;
        } finally {
            isLoading = false;
        }
    }

    async function toggleItem(index: number, checked: boolean) {
        if (!list) return;
        const originalState = list.llm_analysis_json.items[index].checked;
        list.llm_analysis_json.items[index].checked = checked;
        list = list; // Обновляем реактивность

        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch('/api/v1/shopping-list/items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ item_index: index, checked })
            });
            if (!response.ok) throw new Error();
            list = await response.json(); // Синхронизируем с сервером
        } catch (e) {
            list.llm_analysis_json.items[index].checked = originalState; // Откат в случае ошибки
            list = list;
            alert('Ошибка обновления статуса товара');
        }
    }

    async function archiveList() {
        if (!confirm('Вы уверены, что хотите завершить и архивировать этот список?')) return;
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch('/api/v1/shopping-list/archive', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                list = null; // Очищаем список на клиенте
            } else {
                throw new Error('Не удалось архивировать список');
            }
        } catch (e: any) {
            alert(e.message);
        }
    }

    function getParticipantName(id: number | null | undefined): string {
        if (!id || !list?.participants) return 'Неизвестно';
        return list.participants.find(p => p.telegram_id === id)?.first_name || 'Неизвестно';
    }

    onMount(() => {
        fetchList();
    });
</script>

<div class="space-y-6">
    <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold">Список покупок</h1>
        {#if list}
            <button on:click={archiveList} class="bg-destructive text-destructive-foreground hover:bg-destructive/90 px-4 py-2 rounded-lg">
                Завершить
            </button>
        {/if}
    </div>

    {#if isLoading}
        <p>Загрузка списка...</p>
    {:else if error && !list}
        <p class="text-destructive">{error}</p>
    {:else if list}
        <div class="grid md:grid-cols-3 gap-8">
            <div class="md:col-span-2 space-y-4">
                <h2 class="text-xl font-semibold">Товары</h2>
                <p class="text-muted-foreground">Отмечайте купленные товары</p>
                <div class="bg-card border rounded-lg p-4 space-y-3">
                    {#if list.llm_analysis_json?.items?.length > 0}
                        {#each list.llm_analysis_json.items as item, i (item.item_name + i)}
                            <label class="flex items-center gap-3 p-2 rounded-md hover:bg-secondary transition-colors">
                                <input
                                        type="checkbox"
                                        class="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                                        checked={item.checked}
                                        on:change={(e) => toggleItem(i, e.currentTarget.checked)}
                                />
                                <span class:line-through={item.checked} class:text-muted-foreground={item.checked}>
                                    {item.item_name}
                                </span>
                                <span class="ml-auto text-xs text-muted-foreground">
                                    Добавил: {getParticipantName(item.added_by)}
                                </span>
                            </label>
                        {/each}
                    {:else}
                        <p class="text-muted-foreground text-center py-4">Список пуст. Добавьте первый товар!</p>
                    {/if}
                </div>
                <!-- Форма добавления скрыта, т.к. добавление через бота -->
            </div>

            <div class="space-y-4">
                <h2 class="text-xl font-semibold">Участники</h2>
                <div class="bg-card border rounded-lg p-4 space-y-2">
                    {#each list.participants as p (p.telegram_id)}
                        <div class="flex items-center justify-between">
                            <span>{p.first_name}</span>
                            {#if p.telegram_id === list.owner_id}
                                <span class="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Владелец</span>
                            {/if}
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    {/if}
</div>