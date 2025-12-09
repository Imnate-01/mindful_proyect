import { PlantType, PlantInstance, UserProgress } from '@/types/garden';
import { Coins, ShoppingBag, Shovel, Droplets } from 'lucide-react';
import PlantSprite from './PlantSprite';

interface GardenOverlayProps {
    progress: UserProgress | null;
    onOpenShop: () => void;
    inventory: PlantInstance[];
    onSelectFromInventory: (item: PlantInstance) => void;
    selectedItemId: string | null;
    onDebugTokens: () => void;
}

export default function GardenOverlay({
    progress,
    onOpenShop,
    inventory,
    onSelectFromInventory,
    selectedItemId,
    onDebugTokens
}: GardenOverlayProps) {
    if (!progress) return null;

    const inventoryItems = inventory.filter(i => !i.is_placed);

    return (
        <>
            {/* Context/Stats HUD */}
            <div className="absolute top-6 left-6 flex flex-col gap-3 z-10">
                <div className="bg-white/80 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-white/50 flex items-center gap-3">
                    <div className="bg-yellow-100 p-2 rounded-xl text-yellow-600">
                        <Coins size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 font-medium">Tokens</p>
                        <p className="text-xl font-bold text-slate-800 leading-none">{progress.tokens}</p>
                    </div>
                    {/* Cheat Area */}
                    <button onClick={onDebugTokens} className="ml-2 text-[10px] text-gray-300 hover:text-gray-500 opacity-50">+100</button>
                </div>

                <div className="bg-white/80 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-white/50 flex items-center gap-3">
                    <div className="bg-orange-100 p-2 rounded-xl text-orange-600">
                        <span className="font-bold text-lg">🔥</span>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 font-medium">Racha</p>
                        <p className="text-xl font-bold text-slate-800 leading-none">{progress.streak_days} días</p>
                    </div>
                </div>
            </div>

            {/* Bottom Controls / Inventory */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-3xl px-6 z-10">
                <div className="bg-white/90 backdrop-blur-xl p-4 rounded-3xl shadow-xl border border-white/50 flex items-center justify-between gap-6">

                    {/* Inventory Strip */}
                    <div className="flex-1 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        {inventoryItems.length === 0 && (
                            <div className="text-sm text-gray-400 italic py-2">
                                Tu inventario está vacío. ¡Visita la tienda!
                            </div>
                        )}
                        {inventoryItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => onSelectFromInventory(item)}
                                className={`
                                    min-w-[64px] h-16 rounded-xl flex items-center justify-center border-2 transition-all
                                    ${selectedItemId === item.id
                                        ? 'bg-green-100 border-green-500 scale-105 shadow-md'
                                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                                    }
                                `}
                            >
                                <div className="transform scale-75">
                                    <PlantSprite type={item.plant_type} />
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="h-12 w-px bg-slate-200 mx-2" />

                    <button
                        onClick={onOpenShop}
                        className="flex flex-col items-center gap-1 group"
                    >
                        <div className="w-12 h-12 bg-sky-100 rounded-2xl flex items-center justify-center text-sky-600 group-hover:bg-sky-500 group-hover:text-white transition-colors shadow-sm">
                            <ShoppingBag size={24} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Tienda</span>
                    </button>
                </div>
            </div>
        </>
    );
}
