import { PlantType } from '@/types/garden';
import { Leaf, TreeDeciduous, Flower, Snowflake } from 'lucide-react';

interface PlantSpriteProps {
    type?: PlantType;
    category?: string; // Fallback if type is missing
    className?: string;
}

export default function PlantSprite({ type, className = "" }: PlantSpriteProps) {
    // In a real app, this would return an <img src={type.asset_path} />
    // For now, we return icons based on category

    // Default fallback
    if (!type) return <div className={`w-8 h-8 bg-green-200 rounded-full ${className}`} />;

    // Generate color based on ID to make them look distinct
    const colors = ['text-green-500', 'text-teal-500', 'text-emerald-500', 'text-lime-600', 'text-pink-400'];
    const colorClass = colors[parseInt(type.id) % colors.length] || 'text-green-600';

    if (type.category === 'tree') {
        const isWinter = type.name.includes('Invernal') || type.name.includes('Pino');
        return (
            <div className={`flex items-end justify-center ${className}`}>
                <TreeDeciduous
                    size={48}
                    className={`drop-shadow-lg ${isWinter ? 'text-emerald-800' : (type.name.includes('Sakura') ? 'text-pink-400' : 'text-green-700')}`}
                />
                {isWinter && <Snowflake size={16} className="absolute top-0 right-0 text-white animate-pulse" />}
            </div>
        );
    }

    if (type.category === 'flower') {
        return (
            <div className={`flex items-end justify-center ${className}`}>
                <Flower size={32} className={`drop-shadow-md ${colorClass}`} />
            </div>
        );
    }

    if (type.category === 'decoration') {
        return (
            <div className={`flex items-end justify-center ${className}`}>
                <div className="w-6 h-8 bg-stone-400 rounded-sm border-2 border-stone-600 flex items-center justify-center">
                    <div className="w-2 h-2 bg-yellow-200 rounded-full animate-pulse" />
                </div>
            </div>
        );
    }

    return <Leaf className="text-green-500" />;
}
