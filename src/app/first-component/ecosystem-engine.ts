export type Species = 'empty' | 'plant' | 'herbivore' | 'predator';

export interface EcosystemCell {
  species: Species;
  energy?: number;
}

export interface SimulationState {
  grid: EcosystemCell[][];
  tick: number;
}

export interface PopulationCounts {
  plant: number;
  herbivore: number;
  predator: number;
}

export interface SimulationSettings {
  plantGrowthChance: number;
  plantNeighborMinimum: number;
  herbivoreStartingEnergy: number;
  predatorStartingEnergy: number;
  herbivoreFoodEnergy: number;
  predatorFoodEnergy: number;
  herbivoreReproductionEnergy: number;
  predatorReproductionEnergy: number;
  herbivoreReproductionChance: number;
  predatorReproductionChance: number;
  reproductionEnergyCost: number;
}

export type RandomSource = () => number;

interface Position {
  row: number;
  column: number;
}

interface AnimalIntent {
  species: 'herbivore' | 'predator';
  origin: Position;
  destination: Position;
  energy: number;
  offspring?: Position;
}

export const defaultSimulationSettings: SimulationSettings = {
  plantGrowthChance: 0.14,
  plantNeighborMinimum: 2,
  herbivoreStartingEnergy: 5,
  predatorStartingEnergy: 6,
  herbivoreFoodEnergy: 4,
  predatorFoodEnergy: 5,
  herbivoreReproductionEnergy: 9,
  predatorReproductionEnergy: 11,
  herbivoreReproductionChance: 0.18,
  predatorReproductionChance: 0.12,
  reproductionEnergyCost: 3,
};

export function emptyCell(): EcosystemCell {
  return { species: 'empty' };
}

export function animalCell(species: 'herbivore' | 'predator', energy: number): EcosystemCell {
  return { species, energy };
}

export function createBalancedState(
  rows = 14,
  columns = 18,
  random: RandomSource = Math.random,
): SimulationState {
  const grid: EcosystemCell[][] = Array.from({ length: rows }, () =>
    Array.from({ length: columns }, (): EcosystemCell => {
      const roll = random();

      if (roll < 0.07) {
        return animalCell('predator', defaultSimulationSettings.predatorStartingEnergy);
      }

      if (roll < 0.2) {
        return animalCell('herbivore', defaultSimulationSettings.herbivoreStartingEnergy);
      }

      return roll < 0.58 ? { species: 'plant' } : emptyCell();
    }),
  );

  return { grid, tick: 0 };
}

export function countPopulations(grid: EcosystemCell[][]): PopulationCounts {
  return grid.flat().reduce<PopulationCounts>(
    (counts, cell) => {
      if (cell.species !== 'empty') {
        counts[cell.species] += 1;
      }

      return counts;
    },
    { plant: 0, herbivore: 0, predator: 0 },
  );
}

export function paintCell(
  state: SimulationState,
  position: Position,
  species: Species,
  settings: Partial<SimulationSettings> = {},
): SimulationState {
  if (!isInBounds(state.grid, position)) {
    return state;
  }

  const resolvedSettings = { ...defaultSimulationSettings, ...settings };
  const grid = cloneGrid(state.grid);
  grid[position.row][position.column] =
    species === 'herbivore'
      ? animalCell('herbivore', resolvedSettings.herbivoreStartingEnergy)
      : species === 'predator'
        ? animalCell('predator', resolvedSettings.predatorStartingEnergy)
        : { species };

  return { ...state, grid };
}

export function advanceSimulation(
  state: SimulationState,
  random: RandomSource = Math.random,
  settings: Partial<SimulationSettings> = {},
): SimulationState {
  const resolvedSettings = { ...defaultSimulationSettings, ...settings };
  const source = state.grid;
  const afterGrowth = growPlants(source, random, resolvedSettings);
  const intents = createAnimalIntents(source, random, resolvedSettings).sort(
    (left, right) => Number(right.species === 'predator') - Number(left.species === 'predator'),
  );
  const grid = afterGrowth.map((row) => row.map((cell) => (isAnimal(cell) ? emptyCell() : { ...cell })));
  const claimedDestinations = new Set<string>();

  for (const intent of intents) {
    const destinationKey = positionKey(intent.destination);

    if (!claimedDestinations.has(destinationKey)) {
      grid[intent.destination.row][intent.destination.column] = animalCell(intent.species, intent.energy);
      claimedDestinations.add(destinationKey);
      continue;
    }

    const originKey = positionKey(intent.origin);

    if (!claimedDestinations.has(originKey) && grid[intent.origin.row][intent.origin.column].species === 'empty') {
      grid[intent.origin.row][intent.origin.column] = animalCell(intent.species, intent.energy);
      claimedDestinations.add(originKey);
    }
  }

  for (const intent of intents) {
    if (!intent.offspring || grid[intent.offspring.row][intent.offspring.column].species !== 'empty') {
      continue;
    }

    grid[intent.offspring.row][intent.offspring.column] = animalCell(
      intent.species,
      intent.species === 'herbivore'
        ? resolvedSettings.herbivoreStartingEnergy
        : resolvedSettings.predatorStartingEnergy,
    );
  }

  return { grid, tick: state.tick + 1 };
}

export function getNeighborPositions(grid: EcosystemCell[][], position: Position): Position[] {
  const neighbors: Position[] = [];

  for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
    for (let columnOffset = -1; columnOffset <= 1; columnOffset += 1) {
      if (rowOffset === 0 && columnOffset === 0) {
        continue;
      }

      const neighbor = { row: position.row + rowOffset, column: position.column + columnOffset };
      if (isInBounds(grid, neighbor)) {
        neighbors.push(neighbor);
      }
    }
  }

  return neighbors;
}

function growPlants(
  source: EcosystemCell[][],
  random: RandomSource,
  settings: SimulationSettings,
): EcosystemCell[][] {
  return source.map((row, rowIndex) =>
    row.map((cell, columnIndex) => {
      if (cell.species !== 'empty') {
        return { ...cell };
      }

      const plantNeighbors = getNeighborPositions(source, { row: rowIndex, column: columnIndex }).filter(
        ({ row: neighborRow, column: neighborColumn }) => source[neighborRow][neighborColumn].species === 'plant',
      ).length;

      return plantNeighbors >= settings.plantNeighborMinimum && random() < settings.plantGrowthChance
        ? { species: 'plant' }
        : emptyCell();
    }),
  );
}

function createAnimalIntents(
  source: EcosystemCell[][],
  random: RandomSource,
  settings: SimulationSettings,
): AnimalIntent[] {
  const intents: AnimalIntent[] = [];

  source.forEach((row, rowIndex) => {
    row.forEach((cell, columnIndex) => {
      if (!isAnimal(cell)) {
        return;
      }

      const origin = { row: rowIndex, column: columnIndex };
      const neighbors = getNeighborPositions(source, origin);
      const prey = cell.species === 'herbivore' ? 'plant' : 'herbivore';
      const foodChoices = neighbors.filter(
        ({ row: neighborRow, column: neighborColumn }) => source[neighborRow][neighborColumn].species === prey,
      );
      const moveChoices = neighbors.filter(
        ({ row: neighborRow, column: neighborColumn }) => source[neighborRow][neighborColumn].species === 'empty',
      );
      const food = choose(foodChoices, random);
      const destination = food ?? choose(moveChoices, random) ?? origin;
      const energy = (cell.energy ?? 0) +
        (food ? (cell.species === 'herbivore' ? settings.herbivoreFoodEnergy : settings.predatorFoodEnergy) : -1);

      if (energy <= 0) {
        return;
      }

      const reproductionEnergy =
        cell.species === 'herbivore'
          ? settings.herbivoreReproductionEnergy
          : settings.predatorReproductionEnergy;
      const reproductionChance =
        cell.species === 'herbivore'
          ? settings.herbivoreReproductionChance
          : settings.predatorReproductionChance;
      const offspring =
        energy >= reproductionEnergy && random() < reproductionChance
          ? choose(moveChoices.filter((position) => positionKey(position) !== positionKey(destination)), random)
          : undefined;

      intents.push({
        species: cell.species,
        origin,
        destination,
        energy: offspring ? energy - settings.reproductionEnergyCost : energy,
        offspring,
      });
    });
  });

  return intents;
}

function choose<T>(items: T[], random: RandomSource): T | undefined {
  return items.length === 0 ? undefined : items[Math.floor(random() * items.length)];
}

function cloneGrid(grid: EcosystemCell[][]): EcosystemCell[][] {
  return grid.map((row) => row.map((cell) => ({ ...cell })));
}

function isAnimal(cell: EcosystemCell): cell is EcosystemCell & { species: 'herbivore' | 'predator' } {
  return cell.species === 'herbivore' || cell.species === 'predator';
}

function isInBounds(grid: EcosystemCell[][], position: Position): boolean {
  return (
    position.row >= 0 &&
    position.row < grid.length &&
    position.column >= 0 &&
    position.column < (grid[position.row]?.length ?? 0)
  );
}

function positionKey(position: Position): string {
  return `${position.row}:${position.column}`;
}