import type { Species } from './ecosystem-engine';

export type SimulationSpeed = 'slow' | 'normal' | 'fast';
export type PresetName = 'balanced' | 'meadow' | 'predator-boom';
export interface CellPosition { row: number; column: number; }
export interface SpeciesTool { id: Species; label: string; mark: string; }
export const speciesImages: Partial<Record<Species, string>> = {
  plant: 'species/plant.svg',
  herbivore: 'species/herbivore.svg',
  predator: 'species/predator.svg',
};
