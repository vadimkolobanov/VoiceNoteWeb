<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import Button from '$lib/components/ui/button/button.svelte';
    import * as Card from '$lib/components/ui/card';
    import { PlusCircle, LoaderCircle, CalendarClock, ArrowRight } from 'lucide-svelte';
    import { getNoteStyle } from '$lib/helpers/notes';
    import { fade } from 'svelte/transition';

    let notes = [];
    let pagination = { page: 1, totalPages: 1 };
    let isArchived = false;
    let isLoading = true;
    let error = '';

    async function fetchNotes() {
        isLoading = true;
        const currentPage = $page.url.searchParams.get('page') || '1';
        isArchived = $page.url.searchParams.get('archived') === 'true';

        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                return;
            }
            const response = await fetch(
                `/api/v1/notes?page=${currentPage}&per_page=6&archived=${isArchived}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to fetch notes');
            }
            const notesData = await response.json();
            notes = notesData.items;
            pagination = {
                page: notesData.page,
                totalPages: notesData.total_pages
            };
        } catch (e: any) {
            error = e.message;
        } finally {
            isLoading = false;
        }
    }

    $: $page.url, fetchNotes();
</script>

<div class="space-y-6">
    <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold">{isArchived ? 'Архив заметок' : 'Мои заметки'}</h1>
        <div class="flex items-center gap-2">
            <a href={isArchived ? '/notes' : '/notes?archived=true'}>
                <Button variant="outline">{isArchived ? 'Активные' : 'Архив'}</Button>
            </a>
            <a href="/notes/new">
                <Button>
                    <PlusCircle class="mr-2 h-4 w-4" />
                    Создать
                </Button>
            </a>
        </div>
    </div>

    {#if isLoading}
        <div class="flex justify-center items-center py-12">
            <LoaderCircle class="h-8 w-8 animate-spin text-primary" />
        </div>
    {:else if error}
        <p class="text-destructive">{error}</p>
    {:else if notes.length > 0}
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {#each notes as note (note.note_id)}
                {@const isShoppingList = note.category === 'Покупки'}
                {@const style = getNoteStyle(note.category)}
                <div
                        in:fade={{ duration: 300, delay: 100 * notes.indexOf(note) }}
                        on:click={() => goto(isShoppingList ? `/shopping-list` : `/notes/${note.note_id}`)}
                        class="cursor-pointer group"
                        role="button"
                        tabindex="0"
                        on:keypress
                >
                    <Card.Root
                            class="transition-all h-full overflow-hidden border-l-4 {style.colorClass}
                               group-hover:scale-[1.02] group-hover:shadow-xl flex flex-col"
                    >
                        <Card.Header>
                            <div class="flex items-center gap-3">
                                <svelte:component this={style.icon} class="h-6 w-6 text-muted-foreground" />
                                <Card.Title class="truncate text-xl font-semibold">
                                    {note.summary_text || note.corrected_text}
                                </Card.Title>
                            </div>
                        </Card.Header>
                        <Card.Content class="min-h-[70px] flex-grow">
                            <!-- Убрали класс text-muted-foreground, чтобы текст стал черным и читаемым -->
                            <p class="text-base line-clamp-3">
                                {note.corrected_text}
                            </p>
                        </Card.Content>

                        {#if isShoppingList}
                            <Card.Footer class="py-3 mt-auto border-t">
                                <div class="flex items-center text-sm font-bold text-primary">
                                    <span>Перейти к списку</span>
                                    <ArrowRight class="h-4 w-4 ml-2" />
                                </div>
                            </Card.Footer>
                        {:else if note.due_date}
                            <Card.Footer class="py-3 mt-auto border-t">
                                <!-- Используем нейтральный, но заметный цвет для срока (не красный) -->
                                <div class="flex items-center text-sm font-semibold text-gray-600">
                                    <CalendarClock class="h-4 w-4 mr-2" />
                                    <span>Срок: {new Date(note.due_date).toLocaleString()}</span>
                                </div>
                            </Card.Footer>
                        {/if}
                    </Card.Root>
                </div>
            {/each}
        </div>

        <!-- Pagination -->
        {#if pagination.totalPages > 1}
            <div class="flex items-center justify-center gap-4 mt-8">
                {#if pagination.page > 1}
                    <a href="/notes?page={pagination.page - 1}&archived={isArchived}">
                        <Button variant="outline">« Назад</Button>
                    </a>
                {/if}
                <span class="text-sm text-muted-foreground">
					Стр. {pagination.page} из {pagination.totalPages}
				</span>
                {#if pagination.page < pagination.totalPages}
                    <a href="/notes?page={pagination.page + 1}&archived={isArchived}">
                        <Button variant="outline">Вперед »</Button>
                    </a>
                {/if}
            </div>
        {/if}
    {:else}
        <Card.Root class="text-center py-12">
            <Card.Content>
                <h3 class="text-xl font-semibold">Пусто</h3>
                <p class="text-muted-foreground mt-2">
                    У вас пока нет {isArchived ? 'архивных' : 'активных'} заметок.
                </p>
                <a href="/notes/new" class="mt-4 inline-block">
                    <Button>Создать первую заметку</Button>
                </a>
            </Card.Content>
        </Card.Root>
    {/if}
</div>