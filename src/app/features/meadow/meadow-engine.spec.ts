import {
  advanceSimulation,
  animalCell,
  countPopulations,
  emptyCell,
  getNeighborPositions,
  type EcosystemCell,
  type SimulationState,
} from './meadow-engine';

const noGrowthSettings = {
  plantGrowthChance: 0,
  herbivoreReproductionChance: 0,
  herbivoreFoodEnergy: 4,
  predatorReproductionChance: 0,
  predatorFoodEnergy: 5,
  herbivoreHungerEnergy: 100,
  predatorHungerEnergy: 100,
};

function stateFrom(grid: EcosystemCell[][]): SimulationState {
  return { grid, tick: 0 };
}

describe('ecosystem engine', () => {
  it('grows a plant into an empty cell with enough neighboring plants', () => {
    const state = stateFrom([
      [{ species: 'plant' }, { species: 'plant' }, emptyCell()],
      [{ species: 'plant' }, emptyCell(), emptyCell()],
      [emptyCell(), emptyCell(), emptyCell()],
    ]);

    const next = advanceSimulation(state, () => 0, { ...noGrowthSettings, plantGrowthChance: 1 });

    expect(next.grid[1][1].species).toBe('plant');
  });

  it('preserves a plant that grows under a moving herbivore', () => {
    const state = stateFrom([
      [{ species: 'plant' }, { species: 'plant' }, emptyCell()],
      [emptyCell(), emptyCell(), emptyCell()],
      [emptyCell(), emptyCell(), animalCell('herbivore', 5)],
    ]);

    const next = advanceSimulation(state, () => 0, { ...noGrowthSettings, plantGrowthChance: 1 });

    // Growth fills (1,0) and (1,1); the herbivore then moves onto (1,1) without erasing it.
    expect(next.grid[1][0]).toEqual({ species: 'plant' });
    expect(next.grid[1][1]).toEqual(animalCell('herbivore', 4, true, 1));
    expect(countPopulations(next.grid)).toEqual({ plant: 4, herbivore: 1, predator: 0 });
  });

  it('allows a herbivore to eat a neighboring plant and gain energy', () => {
    const state = stateFrom([[animalCell('herbivore', 5), { species: 'plant' }]]);

    const next = advanceSimulation(state, () => 0, noGrowthSettings);

    expect(next.grid[0][1]).toEqual(animalCell('herbivore', 9, undefined, 1));
    expect(countPopulations(next.grid)).toEqual({ plant: 0, herbivore: 1, predator: 0 });
  });

  it('allows a predator to eat a neighboring herbivore and gain energy', () => {
    const state = stateFrom([[animalCell('predator', 6), animalCell('herbivore', 5)]]);

    const next = advanceSimulation(state, () => 0, noGrowthSettings);

    expect(next.grid[0][1]).toEqual(animalCell('predator', 11, undefined, 1));
    expect(countPopulations(next.grid)).toEqual({ plant: 0, herbivore: 0, predator: 1 });
  });

  it('allows a predator to reproduce with the default energy settings', () => {
    const state = stateFrom([
      [emptyCell(), emptyCell(), emptyCell()],
      [emptyCell(), animalCell('predator', 9), animalCell('herbivore', 5)],
      [emptyCell(), emptyCell(), emptyCell()],
    ]);

    const next = advanceSimulation(state, () => 0);

    expect(next.grid).toEqual([
      [animalCell('predator', 6), emptyCell(), emptyCell()],
      [emptyCell(), emptyCell(), animalCell('predator', 8, undefined, 1)],
      [emptyCell(), emptyCell(), emptyCell()],
    ]);
  });

  it('removes a herbivore before it can move away from a predator', () => {
    const state = stateFrom([
      [animalCell('predator', 6), animalCell('herbivore', 5), { species: 'plant' }],
    ]);

    const next = advanceSimulation(state, () => 0, noGrowthSettings);

    expect(next.grid).toEqual([
      [emptyCell(), animalCell('predator', 11, undefined, 1), { species: 'plant' }],
    ]);
  });

  it('does not create offspring for a herbivore eaten in the same tick', () => {
    const state = stateFrom([
      [animalCell('predator', 6), animalCell('herbivore', 9), { species: 'plant' }, emptyCell()],
    ]);

    const next = advanceSimulation(state, () => 0, {
      ...noGrowthSettings,
      herbivoreReproductionChance: 1,
    });

    expect(countPopulations(next.grid)).toEqual({ plant: 1, herbivore: 0, predator: 1 });
  });

  it('gives food only to the animal that reaches the plant first', () => {
    const state = stateFrom([
      [animalCell('herbivore', 5), { species: 'plant' }, animalCell('herbivore', 5)],
    ]);

    const next = advanceSimulation(state, () => 0, noGrowthSettings);

    expect(next.grid).toEqual([
      [
        emptyCell(),
        animalCell('herbivore', 9, undefined, 1),
        animalCell('herbivore', 4, undefined, 1),
      ],
    ]);
  });

  it('does not charge reproduction energy when no offspring is placed', () => {
    const state = stateFrom([
      [animalCell('herbivore', 9), { species: 'plant' }],
      [{ species: 'plant' }, { species: 'plant' }],
    ]);

    const next = advanceSimulation(state, () => 0, {
      ...noGrowthSettings,
      herbivoreReproductionChance: 1,
    });

    expect(next.grid[0][1]).toEqual(animalCell('herbivore', 13, undefined, 1));
  });

  it('removes an animal that runs out of energy without food', () => {
    const state = stateFrom([[animalCell('herbivore', 1)]]);

    const next = advanceSimulation(state, () => 0, noGrowthSettings);

    expect(next.grid[0][0]).toEqual(emptyCell());
  });

  it('lets a predator trample a plant when boxed in with no empty tile or prey nearby', () => {
    const state = stateFrom([
      [{ species: 'plant' }, { species: 'plant' }, { species: 'plant' }],
      [{ species: 'plant' }, animalCell('predator', 6), { species: 'plant' }],
      [{ species: 'plant' }, { species: 'plant' }, { species: 'plant' }],
    ]);

    const next = advanceSimulation(state, () => 0, noGrowthSettings);

    const predatorCells = next.grid.flat().filter((cell) => cell.species === 'predator');
    expect(predatorCells).toEqual([animalCell('predator', 5, true, 1)]);
    expect(countPopulations(next.grid)).toEqual({ plant: 8, herbivore: 0, predator: 1 });
  });

  it('lets a predator cross a plant even when an empty tile is available', () => {
    const state = stateFrom([[{ species: 'plant' }, animalCell('predator', 6), emptyCell()]]);

    const next = advanceSimulation(state, () => 0, noGrowthSettings);

    expect(next.grid).toEqual([[animalCell('predator', 5, true, 1), emptyCell(), emptyCell()]]);
  });

  it('regrows the plant once a predator moves off a trampled tile', () => {
    const state = stateFrom([[animalCell('predator', 6, true), emptyCell(), { species: 'plant' }]]);

    const next = advanceSimulation(state, () => 0, noGrowthSettings);

    expect(next.grid).toEqual([
      [{ species: 'plant' }, animalCell('predator', 5, undefined, 1), { species: 'plant' }],
    ]);
  });

  it('counts a hidden plant beneath an animal toward the plant population', () => {
    const grid: EcosystemCell[][] = [[animalCell('predator', 5, true)]];

    expect(countPopulations(grid)).toEqual({ plant: 1, herbivore: 0, predator: 1 });
  });

  it('removes an animal that reaches its max age and regrows the plant beneath it', () => {
    const state = stateFrom([[animalCell('herbivore', 5, true, 29)]]);

    const next = advanceSimulation(state, () => 0, noGrowthSettings);

    expect(next.grid).toEqual([[{ species: 'plant' }]]);
  });

  it('keeps an animal alive until the tick it reaches its max age', () => {
    const state = stateFrom([[animalCell('herbivore', 5, false, 28)]]);

    const next = advanceSimulation(state, () => 0, { ...noGrowthSettings, herbivoreMaxAge: 30 });

    expect(next.grid).toEqual([[animalCell('herbivore', 4, undefined, 29)]]);
  });

  it('does not eat a plant while energy is above the hunger threshold', () => {
    const state = stateFrom([[animalCell('herbivore', 9), { species: 'plant' }]]);

    const next = advanceSimulation(state, () => 0, {
      ...noGrowthSettings,
      herbivoreHungerEnergy: 8,
    });

    expect(next.grid).toEqual([[emptyCell(), animalCell('herbivore', 8, true, 1)]]);
  });

  it('does not let a predator eat a herbivore that dies of old age this tick', () => {
    const state = stateFrom([[animalCell('predator', 6), animalCell('herbivore', 5, false, 29)]]);

    const next = advanceSimulation(state, () => 0, {
      ...noGrowthSettings,
      herbivoreMaxAge: 30,
    });

    expect(next.grid).toEqual([[animalCell('predator', 5, undefined, 1), emptyCell()]]);
  });

  it('does not let a predator eat when its energy is above the hunger threshold', () => {
    const state = stateFrom([[animalCell('predator', 9), animalCell('herbivore', 5)]]);

    const next = advanceSimulation(state, () => 0, {
      ...noGrowthSettings,
      predatorHungerEnergy: 9,
    });

    expect(next.grid).toEqual([
      [animalCell('predator', 8, undefined, 1), animalCell('herbivore', 4, undefined, 1)],
    ]);
  });

  it('eats a plant once energy drops below the hunger threshold', () => {
    const state = stateFrom([[animalCell('herbivore', 7), { species: 'plant' }]]);

    const next = advanceSimulation(state, () => 0, {
      ...noGrowthSettings,
      herbivoreHungerEnergy: 8,
    });

    expect(next.grid).toEqual([[emptyCell(), animalCell('herbivore', 11, undefined, 1)]]);
  });

  it('returns only valid neighbors at the edge of a grid', () => {
    const grid = [
      [emptyCell(), emptyCell()],
      [emptyCell(), emptyCell()],
    ];

    expect(getNeighborPositions(grid, { row: 0, column: 0 })).toEqual([
      { row: 0, column: 1 },
      { row: 1, column: 0 },
      { row: 1, column: 1 },
    ]);
  });
});
