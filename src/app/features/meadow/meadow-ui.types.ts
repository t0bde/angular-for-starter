import type { EcosystemCell, Species } from './meadow-engine';
import type { SimulationSettings } from './meadow-engine';
import type { CellPosition } from '../../shared/simulation.types';

export type CellAnchor = Pick<DOMRect, 'left' | 'top' | 'right' | 'bottom'>;

export interface CellInspectRequest {
  position: CellPosition;
  anchor: CellAnchor;
}

export interface CellInspectState extends CellInspectRequest {
  pinned: boolean;
  // The species the card was opened for; the card closes if the cell changes species.
  species: Species;
}

export interface CellInspection extends CellInspectState {
  cell: EcosystemCell;
}

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
