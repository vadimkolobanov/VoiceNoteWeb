<script lang="ts">
    import { user } from '../stores/auth';
</script>

<div class="dashboard">
    <h1>Добро пожаловать, {$user?.first_name}!</h1>
    <p>Это ваша главная панель. Выберите раздел в меню выше, чтобы начать.</p>

    <div class="stats-grid">
        <div class="stat-card">
            <h2>Уровень</h2>
            <span class="stat-value">{$user?.level}</span>
        </div>
        <div class="stat-card">
            <h2>Опыт (XP)</h2>
            <span class="stat-value">{$user?.xp}</span>
        </div>
        <div class="stat-card">
            <h2>VIP Статус</h2>
            <span class="stat-value">{$user?.is_vip ? '👑 VIP' : 'Free'}</span>
        </div>
        <div class="stat-card">
            <h2>Часовой пояс</h2>
            <span class="stat-value">{$user?.timezone}</span>
        </div>
    </div>

    <div class="actions">
        <h2>Быстрые действия</h2>
        <a href="/notes/new" class="action-button">Создать заметку</a>
        <a href="/birthdays/new" class="action-button">Добавить день рождения</a>
    </div>
</div>

<style>
    .dashboard {
        padding: 1rem;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-top: 2rem;
    }

    .stat-card {
        background-color: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 1.5rem;
        text-align: center;
    }

    .stat-card h2 {
        margin: 0 0 0.5rem 0;
        font-size: 1rem;
        color: #6b7280;
    }

    .stat-value {
        font-size: 2rem;
        font-weight: bold;
        color: #111827;
    }
    .actions {
        margin-top: 2.5rem;
        padding-top: 1.5rem;
        border-top: 1px solid #e5e7eb;
    }
    .action-button {
        display: inline-block;
        margin-right: 1rem;
        padding: 0.75rem 1.5rem;
        background-color: #7c3aed; /* Фиолетовый */
        color: white;
        text-decoration: none;
        border-radius: 8px;
        font-weight: 500;
        transition: background-color 0.2s;
    }
    .action-button:hover {
        background-color: #6d28d9;
    }
</style>