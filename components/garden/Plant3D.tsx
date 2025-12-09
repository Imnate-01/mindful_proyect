import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PlantType } from '@/types/garden';
import * as THREE from 'three';

interface Plant3DProps {
    type?: PlantType;
    position: [number, number, number];
    isPlaced: boolean;
}

export default function Plant3D({ type, position, isPlaced }: Plant3DProps) {
    const groupRef = useRef<THREE.Group>(null);

    // Simple animation for "just placed" or alive feel
    useFrame((state) => {
        if (groupRef.current && isPlaced) {
            // Gentle sway
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
        }
    });

    if (!type) return null;

    // --- Render Logic based on Category ---

    // 1. TREES
    if (type.category === 'tree') {
        const isSakura = type.name.includes('Sakura');
        const isPine = type.name.includes('Pino') || type.name.includes('Invernal');

        return (
            <group ref={groupRef} position={position}>
                {/* Trunk */}
                <mesh position={[0, 0.5, 0]}>
                    <cylinderGeometry args={[0.1, 0.15, 1, 8]} />
                    <meshStandardMaterial color="#5c4033" />
                </mesh>

                {/* Foliage */}
                {isPine ? (
                    // Pine Tree (Cones)
                    <group position={[0, 1, 0]}>
                        <mesh position={[0, 0, 0]}>
                            <coneGeometry args={[0.6, 1.2, 8]} />
                            <meshStandardMaterial color="#1a4d2e" />
                        </mesh>
                        <mesh position={[0, 0.8, 0]}>
                            <coneGeometry args={[0.45, 1, 8]} />
                            <meshStandardMaterial color="#2d5a3f" />
                        </mesh>
                        {/* Snow on top */}
                        <mesh position={[0, 0.9, 0]} scale={[0.5, 0.5, 0.5]}>
                            <coneGeometry args={[0.46, 1, 8]} />
                            <meshStandardMaterial color="white" />
                        </mesh>
                    </group>
                ) : (
                    // Standard / Sakura Tree (Sphere/Cloud)
                    <mesh position={[0, 1.2, 0]}>
                        <dodecahedronGeometry args={[0.7, 0]} />
                        <meshStandardMaterial color={isSakura ? "#fbcfe8" : "#4ade80"} />
                    </mesh>
                )}
            </group>
        );
    }

    // 2. FLOWERS / BUSHES
    if (type.category === 'flower') {
        const isSnowy = type.name.includes('Nevado');
        return (
            <group ref={groupRef} position={position}>
                <mesh position={[0, 0.3, 0]}>
                    <sphereGeometry args={[0.3, 8, 8]} />
                    <meshStandardMaterial color={isSnowy ? "#e2e8f0" : "#22c55e"} />
                </mesh>
                {/* Small flowers scattered */}
                {!isSnowy && (
                    <>
                        <mesh position={[0.2, 0.4, 0.1]}>
                            <sphereGeometry args={[0.08]} />
                            <meshStandardMaterial color="yellow" />
                        </mesh>
                        <mesh position={[-0.1, 0.5, -0.1]}>
                            <sphereGeometry args={[0.08]} />
                            <meshStandardMaterial color="pink" />
                        </mesh>
                    </>
                )}
            </group>
        );
    }

    // 3. DECORATION (Lantern)
    if (type.category === 'decoration') {
        return (
            <group ref={groupRef} position={position}>
                {/* Post */}
                <mesh position={[0, 0.4, 0]}>
                    <boxGeometry args={[0.1, 0.8, 0.1]} />
                    <meshStandardMaterial color="#78716c" />
                </mesh>
                {/* Light Box */}
                <mesh position={[0, 0.9, 0]}>
                    <boxGeometry args={[0.3, 0.4, 0.3]} />
                    <meshStandardMaterial color="#44403c" />
                </mesh>
                {/* Inner Light (Emissive) */}
                <mesh position={[0, 0.9, 0]}>
                    <boxGeometry args={[0.2, 0.3, 0.2]} />
                    <meshStandardMaterial color="#fef3c7" emissive="#fef3c7" emissiveIntensity={0.5} />
                </mesh>
            </group>
        );
    }

    // Default Fallback
    return (
        <mesh position={position}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial color="gray" />
        </mesh>
    );
}
