import { Briefcase, Heart, CheckSquare, Lightbulb, ShoppingCart, StickyNote } from 'lucide-svelte';

// Определяем соответствие категорий и стилей
const categoryStyles: Record<string, { icon: any; colorClass: string }> = {
    'Работа': { icon: Briefcase, colorClass: 'bg-blue-500' },
    'Личное': { icon: Heart, colorClass: 'bg-pink-500' },
    'Задачи': { icon: CheckSquare, colorClass: 'bg-green-500' },
    'Идеи': { icon: Lightbulb, colorClass: 'bg-yellow-500' },
    'Покупки': { icon: ShoppingCart, colorClass: 'bg-orange-500' },
    'Общее': { icon: StickyNote, colorClass: 'bg-gray-400' }
};

export function getNoteStyle(category: string | null) {
    const defaultStyle = { icon: StickyNote, colorClass: 'bg-gray-400' };
    if (!category || !categoryStyles[category]) {
        return defaultStyle;
    }
    return categoryStyles[category];
}