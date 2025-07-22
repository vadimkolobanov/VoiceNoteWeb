<script lang="ts">
    import { goto } from '$app/navigation';
    import type { PageData } from './$types';

    export let data: PageData;

    $: notes = data.notes;
    $: pagination = data.pagination;
    $: isArchived = data.isArchived;
    $: error = data.error;
    $: isLoading = !notes && !error;

    function getNoteStyle(category: string | null) {
        const colors: Record<string, string> = {
            Работа: 'border-l-blue-500',
            Личное: 'border-l-green-500',
            Задачи: 'border-l-yellow-500',
            Покупки: 'border-l-pink-500',
            Идеи: 'border-l-purple-500',
            Общее: 'border-l-gray-500'
        };
        return colors[category || 'Общее'] || 'border-l-gray-500';
    }

    function navigateToNote(note_id: number, isShoppingList: boolean) {
        const targetUrl = isShoppingList ? `/shopping-list` : `/notes/${note_id}`;
        const fromParam = isArchived ? '?from=archive' : '';
        goto(targetUrl + fromParam);
    }
</script>

<div class="space-y-6">
    <div class="flex items-center justify-between gap-4">
        <h1 class="text-3xl font-bold">{isArchived ? 'Архив заметок' : 'Мои заметки'}</h1>
        <div class="flex items-center gap-2">
            <a
                    href={isArchived ? '/notes' : '/notes?archived=true'}
                    class="bg-secondary text-secondary-foreground hover:bg-muted px-4 py-2 rounded-lg text-sm"
            >
                {isArchived ? 'Активные' : 'Архив'}
            </a>
            <a href="/notes/new" class="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-semibold">
                Создать
            </a>
        </div>
    </div>

    {#if isLoading}
        <p>Загрузка заметок...</p>
    {:else if error}
        <p class="text-destructive">{error}</p>
    {:else if notes.length > 0}
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each notes as note (note.note_id)}
                {@const isShoppingList = note.category === 'Покупки'}
                {@const style = getNoteStyle(note.category)}
                <div
                        on:click={() => navigateToNote(note.note_id, isShoppingList)}
                        class="bg-card border {style} border-l-4 rounded-lg p-5 flex flex-col hover:shadow-lg hover:border-primary transition-all cursor-pointer group"
                        role="button"
                        tabindex="0"
                        on:keypress
                >
                    <h3 class="font-bold text-lg mb-2 truncate group-hover:text-primary">
                        {note.summary_text || note.corrected_text}
                    </h3>
                    <p class="text-muted-foreground text-sm flex-grow line-clamp-3">
                        {note.corrected_text}
                    </p>
                    <div class="mt-4 pt-4 border-t text-xs text-muted-foreground">
                        {#if isShoppingList}
                            <span class="text-primary font-semibold">Перейти к списку</span>
                        {:else if note.due_date}
                            <span>Срок: {new Date(note.due_date).toLocaleString('ru-RU')}</span>
                        {/if}
                    </div>
                </div>
            {/each}
        </div>

        {#if pagination.totalPages > 1}
            <div class="flex justify-center items-center gap-2 mt-8">
                {#if pagination.page > 1}
                    <a
                            href="?page={pagination.page - 1}{isArchived ? '&archived=true' : ''}"
                            class="px-4 py-2 rounded-lg bg-secondary hover:bg-muted"
                    >
                        « Назад
                    </a>
                {/if}
                <span class="text-muted-foreground text-sm">
					Стр. {pagination.page} из {pagination.totalPages}
				</span>
                {#if pagination.page < pagination.totalPages}
                    <a
                            href="?page={pagination.page + 1}{isArchived ? '&archived=true' : ''}"
                            class="px-4 py-2 rounded-lg bg-secondary hover:bg-muted"
                    >
                        Вперед »
                    </a>
                {/if}
            </div>
        {/if}
    {:else}
        <div class="text-center py-16 bg-card rounded-lg border">
            <h3 class="text-xl font-semibold">Пусто</h3>
            <p class="text-muted-foreground mt-2">
                У вас пока нет {isArchived ? 'архивных' : 'активных'} заметок.
            </p>
            <a href="/notes/new" class="mt-6 inline-block bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-semibold">
                Создать первую заметку
            </a>
        </div>
    {/if}
</div>