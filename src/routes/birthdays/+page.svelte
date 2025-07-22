<script lang="ts">
    import { page } from '$app/stores';
    import Button from '$lib/components/ui/button/button.svelte';
    import * as Card from '$lib/components/ui/card';
    import * as Table from '$lib/components/ui/table';
    import { PlusCircle, Trash2, LoaderCircle } from 'lucide-svelte';

    let birthdays = [];
    let pagination = { page: 1, totalPages: 1 };
    let isLoading = true;
    let error = '';

    async function fetchBirthdays() {
        isLoading = true;
        const currentPage = $page.url.searchParams.get('page') || '1';
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        try {
            const res = await fetch(`/api/v1/birthdays?page=${currentPage}&per_page=10`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Не удалось загрузить данные');
            const data = await res.json();
            birthdays = data.items;
            pagination = { page: data.page, totalPages: data.total_pages };
        } catch (e: any) {
            error = e.message;
        } finally {
            isLoading = false;
        }
    }

    async function deleteBirthday(birthdayId: number) {
        if (!confirm('Вы уверены, что хотите удалить эту запись?')) return;

        const token = localStorage.getItem('accessToken');
        try {
            const res = await fetch(`/api/v1/birthdays/${birthdayId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Не удалось удалить запись');
            await fetchBirthdays(); // Обновляем список после удаления
        } catch (e: any) {
            alert(e.message);
        }
    }

    $: $page.url, fetchBirthdays();
</script>

<div class="space-y-6">
    <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold">Дни рождения</h1>
        <a href="/birthdays/new">
            <Button>
                <PlusCircle class="mr-2 h-4 w-4" />
                Добавить
            </Button>
        </a>
    </div>

    <Card.Root>
        <Card.Content class="p-0">
            {#if isLoading}
                <div class="flex justify-center p-12"><LoaderCircle class="h-8 w-8 animate-spin" /></div>
            {:else if error}
                <p class="p-6 text-destructive">{error}</p>
            {:else if birthdays.length > 0}
                <Table.Root>
                    <Table.Header>
                        <Table.Row>
                            <Table.Head class="w-[40%]">Имя</Table.Head>
                            <Table.Head>Дата</Table.Head>
                            <Table.Head>Год</Table.Head>
                            <Table.Head class="text-right">Действия</Table.Head>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {#each birthdays as bday (bday.id)}
                            <Table.Row>
                                <Table.Cell class="font-medium">{bday.person_name}</Table.Cell>
                                <Table.Cell>
                                    {String(bday.birth_day).padStart(2, '0')}.{String(bday.birth_month).padStart(
                                    2,
                                    '0'
                                )}
                                </Table.Cell>
                                <Table.Cell>{bday.birth_year || '—'}</Table.Cell>
                                <Table.Cell class="text-right">
                                    <Button
                                            variant="ghost"
                                            size="icon"
                                            on:click={() => deleteBirthday(bday.id)}
                                    >
                                        <Trash2 class="h-4 w-4" />
                                    </Button>
                                </Table.Cell>
                            </Table.Row>
                        {/each}
                    </Table.Body>
                </Table.Root>
            {:else}
                <div class="text-center p-12">
                    <h3 class="text-xl font-semibold">Пусто</h3>
                    <p class="text-muted-foreground mt-2">У вас пока нет сохраненных дней рождений.</p>
                    <a href="/birthdays/new" class="mt-4 inline-block">
                        <Button>Добавить первую запись</Button>
                    </a>
                </div>
            {/if}
        </Card.Content>
        {#if !isLoading && pagination.totalPages > 1}
            <Card.Footer class="flex items-center justify-center gap-4 mt-4">
                {#if pagination.page > 1}
                    <a href="/birthdays?page={pagination.page - 1}">
                        <Button variant="outline">« Назад</Button>
                    </a>
                {/if}
                <span class="text-sm text-muted-foreground">
					Стр. {pagination.page} из {pagination.totalPages}
				</span>
                {#if pagination.page < pagination.totalPages}
                    <a href="/birthdays?page={pagination.page + 1}">
                        <Button variant="outline">Вперед »</Button>
                    </a>
                {/if}
            </Card.Footer>
        {/if}
    </Card.Root>
</div>