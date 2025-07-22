<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import * as Card from '$lib/components/ui/card';
    import Button from '$lib/components/ui/button/button.svelte';
    import { ArrowLeft, CheckCircle2, ArchiveRestore, Trash2, LoaderCircle } from 'lucide-svelte';

    let note: any = null;
    let isLoading = true;
    let apiError = '';
    let isProcessingAction = false;

    async function fetchNote() {
        isLoading = true;
        const noteId = $page.params.id;
        const token = localStorage.getItem('accessToken');
        if (!token) {
            goto('/login');
            return;
        }
        try {
            const response = await fetch(`/api/v1/notes/${noteId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Заметка не найдена');
            note = await response.json();
        } catch (e: any) {
            apiError = e.message;
        } finally {
            isLoading = false;
        }
    }

    onMount(fetchNote);

    async function handleAction(action: 'complete' | 'unarchive' | 'delete') {
        if (action === 'delete' && !confirm('Вы уверены? Это действие необратимо.')) {
            return;
        }
        isProcessingAction = true;
        apiError = '';
        const token = localStorage.getItem('accessToken');

        try {
            const response = await fetch(`/api/v1/notes/${note.note_id}/${action}`, {
                method: action === 'delete' ? 'DELETE' : 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Не удалось выполнить действие');

            const targetList = note.is_archived ? '/notes?archived=true' : '/notes';
            goto(targetList);
        } catch (e: any) {
            apiError = e.message;
        } finally {
            isProcessingAction = false;
        }
    }
</script>

<div class="space-y-6">
    <div>
        <a href={note?.is_archived ? '/notes?archived=true' : '/notes'}>
            <Button variant="outline" size="sm">
                <ArrowLeft class="h-4 w-4 mr-2" />
                Назад к списку
            </Button>
        </a>
    </div>

    {#if isLoading}
        <div class="flex justify-center py-12">
            <LoaderCircle class="h-8 w-8 animate-spin text-primary" />
        </div>
    {:else if apiError}
        <p class="text-destructive">{apiError}</p>
    {:else if note}
        <Card.Root class="shadow-lg">
            <Card.Header>
                <Card.Title class="text-2xl">Заметка #{note.note_id}</Card.Title>
                <Card.Description>
                    Статус: {note.is_completed ? 'Выполнена' : note.is_archived ? 'В архиве' : 'Активна'}
                    | Категория: {note.category || 'Общее'}
                </Card.Description>
            </Card.Header>
            <Card.Content class="space-y-4">
                <p class="text-lg whitespace-pre-wrap leading-relaxed">{note.corrected_text}</p>
                <div class="text-sm text-muted-foreground pt-4 border-t">
                    {#if note.due_date}
                        <p><strong>Срок:</strong> {new Date(note.due_date).toLocaleString()}</p>
                    {/if}
                    <p><strong>Создана:</strong> {new Date(note.created_at).toLocaleString()}</p>
                </div>
            </Card.Content>
            <Card.Footer class="flex gap-2">
                {#if !note.is_archived}
                    <Button on:click={() => handleAction('complete')} disabled={isProcessingAction}>
                        <CheckCircle2 class="h-4 w-4 mr-2" /> Выполнено
                    </Button>
                {:else}
                    <Button on:click={() => handleAction('unarchive')} disabled={isProcessingAction}>
                        <ArchiveRestore class="h-4 w-4 mr-2" /> Восстановить
                    </Button>
                    <Button
                            on:click={() => handleAction('delete')}
                            variant="destructive"
                            disabled={isProcessingAction}
                    >
                        <Trash2 class="h-4 w-4 mr-2" /> Удалить
                    </Button>
                {/if}
            </Card.Footer>
        </Card.Root>
    {/if}
</div>