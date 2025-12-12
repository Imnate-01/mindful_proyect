import { PlantType, UserProgress } from '@/types/garden';
import { X, Lock, Check } from 'lucide-react';
import PlantSprite from './PlantSprite';

interface ShopModalProps {
    isOpen: boolean;
    onClose: () => void;
    catalog: PlantType[];
    userTokens: number;
    userStreak: number;
    onBuy: (id: string) => void;
}

export default function ShopModal({ isOpen, onClose, catalog, userTokens, userStreak, onBuy }: ShopModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">

                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-teal-50 to-emerald-50">
                    <div>
                        <h2 className="text-2xl font-bold text-teal-800">Vivero Mágico</h2>
                        <p className="text-teal-600 text-sm">Canjea tus tokens por vida natural</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white rounded-full hover:bg-red-50 hover:text-red-500 transition-colors shadow-sm">
                        <X size={20} />
                    </button>
                </div>

                {/* Grid */}
                <div className="p-6 overflow-y-auto grid grid-cols-2 md:grid-cols-3 gap-4">
                    {catalog.map(plant => {
                        const canAfford = userTokens >= plant.base_cost;
                        const unlocked = userStreak >= plant.min_streak_required;
                        const isLocked = !unlocked;

                        return (
                            <div
                                key={plant.id}
                                className={`
                                    relative p-4 rounded-2xl border-2 flex flex-col items-center text-center transition-all
                                    ${isLocked ? 'bg-gray-50 border-gray-100 opacity-70 grayscale' : 'bg-white border-slate-100 hover:border-green-300 hover:shadow-md'}
                                `}
                            >
                                {isLocked && (
                                    <div className="absolute top-3 right-3 text-gray-400">
                                        <Lock size={16} />
                                    </div>
                                )}

                                <div className="h-24 w-24 flex items-center justify-center mb-3">
                                    <div className="transform scale-150">
                                        <PlantSprite type={plant} />
                                    </div>
                                </div>

                                <h3 className="font-bold text-slate-800">{plant.name}</h3>
                                <p className="text-xs text-slate-500 mb-4 line-clamp-2 h-8">{plant.description}</p>

                                {isLocked ? (
                                    <div className="text-xs font-semibold text-orange-500 bg-orange-100 px-3 py-1 rounded-full">
                                        Requiere racha de {plant.min_streak_required} días
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => onBuy(String(plant.id))}
                                        disabled={!canAfford}
                                        className={`
                                            w-full py-2 rounded-xl text-sm font-bold transition-all
                                            ${canAfford
                                                ? 'bg-green-500 text-white hover:bg-green-600 shadow-green-200 shadow-lg'
                                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                            }
                                        `}
                                    >
                                        {canAfford ? `${plant.base_cost} Tokens` : `Faltan ${plant.base_cost - userTokens}`}
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
