"use client";

import Image from "next/image";

interface PlantIconProps {
    src: string;
    alt: string;
}

export function PlantIcon({ src, alt }: PlantIconProps) {
    return (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 shadow-sm shrink-0">
            <Image
                src={src}
                alt={alt}
                width={40}
                height={40}
                className="drop-shadow-[0_4px_6px_rgba(0,0,0,0.12)] object-contain"
            />
        </div>
    );
}
