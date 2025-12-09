"use client";

const ROWS = 7;
const COLS = 7;

// controla qué tan separado está el tablero
const TILE_OFFSET_X = 32; // más grande = más ancho
const TILE_OFFSET_Y = 18; // más grande = más alto

export function GardenGrid() {
    const tiles = Array.from({ length: ROWS * COLS });

    return (
        <div className="relative flex items-center justify-center">
            <div className="relative">
                {tiles.map((_, index) => {
                    const row = Math.floor(index / COLS);
                    const col = index % COLS;

                    const x = (col - row) * TILE_OFFSET_X;
                    const y = (col + row) * TILE_OFFSET_Y;

                    return (
                        <div
                            key={index}
                            className="absolute"
                            style={{ transform: `translate(${x}px, ${y}px)` }}
                        >
                            {/* Loseta vacía, más grande y sutil */}
                            <div className="h-12 w-24 origin-center -skew-x-12 rounded-xl border border-white/40 bg-white/5 shadow-sm shadow-emerald-500/10" />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
