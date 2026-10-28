import type { Species } from './meadow-engine';
import type { SimulationSettings } from './meadow-engine';

export type PresetName = 'balanced' | 'meadow' | 'predator-boom';
export interface SpeciesTool {
  id: Species;
  mark: string;
}
export type BehaviorSettings = Pick<
  SimulationSettings,
  | 'plantGrowthChance'
  | 'herbivoreReproductionChance'
  | 'herbivoreFoodEnergy'
  | 'predatorReproductionChance'
  | 'predatorFoodEnergy'
>;
export const speciesImages: Partial<Record<Species, string>> = {
  plant: 'species/plant.svg',
  herbivore: 'species/herbivore.svg',
  predator: 'species/predator.svg',
};
