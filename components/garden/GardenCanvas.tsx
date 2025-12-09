import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Cloud } from '@react-three/drei';
import { PlantInstance } from '@/types/garden';
import Plant3D from './Plant3D';

interface GardenCanvasProps {
    placedItems: PlantInstance[];
    onGridClick: (x: number, y: number) => void;
    stage: number;
    selectedPlantToPlace?: PlantInstance | null;
}

export default function GardenCanvas({ placedItems, onGridClick, stage, selectedPlantToPlace }: GardenCanvasProps) {
    const gridSize = 8;
    const tileSize = 1.2; // Space between tiles in 3D world

    // Offset to center the grid
    const offset = (gridSize * tileSize) / 2 - tileSize / 2;

    const isWinter = stage === 4;

    return (
        <div className="w-full h-full min-h-[600px] rounded-3xl relative overflow-hidden shadow-inner bg-gradient-to-b from-slate-200 to-slate-100">
            <Canvas shadows camera={{ position: [10, 8, 10], fov: 45 }}>
                {/* Atmosphere */}
                <color attach="background" args={[isWinter ? '#cce0ff' : '#e0f2fe']} />
                {isWinter ? <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} /> : <Cloud opacity={0.5} speed={0.4} segments={20} />}

                {/* Lighting */}
                <ambientLight intensity={0.5} />
                <directionalLight
                    position={[10, 10, 5]}
                    intensity={1}
                    castShadow
                    shadow-mapSize={[1024, 1024]}
                />

                {/* Controls */}
                <OrbitControls
                    maxPolarAngle={Math.PI / 2.2} // Prevent going under the floor
                    minDistance={5}
                    maxDistance={20}
                />

                {/* The Garden Grid */}
                <group position={[-offset, 0, -offset]}>
                    {/* Floor Tiles */}
                    {Array.from({ length: gridSize }).map((_, x) =>
                        Array.from({ length: gridSize }).map((_, y) => {
                            const item = placedItems.find(p => p.x === x && p.y === y);

                            return (
                                <group key={`tile-${x}-${y}`} position={[x * tileSize, 0, y * tileSize]}>
                                    {/* Tile Base */}
                                    <mesh
                                        receiveShadow
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onGridClick(x, y);
                                        }}
                                        position={[0, -0.1, 0]}
                                    >
                                        <boxGeometry args={[tileSize * 0.95, 0.2, tileSize * 0.95]} />
                                        <meshStandardMaterial
                                            color={isWinter ? "#f1f5f9" : "#dcfce7"}
                                            opacity={selectedPlantToPlace ? 0.8 : 1}
                                        />
                                    </mesh>

                                    {/* Highlight if valid placement target */}
                                    {selectedPlantToPlace && !item && (
                                        <mesh position={[0, 0.1, 0]}>
                                            <boxGeometry args={[tileSize * 0.5, 0.05, tileSize * 0.5]} />
                                            <meshStandardMaterial color="green" transparent opacity={0.5} />
                                        </mesh>
                                    )}

                                    {/* The Plant */}
                                    {item && item.plant_type && (
                                        <Plant3D
                                            type={item.plant_type}
                                            position={[0, 0, 0]}
                                            isPlaced={true}
                                        />
                                    )}
                                </group>
                            );
                        })
                    )}
                </group>

                {/* Ground Plane (Infinite-ish feeling) */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]} receiveShadow>
                    <planeGeometry args={[100, 100]} />
                    <meshStandardMaterial color={isWinter ? "#e2e8f0" : "#d1fae5"} />
                </mesh>

            </Canvas>

            {/* 2D Overlay Elements if needed (snow etc) */}
            {isWinter && (
                <div className="absolute inset-0 pointer-events-none bg-white/10 mix-blend-overlay" />
            )}
        </div>
    );
}
