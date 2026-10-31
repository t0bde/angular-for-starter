export type Species = 'empty' | 'plant' | 'herbivore' | 'predator';

export interface EcosystemCell {
  species: Species;
  energy?: number;
  /** Ticks the animal has lived; omitted for newborns. */
  age?: number;
  /** True when an animal here is standing on a trampled plant instead of an empty tile; the plant regrows once vacated. */
  plantBeneath?: boolean;
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
  herbivoreMaxAge: number;
  predatorMaxAge: number;
  /** Animals only look for food while their energy is below this value. */
  herbivoreHungerEnergy: number;
  predatorHungerEnergy: number;
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
  /** Energy if the animal loses its food or move race and stays put. */
  stayEnergy: number;
  reproductionEnergy: number;
  consumedAnimalOrigin?: Position;
  offspring?: Position;
  destinationPlantBeneath: boolean;
  originPlantBeneath: boolean;
  age: number;
}

export const defaultSimulationSettings: SimulationSettings = {
  plantGrowthChance: 0.4,
  plantNeighborMinimum: 2,
  herbivoreStartingEnergy: 5,
  predatorStartingEnergy: 6,
  herbivoreFoodEnergy: 6,
  predatorFoodEnergy: 2,
  herbivoreReproductionEnergy: 9,
  predatorReproductionEnergy: 11,
  herbivoreReproductionChance: 0.28,
  predatorReproductionChance: 0.06,
  reproductionEnergyCost: 3,
  herbivoreMaxAge: 30,
  predatorMaxAge: 40,
  herbivoreHungerEnergy: 8,
  predatorHungerEnergy: 9,
};

export function emptyCell(): EcosystemCell {
  return { species: 'empty' };
}

export function animalCell(
  species: 'herbivore' | 'predator',
  energy: number,
  plantBeneath?: boolean,
  age?: number,
): EcosystemCell {
  return {
    species,
    energy,
    ...(age ? { age } : {}),
    ...(plantBeneath ? { plantBeneath: true } : {}),
  };
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

      if (cell.plantBeneath) {
        counts.plant += 1;
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
): SimulationState {
  if (!isInBounds(state.grid, position)) {
    return state;
  }

  const grid = cloneGrid(state.grid);
  grid[position.row][position.column] =
    species === 'herbivore'
      ? animalCell('herbivore', defaultSimulationSettings.herbivoreStartingEnergy)
      : species === 'predator'
        ? animalCell('predator', defaultSimulationSettings.predatorStartingEnergy)
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
  const intents = createAnimalIntents(source, afterGrowth, random, resolvedSettings).sort(
    (left, right) => Number(right.species === 'predator') - Number(left.species === 'predator'),
  );
  const plantRegrowthCandidates: Position[] = [];
  const grid = afterGrowth.map((row, rowIndex) =>
    row.map((cell, columnIndex) => {
      if (!isAnimal(cell)) {
        return { ...cell };
      }

      if (cell.plantBeneath) {
        plantRegrowthCandidates.push({ row: rowIndex, column: columnIndex });
      }

      return emptyCell();
    }),
  );
  const claimedDestinations = new Set<string>();
  const consumedAnimalOrigins = new Set<string>();
  const survivors = new Map<string, Position>();

  for (const intent of intents) {
    const originKey = positionKey(intent.origin);
    if (consumedAnimalOrigins.has(originKey)) {
      continue;
    }

    const destinationKey = positionKey(intent.destination);

    if (!claimedDestinations.has(destinationKey)) {
      grid[intent.destination.row][intent.destination.column] = animalCell(
        intent.species,
        intent.energy,
        intent.destinationPlantBeneath,
        intent.age,
      );
      claimedDestinations.add(destinationKey);
      survivors.set(originKey, intent.destination);
      if (intent.consumedAnimalOrigin) {
        consumedAnimalOrigins.add(positionKey(intent.consumedAnimalOrigin));
      }
      continue;
    }

    if (
      !claimedDestinations.has(originKey) &&
      grid[intent.origin.row][intent.origin.column].species === 'empty' &&
      intent.stayEnergy > 0
    ) {
      grid[intent.origin.row][intent.origin.column] = animalCell(
        intent.species,
        intent.stayEnergy,
        intent.originPlantBeneath,
        intent.age,
      );
      claimedDestinations.add(originKey);
      survivors.set(originKey, intent.origin);
    }
  }

  for (const intent of intents) {
    const survivor = survivors.get(positionKey(intent.origin));
    if (!survivor || !intent.offspring) {
      continue;
    }

    const parent = grid[survivor.row][survivor.column];
    if (
      (parent.energy ?? 0) < intent.reproductionEnergy ||
      grid[intent.offspring.row][intent.offspring.column].species !== 'empty'
    ) {
      continue;
    }

    grid[survivor.row][survivor.column] = {
      ...parent,
      energy: (parent.energy ?? 0) - resolvedSettings.reproductionEnergyCost,
    };
    grid[intent.offspring.row][intent.offspring.column] = animalCell(
      intent.species,
      intent.species === 'herbivore'
        ? resolvedSettings.herbivoreStartingEnergy
        : resolvedSettings.predatorStartingEnergy,
    );
  }

  for (const { row, column } of plantRegrowthCandidates) {
    if (grid[row][column].species === 'empty') {
      grid[row][column] = { species: 'plant' };
    }
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

      const plantNeighbors = getNeighborPositions(source, {
        row: rowIndex,
        column: columnIndex,
      }).filter(({ row: neighborRow, column: neighborColumn }) => {
        const neighborCell = source[neighborRow][neighborColumn];
        return neighborCell.species === 'plant' || neighborCell.plantBeneath === true;
      }).length;

      return plantNeighbors >= settings.plantNeighborMinimum &&
        random() < settings.plantGrowthChance
        ? { species: 'plant' }
        : emptyCell();
    }),
  );
}

function createAnimalIntents(
  source: EcosystemCell[][],
  afterGrowth: EcosystemCell[][],
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

      // Animals that reach their max age die and leave no intent, so the cell is cleared below.
      if (willDieOfAge(cell, settings)) {
        return;
      }
      const age = (cell.age ?? 0) + 1;

      const neighbors = getNeighborPositions(source, origin);
      const prey = cell.species === 'herbivore' ? 'plant' : 'herbivore';
      const isHungry = (cell.energy ?? 0) < hungerEnergyFor(cell.species, settings);
      const foodChoices = isHungry
        ? neighbors.filter(({ row: neighborRow, column: neighborColumn }) => {
            const neighbor = source[neighborRow][neighborColumn];
            return neighbor.species === prey && !willDieOfAge(neighbor, settings);
          })
        : [];
      const emptyChoices = neighbors.filter(
        ({ row: neighborRow, column: neighborColumn }) =>
          source[neighborRow][neighborColumn].species === 'empty',
      );
      // Animals may cross plant tiles without eating them; the plant regrows once vacated.
      const moveChoices = neighbors.filter(
        ({ row: neighborRow, column: neighborColumn }) =>
          source[neighborRow][neighborColumn].species === 'empty' ||
          source[neighborRow][neighborColumn].species === 'plant',
      );
      const food = choose(foodChoices, random);
      const destination = food ?? choose(moveChoices, random) ?? origin;
      const energy =
        (cell.energy ?? 0) +
        (food
          ? cell.species === 'herbivore'
            ? settings.herbivoreFoodEnergy
            : settings.predatorFoodEnergy
          : -1);

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
          ? choose(
              emptyChoices.filter((position) => positionKey(position) !== positionKey(destination)),
              random,
            )
          : undefined;

      // A predator inherits the prey's hidden plant so it isn't lost when the prey standing on it gets eaten.
      const preyPlantBeneath =
        cell.species === 'predator' && food
          ? source[food.row][food.column].plantBeneath === true
          : false;

      intents.push({
        species: cell.species,
        origin,
        destination,
        energy,
        stayEnergy: (cell.energy ?? 0) - 1,
        reproductionEnergy,
        consumedAnimalOrigin: cell.species === 'predator' ? food : undefined,
        offspring,
        destinationPlantBeneath:
          preyPlantBeneath ||
          (!food && afterGrowth[destination.row][destination.column].species === 'plant'),
        originPlantBeneath: source[origin.row][origin.column].plantBeneath === true,
        age,
      });
    });
  });

  return intents;
}

function maxAgeFor(species: 'herbivore' | 'predator', settings: SimulationSettings): number {
  return species === 'herbivore' ? settings.herbivoreMaxAge : settings.predatorMaxAge;
}

function hungerEnergyFor(species: 'herbivore' | 'predator', settings: SimulationSettings): number {
  return species === 'herbivore' ? settings.herbivoreHungerEnergy : settings.predatorHungerEnergy;
}

/** True when this tick's aging makes the animal reach its max age, so it dies this tick. */
function willDieOfAge(cell: EcosystemCell, settings: SimulationSettings): boolean {
  return isAnimal(cell) && (cell.age ?? 0) + 1 >= maxAgeFor(cell.species, settings);
}

function choose<T>(items: T[], random: RandomSource): T | undefined {
  return items.length === 0 ? undefined : items[Math.floor(random() * items.length)];
}

function cloneGrid(grid: EcosystemCell[][]): EcosystemCell[][] {
  return grid.map((row) => row.map((cell) => ({ ...cell })));
}

function isAnimal(
  cell: EcosystemCell,
): cell is EcosystemCell & { species: 'herbivore' | 'predator' } {
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
