<script lang="ts">
    import { page } from '$app/stores';
    import { browser } from '$app/environment';
    import { goto } from '$app/navigation';
    import { user } from '$lib/stores/auth';
    import type { PageData } from './$types';

    export let data: PageData;
    let isProcessingAction = false;

    // Теперь данные приходят из +page.ts, а не загружаются здесь
    $: note = data.note;
    $: apiError = data.apiError;

    async function handleAction(action: 'complete' | 'unarchive' | 'delete') {
        if (!note || !browser) return;

        if (action === 'delete' && !confirm('Вы уверены, что хотите удалить эту заметку навсегда?')) {
            return;
        }

        isProcessingAction = true;
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                goto('/login');
                return;
            }

            const url = `/api/v1/notes/${note.note_id}/${action}`;
            const method = action === 'delete' ? 'DELETE' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.ok) {
                const cameFromArchive = $page.url.searchParams.get('from') === 'archive';
                goto(cameFromArchive ? '/notes?archived=true' : '/notes');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.detail || `Не удалось выполнить действие: ${action}`);
            }
        } catch (e: any) {
            alert(e.message);
        } finally {
            isProcessingAction = false;
        }
    }
</script>

<div class="space-y-6">
    <a
            href={$page.url.searchParams.get('from') === 'archive' ? '/notes?archived=true' : '/notes'}
            class="text-sm text-muted-foreground hover:underline inline-flex items-center gap-1"
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
        Назад к списку
    </a>

    {#if apiError}
        <div class="bg-destructive/20 border-l-4 border-destructive text-destructive-foreground p-4 rounded-md">
            <h3 class="font-bold">Ошибка</h3>
            <p>{apiError}</p>
        </div>
    {:else if !note}
        <!-- Это состояние теперь будет видно только на мгновение, пока данные грузятся -->
        <p>Загрузка заметки...</p>
    {:else}
        <div class="bg-card border rounded-xl p-6 md:p-8">
            <div
                    class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 pb-4 border-b"
            >
                <h1 class="text-2xl font-bold">Заметка #{note.note_id}</h1>
                <div class="flex items-center gap-4 text-sm">
					<span class="px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
						Категория: {note.category || 'Общее'}
					</span>
                    <span
                            class="px-2 py-1 rounded-full {note.is_completed || note.is_archived
							? 'bg-muted'
							: 'bg-green-500/20 text-green-400'}"
                    >
						Статус: {note.is_completed ? 'Выполнена' : note.is_archived ? 'В архиве' : 'Активна'}
					</span>
                </div>
            </div>

            <article class="prose prose-invert max-w-none text-foreground/90 whitespace-pre-wrap">
                <p>{note.corrected_text}</p>
            </article>

            <div class="mt-6 pt-6 border-t text-sm text-muted-foreground space-y-2">
                {#if note.due_date}
                    <p><strong>Срок:</strong> {new Date(note.due_date).toLocaleString('ru-RU')}</p>
                {/if}
                <p><strong>Создана:</strong> {new Date(note.created_at).toLocaleString('ru-RU')}</p>
            </div>

            <div class="mt-8 flex flex-wrap gap-4">
                {#if !note.is_archived}
                    <button
                            on:click={() => handleAction('complete')}
                            disabled={isProcessingAction}
                            class="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg disabled:opacity-50"
                    >
                        {isProcessingAction ? 'Выполнение...' : '✅ Выполнено'}
                    </button>
                {:else}
                    <button
                            on:click={() => handleAction('unarchive')}
                            disabled={isProcessingAction}
                            class="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-lg disabled:opacity-50"
                    >
                        {isProcessingAction ? 'Восстановление...' : '↩️ Восстановить'}
                    </button>
                {/if}
                {#if note.owner_id === $user?.telegram_id}
                    <button
                            on:click={() => handleAction('delete')}
                            disabled={isProcessingAction}
                            class="bg-destructive text-destructive-foreground hover:bg-destructive/90 px-4 py-2 rounded-lg disabled:opacity-50"
                    >
                        {isProcessingAction ? 'Удаление...' : '🗑️ Удалить'}
                    </button>
                {/if}
            </div>
        </div>
    {/if}
</div>