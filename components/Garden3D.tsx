"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import { Suspense } from "react";

type GardenType = "sakura" | "bosque" | "glaciar";

function GardenModel({ type }: { type: GardenType }) {
    const path =
        type === "bosque"
            ? "/models/mini-bosque-esmeralda.glb"
            : type === "glaciar"
                ? "/models/jardin-glaciar.glb"
                : "/models/jardin-sakura.glb";

    const { scene } = useGLTF(path);

    // Ajusta escala y posición del modelo
    scene.scale.set(3, 3, 3);
    scene.position.set(0, 0, 0);

    return <primitive object={scene} key={path} />;
}

export default function Garden3D({ gardenType }: { gardenType: GardenType }) {
    return (
        <div className="h-full w-full">
            <Canvas camera={{ position: [0, 2.5, 4], fov: 35 }}>
                <Suspense fallback={null}>
                    <ambientLight intensity={1.2} />
                    <directionalLight position={[5, 10, 5]} intensity={1.5} />
                    <Environment preset="sunset" />

                    <GardenModel type={gardenType} />

                    <OrbitControls
                        enablePan={false}
                        enableZoom={false}
                        autoRotate
                        autoRotateSpeed={0.7}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
}

// Opcional: precargar el modelo
// useGLTF.preload("/models/jardin-sakura.glb");
// useGLTF.preload("/models/mini-bosque-esmeralda.glb");
