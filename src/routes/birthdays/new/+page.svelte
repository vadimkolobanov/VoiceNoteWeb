<script lang="ts">
    import { goto } from '$app/navigation';
    import Button from '$lib/components/ui/button/button.svelte';
    import * as Card from '$lib/components/ui/card';
    import { ArrowLeft, LoaderCircle } from 'lucide-svelte';

    let person_name = '';
    let birth_date = '';
    let isLoading = false;
    let apiError = '';

    async function createBirthday() {
        if (!person_name.trim() || !birth_date.trim()) {
            apiError = 'Все поля обязательны для заполнения.';
            return;
        }

        isLoading = true;
        apiError = '';
        const token = localStorage.getItem('accessToken');
        if (!token) {
            goto('/login');
            return;
        }

        try {
            const response = await fetch('/api/v1/birthdays', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ person_name, birth_date })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.detail || 'Не удалось добавить запись.');
            }

            goto(`/birthdays`);
        } catch (e: any) {
            apiError = e.message;
        } finally {
            isLoading = false;
        }
    }
</script>

<div class="max-w-2xl mx-auto space-y-6">
    <div>
        <a href="/birthdays">
            <Button variant="outline" size="sm">
                <ArrowLeft class="h-4 w-4 mr-2" />
                Назад к списку
            </Button>
        </a>
    </div>
    <Card.Root>
        <Card.Header>
            <Card.Title class="text-2xl">Добавить день рождения</Card.Title>
            <Card.Description>Укажите имя человека и его дату рождения.</Card.Description>
        </Card.Header>
        <Card.Content>
            <form on:submit|preventDefault={createBirthday} class="space-y-4">
                <div>
                    <label for="name" class="block text-sm font-medium mb-1">Имя человека</label>
                    <input
                            id="name"
                            type="text"
                            bind:value={person_name}
                            class="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background"
                            placeholder="Например, Мама"
                            disabled={isLoading}
                    />
                </div>
                <div>
                    <label for="date" class="block text-sm font-medium mb-1">Дата рождения</label>
                    <input
                            id="date"
                            type="text"
                            bind:value={birth_date}
                            class="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background"
                            placeholder="ДД.ММ.ГГГГ или ДД.ММ"
                            disabled={isLoading}
                    />
                </div>
                {#if apiError}
                    <p class="text-sm font-medium text-destructive">{apiError}</p>
                {/if}
                <Button type="submit" class="w-full" disabled={isLoading}>
                    {#if isLoading}
                        <LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
                    {/if}
                    Сохранить
                </Button>
            </form>
        </Card.Content>
    </Card.Root>
</div>