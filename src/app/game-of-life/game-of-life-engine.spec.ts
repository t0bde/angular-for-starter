import {
  advanceLifeGeneration,
  aliveCell,
  applyBrushToGrid,
  computeLifeStats,
  countLivingNeighbors,
  createEmptyLifeState,
  createSeedState,
  deadCell,
} from './game-of-life-engine';

describe('game-of-life engine', () => {
  it('plants the 7-cell Acorn Methuselah seed by default', () => {
    const state = createSeedState('acorn', 12, 16, true);
    const stats = computeLifeStats(state);

    expect(stats.alive).toBe(7);
    expect(stats.sprouts).toBe(7);
    expect(state.generation).toBe(0);
  });

  it('plants the 5-cell R-pentomino, 7-cell Diehard, and 9-cell Rabbits seeds', () => {
    expect(computeLifeStats(createSeedState('r-pentomino', 12, 16)).alive).toBe(5);
    expect(computeLifeStats(createSeedState('diehard', 12, 16)).alive).toBe(7);
    expect(computeLifeStats(createSeedState('rabbits', 12, 16)).alive).toBe(9);
  });

  it('oscillates a horizontal blinker into a vertical blinker and increments surviving cell age', () => {
    const base = createEmptyLifeState(5, 5, false);
    base.grid[2][1] = aliveCell(1);
    base.grid[2][2] = aliveCell(1);
    base.grid[2][3] = aliveCell(1);

    const gen1 = advanceLifeGeneration(base);

    expect(gen1.generation).toBe(1);
    expect(gen1.grid[1][2]).toEqual(aliveCell(1));
    expect(gen1.grid[2][2]).toEqual(aliveCell(2));
    expect(gen1.grid[3][2]).toEqual(aliveCell(1));
    expect(gen1.grid[2][1]).toEqual(deadCell());
    expect(gen1.grid[2][3]).toEqual(deadCell());
    expect(gen1.bornLastTick).toBe(2);
    expect(gen1.diedLastTick).toBe(2);
  });

  it('preserves a 2x2 block still-life and ages cells into perennials', () => {
    let state = createEmptyLifeState(4, 4, false);
    state.grid[1][1] = aliveCell(5);
    state.grid[1][2] = aliveCell(5);
    state.grid[2][1] = aliveCell(5);
    state.grid[2][2] = aliveCell(5);

    state = advanceLifeGeneration(state);
    const stats = computeLifeStats(state);

    expect(stats.alive).toBe(4);
    expect(stats.perennials).toBe(4);
    expect(stats.bornLastTick).toBe(0);
    expect(stats.diedLastTick).toBe(0);
  });

  it('wraps neighbors around toroidal edges when wrapEdges is enabled', () => {
    const state = createEmptyLifeState(4, 4, true);
    state.grid[0][0] = aliveCell(1);
    state.grid[0][3] = aliveCell(1);
    state.grid[3][0] = aliveCell(1);

    expect(countLivingNeighbors(state.grid, { row: 3, column: 3 }, true)).toBe(3);
    expect(countLivingNeighbors(state.grid, { row: 3, column: 3 }, false)).toBe(0);
  });

  it('toggles single cells and stamps patterns with applyBrushToGrid', () => {
    let state = createEmptyLifeState(8, 8, true);
    state = applyBrushToGrid(state, { row: 3, column: 3 }, 'single');
    expect(state.grid[3][3].alive).toBe(true);

    state = applyBrushToGrid(state, { row: 3, column: 3 }, 'single');
    expect(state.grid[3][3].alive).toBe(false);

    state = applyBrushToGrid(state, { row: 4, column: 4 }, 'glider');
    expect(computeLifeStats(state).alive).toBe(5);
  });

  it('erases a living cell with the eraser brush', () => {
    let state = createEmptyLifeState(6, 6, false);
    state = applyBrushToGrid(state, { row: 2, column: 2 }, 'single');
    state = applyBrushToGrid(state, { row: 2, column: 2 }, 'eraser');

    expect(state.grid[2][2]).toEqual(deadCell());
  });

  it('ignores brush positions outside the grid', () => {
    const state = createEmptyLifeState(6, 6, false);

    expect(applyBrushToGrid(state, { row: -1, column: 0 }, 'single')).toBe(state);
    expect(applyBrushToGrid(state, { row: 0, column: 6 }, 'acorn')).toBe(state);
  });

  it('clips patterns at the edge when wrapEdges is disabled', () => {
    const state = applyBrushToGrid(
      createEmptyLifeState(6, 6, false),
      { row: 0, column: 0 },
      'blinker',
    );

    expect(computeLifeStats(state).alive).toBe(2);
    expect(state.grid[0][0].alive).toBe(true);
    expect(state.grid[0][1].alive).toBe(true);
    expect(state.grid[0][5].alive).toBe(false);
  });

  it('wraps patterns across the edge when wrapEdges is enabled', () => {
    const state = applyBrushToGrid(
      createEmptyLifeState(6, 6, true),
      { row: 0, column: 0 },
      'blinker',
    );

    expect(computeLifeStats(state).alive).toBe(3);
    expect(state.grid[0][5].alive).toBe(true);
    expect(state.grid[0][0].alive).toBe(true);
    expect(state.grid[0][1].alive).toBe(true);
  });
});

