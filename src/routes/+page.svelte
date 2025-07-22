<script lang="ts">
    import { user } from '$lib/stores/auth';
    import { goto } from '$app/navigation';
</script>

<div class="space-y-8">
    <div>
        <h1 class="text-3xl font-bold">Добро пожаловать, {$user?.first_name}!</h1>
        <p class="text-muted-foreground">Это ваша главная панель. Выберите раздел в меню, чтобы начать.</p>
    </div>

    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-xl border bg-card text-card-foreground p-6">
            <h3 class="text-sm font-medium text-muted-foreground">Уровень</h3>
            <p class="text-4xl font-bold">{$user?.level}</p>
        </div>
        <div class="rounded-xl border bg-card text-card-foreground p-6">
            <h3 class="text-sm font-medium text-muted-foreground">Опыт (XP)</h3>
            <p class="text-4xl font-bold">{$user?.xp}</p>
        </div>
        <div class="rounded-xl border bg-card text-card-foreground p-6">
            <h3 class="text-sm font-medium text-muted-foreground">VIP Статус</h3>
            <p class="text-4xl font-bold">{$user?.is_vip ? '👑 VIP' : 'Free'}</p>
        </div>
        <!-- ИСПРАВЛЕНИЕ 2: ИЗМЕНЕН РАЗМЕР ШРИФТА ДЛЯ ТАЙМЗОНЫ -->
        <div class="rounded-xl border bg-card text-card-foreground p-6">
            <h3 class="text-sm font-medium text-muted-foreground">Часовой пояс</h3>
            <p class="text-2xl lg:text-3xl font-bold break-words">{$user?.timezone}</p>
        </div>
    </div>

    <div>
        <h2 class="text-2xl font-semibold mb-4">Быстрые действия</h2>
        <div class="grid gap-4 sm:grid-cols-2">
            <button
                    on:click={() => goto('/notes/new')}
                    class="w-full text-left rounded-lg border bg-card p-4 hover:bg-muted transition-colors"
            >
                <h3 class="font-semibold">Создать заметку</h3>
                <p class="text-sm text-muted-foreground">Быстро запишите новую идею или задачу.</p>
            </button>
            <button
                    on:click={() => goto('/birthdays/new')}
                    class="w-full text-left rounded-lg border bg-card p-4 hover:bg-muted transition-colors"
            >
                <h3 class="font-semibold">Добавить день рождения</h3>
                <p class="text-sm text-muted-foreground">Сохраните важную дату.</p>
            </button>
        </div>
    </div>
</div>