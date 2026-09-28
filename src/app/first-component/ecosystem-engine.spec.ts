import {
  advanceSimulation,
  animalCell,
  countPopulations,
  emptyCell,
  getNeighborPositions,
  type EcosystemCell,
  type SimulationState,
} from './ecosystem-engine';

const noGrowthSettings = {
  plantGrowthChance: 0,
  herbivoreReproductionChance: 0,
  predatorReproductionChance: 0,
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

  it('allows a herbivore to eat a neighboring plant and gain energy', () => {
    const state = stateFrom([[animalCell('herbivore', 5), { species: 'plant' }]]);

    const next = advanceSimulation(state, () => 0, noGrowthSettings);

    expect(next.grid[0][1]).toEqual(animalCell('herbivore', 9));
    expect(countPopulations(next.grid)).toEqual({ plant: 0, herbivore: 1, predator: 0 });
  });

  it('allows a predator to eat a neighboring herbivore and gain energy', () => {
    const state = stateFrom([[animalCell('predator', 6), animalCell('herbivore', 5)]]);

    const next = advanceSimulation(state, () => 0, noGrowthSettings);

    expect(next.grid[0][1]).toEqual(animalCell('predator', 11));
    expect(countPopulations(next.grid)).toEqual({ plant: 0, herbivore: 0, predator: 1 });
  });

  it('removes an animal that runs out of energy without food', () => {
    const state = stateFrom([[animalCell('herbivore', 1)]]);

    const next = advanceSimulation(state, () => 0, noGrowthSettings);

    expect(next.grid[0][0]).toEqual(emptyCell());
  });

  it('returns only valid neighbors at the edge of a grid', () => {
    const grid = [[emptyCell(), emptyCell()], [emptyCell(), emptyCell()]];

    expect(getNeighborPositions(grid, { row: 0, column: 0 })).toEqual([
      { row: 0, column: 1 },
      { row: 1, column: 0 },
      { row: 1, column: 1 },
    ]);
  });
});