'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { useGarden } from '@/hooks/useGarden';
import { PlantType, GardenTile, GardenStage } from '@/types/garden';
import Garden3D from "@/components/Garden3D";
import {
  Sparkles,
  Leaf,
  Coins,
  Flame,
  ShoppingBag,
  Droplets,
} from 'lucide-react';

function stageToClasses(stage: GardenStage) {
  switch (stage) {
    case 1:
      return {
        bg: 'from-amber-100 via-emerald-50 to-teal-50',
        label: 'Terreno en calma',
        subtitle: 'Un lugar en blanco listo para crecer contigo.',
      };
    case 2:
      return {
        bg: 'from-emerald-100 via-teal-100 to-cyan-100',
        label: 'Jardín en crecimiento',
        subtitle: 'Tu cuidado empieza a florecer.',
      };
    case 3:
      return {
        bg: 'from-rose-100 via-pink-100 to-emerald-100',
        label: 'Jardín Sakura mágico',
        subtitle: 'Tu constancia crea un espacio mágico.',
      };
    case 4:
      return {
        bg: 'from-indigo-100 via-purple-100 to-blue-50',
        label: 'Invierno Sereno',
        subtitle: 'La calma del frío ilumina tu mente.',
      };
    default:
      return {
        bg: 'from-amber-100 via-emerald-50 to-teal-50',
        label: 'Jardín',
        subtitle: 'Tu espacio personal.',
      };
  }
}

interface ShopProps {
  plantTypes: PlantType[];
  tokens: number;
  stage: GardenStage;
  onBuy: (plantTypeId: number) => Promise<void>;
}

import { PlantIcon } from '@/components/PlantIcon';

// ... (other imports)

function ShopPanel({ plantTypes, tokens, stage, onBuy }: ShopProps) {
  const available = plantTypes.filter(
    (p) => p.stage_required <= stage
  );

  return (
    <div className="w-full lg:w-80 bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-xl p-4 lg:p-5 space-y-3 lg:space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-emerald-500" />
            Tienda de plantas
          </h2>
          <p className="text-[11px] text-gray-500">
            Usa tus tokens de calma para decorar tu jardín.
          </p>
        </div>
        <div className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs flex items-center gap-1">
          <Coins className="w-3 h-3" />
          <span>{tokens}</span>
        </div>
      </div>

      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {available.map((p) => {
          const sprite = p.sprite_key ?? '🌱';
          const canAfford = tokens >= p.base_cost;
          return (
            <button
              key={p.id}
              disabled={!canAfford}
              onClick={() => onBuy(p.id)}
              className={`w-full flex items-center justify-between rounded-2xl border px-3 py-2.5 text-left text-xs transition-all ${canAfford
                ? 'bg-white hover:bg-emerald-50 border-gray-100 hover:border-emerald-200 hover:-translate-y-0.5'
                : 'bg-gray-50 border-gray-100 opacity-60 cursor-not-allowed'
                }`}
            >
              <div className="flex items-center gap-3">

                {/* Visualización del Icono */}
                {/* Si existe asset_path usamos el componente PlantIcon, sino fallback al emoji */}
                {p.asset_path ? (
                  <PlantIcon src={p.asset_path} alt={p.name} />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-xl shadow-sm shrink-0">
                    {sprite}
                  </div>
                )}

                <div>
                  <div className="font-semibold text-gray-800">{p.name}</div>
                  <div className="text-[10px] text-gray-500 line-clamp-2">
                    {p.description}
                  </div>
                  {p.min_streak_required > 0 && (
                    <div className="mt-0.5 inline-flex items-center gap-1 text-[10px] text-amber-600 bg-amber-50 rounded-full px-2 py-0.5">
                      <Flame className="w-3 h-3" />
                      Racha {p.min_streak_required}+ días
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end text-[11px]">
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <Coins className="w-3 h-3" /> {p.base_cost}
                </span>
                <span className="text-[10px] text-gray-400">Comprar</span>
              </div>
            </button>
          );
        })}
        {available.length === 0 && (
          <p className="text-xs text-gray-500 italic">
            Aún no hay plantas disponibles para esta etapa. Sigue cuidando tu
            bienestar para desbloquear más 🌱
          </p>
        )}
      </div>
    </div>
  );
}

export default function GardenPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();

  // Use Custom Hook instead of API calls
  const { gardenState, buyPlant, placePlant, loading: gardenLoading } = useGarden();

  const [selectedPlantTypeId, setSelectedPlantTypeId] = useState<number | null>(null);
  const [isBuying, setIsBuying] = useState(false);
  const [selectedGarden, setSelectedGarden] = useState<"sakura" | "bosque">("sakura");

  // Auth Protection
  useEffect(() => {
    if (!userLoading && !user) {
      router.replace('/login');
    }
  }, [userLoading, user, router]);

  const tokens = gardenState?.profile.tokens ?? 0;
  const stage = gardenState?.stage ?? 1;

  const handleBuy = async (plantTypeId: number) => {
    if (!gardenState) return;
    setIsBuying(true);

    // Simulate API delay
    await new Promise(r => setTimeout(r, 300));

    const success = await buyPlant(plantTypeId);
    if (success) {
      setSelectedPlantTypeId(plantTypeId);
    } else {
      alert('No tienes suficientes tokens');
    }
    setIsBuying(false);
  };

  const handlePlacePlant = async (x: number, y: number) => {
    if (!selectedPlantTypeId) return;

    await placePlant(selectedPlantTypeId, x, y);
    // Optionally clear selection or keep it to place multiple
    // setSelectedPlantTypeId(null); 
  };

  if (userLoading || gardenLoading || !gardenState) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="bg-white/80 backdrop-blur-xl px-6 py-4 rounded-2xl shadow-lg flex items-center gap-3">
          <Leaf className="w-5 h-5 text-emerald-500 animate-pulse" />
          <p className="text-sm text-gray-600">
            Cargando tu jardín emocional…
          </p>
        </div>
      </main>
    );
  }

  const stageConfig = stageToClasses(stage);
  const plantTypes = gardenState.plantTypes;

  return (
    <main
      className={`min-h-screen bg-gradient-to-br ${stageConfig.bg} overflow-hidden pb-8`}
    >
      {/* HUD superior */}
      <header className="max-w-6xl mx-auto px-4 pt-6 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/60 backdrop-blur rounded-full border border-white/70">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-semibold text-gray-700">
                Mi Jardín Emocional
              </span>
            </div>
            <h1 className="mt-2 text-2xl md:text-3xl font-bold text-gray-900">
              Cuida de tu jardín, cuida de ti 🌱
            </h1>
            <p className="text-sm text-gray-600 max-w-xl mt-1">
              Tus hábitos de bienestar se transforman en vida: cada entrada de
              diario, meditación o test suma energía a este pequeño mundo.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-start md:justify-end">
            <div className="flex items-center gap-2 px-3 py-2 bg-white/70 rounded-2xl shadow border border-white/80">
              <Coins className="w-4 h-4 text-amber-500" />
              <div className="text-xs">
                <div className="font-semibold text-gray-800">
                  {gardenState.profile.tokens} tokens
                </div>
                <div className="text-[11px] text-gray-500">
                  Gana tokens al cuidar tu bienestar
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-white/70 rounded-2xl shadow border border-white/80">
              <Flame className="w-4 h-4 text-rose-500" />
              <div className="text-xs">
                <div className="font-semibold text-gray-800">
                  Racha {gardenState.profile.streak_days} días
                </div>
                <div className="text-[11px] text-gray-500">
                  Escribe en tu diario, medita, respira ✨
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => router.push('/journal')}
              className="px-4 py-2 bg-gray-900 text-white rounded-2xl text-xs font-semibold shadow hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <Droplets className="w-4 h-4" />
              Ir al diario (regar mente)
            </button>
          </div>
        </div>
      </header>

      {/* Contenido principal: grid + tienda */}
      <section className="max-w-6xl mx-auto px-4 mt-6 flex flex-col lg:flex-row gap-6">
        <div className="flex-1 flex flex-col gap-4">

          {/* Selector de Jardín */}
          <div className="flex gap-3">
            <button
              onClick={() => setSelectedGarden("sakura")}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${selectedGarden === "sakura"
                ? "bg-emerald-600 text-white shadow-md"
                : "bg-white/60 text-slate-700 hover:bg-white border border-white/50"
                }`}
            >
              🌸 Jardín Sakura
            </button>
            <button
              onClick={() => setSelectedGarden("bosque")}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${selectedGarden === "bosque"
                ? "bg-emerald-600 text-white shadow-md"
                : "bg-white/60 text-slate-700 hover:bg-white border border-white/50"
                }`}
            >
              🌲 Bosque Esmeralda
            </button>
          </div>

          <div className="relative h-[450px] overflow-hidden rounded-3xl bg-[#f8eaff] border border-white/50 shadow-inner group">
            <Garden3D gardenType={selectedGarden} />
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full lg:w-80">
          <ShopPanel
            plantTypes={plantTypes}
            tokens={tokens}
            stage={stage}
            onBuy={handleBuy}
          />
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow p-4 text-[11px] text-gray-600 flex gap-3">
            <Leaf className="w-4 h-4 text-emerald-500 mt-0.5" />
            <p>
              Próximamente: biomas de invierno, fantasmitas amigables 👻 y
              zonas especiales vinculadas a tus meditaciones favoritas.
            </p>
          </div>
          {isBuying && (
            <div className="text-[11px] text-gray-500 text-center">
              Procesando compra…
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
