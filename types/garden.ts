export type PlantCategory = 'tree' | 'flower' | 'decoration' | 'special';

export type GardenStage = 1 | 2 | 3 | 4;

export interface PlantType {
    id: number; // Changed to number to match user code
    name: string;
    description: string;
    base_cost: number; // User code uses base_cost
    min_streak_required: number;
    stage_required: number; // User code uses stage_required
    category: PlantCategory;
    sprite_key?: string; // Emoji
    asset_path?: string; // Legacy
}

export interface GardenTile {
    grid_x: number;
    grid_y: number;
    plant_type_id: number | null;
    plant_type?: PlantType;
}

export interface UserProfile {
    user_id: string;
    tokens: number;
    streak_days: number;
    current_stage: GardenStage;
}

export interface GardenState {
    profile: UserProfile;
    tiles: GardenTile[];
    plantTypes: PlantType[];
    // Legacy helper for hook internals if needed, or remove
    stage?: GardenStage;
}
