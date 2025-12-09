"use client";

export function GrassCanvas() {
    return (
        <div
            className="h-full w-full rounded-3xl"
            style={{
                backgroundImage: 'url("/textures/grass-base.png")',
                backgroundSize: "80px 80px", // tamaño del tile de pasto
                backgroundRepeat: "repeat",
                backgroundPosition: "center",
            }}
            aria-hidden="true"
        />
    );
}
