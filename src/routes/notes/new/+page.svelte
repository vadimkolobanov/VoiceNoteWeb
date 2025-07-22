<script lang="ts">
    import { goto } from '$app/navigation';
    import Button from '$lib/components/ui/button/button.svelte';
    import * as Card from '$lib/components/ui/card';
    import { ArrowLeft, LoaderCircle } from 'lucide-svelte';

    let noteText = '';
    let isLoading = false;
    let apiError = '';

    async function createNote() {
        if (!noteText.trim()) {
            apiError = 'Текст заметки не может быть пустым.';
            return;
        }
        isLoading = true;
        apiError = '';
        const token = localStorage.getItem('accessToken');

        try {
            const response = await fetch('/api/v1/notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ text: noteText })
            });
            if (!response.ok) throw new Error((await response.json()).detail);
            const newNote = await response.json();
            goto(`/notes/${newNote.note_id}`);
        } catch (e: any) {
            apiError = e.message;
        } finally {
            isLoading = false;
        }
    }
</script>

<div class="max-w-2xl mx-auto space-y-6">
    <div>
        <a href="/notes">
            <Button variant="outline" size="sm">
                <ArrowLeft class="h-4 w-4 mr-2" />
                Назад к списку
            </Button>
        </a>
    </div>
    <Card.Root>
        <Card.Header>
            <Card.Title class="text-2xl">Новая заметка</Card.Title>
            <Card.Description
            >Введите текст. AI проанализирует его, выделит главное и, если нужно, поставит
                напоминание.</Card.Description
            >
        </Card.Header>
        <Card.Content>
            <form on:submit|preventDefault={createNote} class="space-y-4">
				<textarea
                        bind:value={noteText}
                        rows="8"
                        class="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Например: Позвонить маме завтра в 12:30 и поздравить с днем рождения"
                        disabled={isLoading}
                ></textarea>
                {#if apiError}
                    <p class="text-sm font-medium text-destructive">{apiError}</p>
                {/if}
                <Button type="submit" class="w-full" disabled={isLoading}>
                    {#if isLoading}
                        <LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
                    {/if}
                    Сохранить заметку
                </Button>
            </form>
        </Card.Content>
    </Card.Root>
</div>