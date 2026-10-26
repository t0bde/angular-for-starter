import type { CellPosition } from '../../shared/simulation.types';

export type SeedPresetName = 'acorn' | 'r-pentomino' | 'diehard' | 'rabbits' | 'glider-fleet';
export type LifeBrushTool = 'single' | 'glider' | 'blinker' | 'acorn' | 'eraser';

export interface LifeCell {
  alive: boolean;
  /** Consecutive generations this cell has been alive (0 when dead, 1 on birth, >1 on survival). */
  age: number;
}

export interface LifeSimulationState {
  grid: LifeCell[][];
  generation: number;
  bornLastTick: number;
  diedLastTick: number;
  wrapEdges: boolean;
}

export interface LifeStats {
  alive: number;
  sprouts: number;
  perennials: number;
  bornLastTick: number;
  diedLastTick: number;
}

export interface SeedPresetInfo {
  id: SeedPresetName;
  label: string;
  cells: number;
  description: string;
}

export const seedPresets: SeedPresetInfo[] = [
  {
    id: 'acorn',
    label: 'Acorn Seed',
    cells: 7,
    description: 'A tiny 7-cell seed that germinates for thousands of generations into gliders and oaks.',
  },
  {
    id: 'r-pentomino',
    label: 'R-Pentomino',
    cells: 5,
    description: "Conway's classic 5-cell sprout that erupts into vigorous, long-lived activity.",
  },
  {
    id: 'diehard',
    label: 'Diehard Seed',
    cells: 7,
    description: 'An ephemeral 7-cell bloom that flourishes for 130 generations before vanishing.',
  },
  {
    id: 'rabbits',
    label: 'Rabbits Seed',
    cells: 9,
    description: 'A 9-cell starter cluster that multiplies rapidly into a dense cellular meadow.',
  },
  {
    id: 'glider-fleet',
    label: 'Glider Armada',
    cells: 15,
    description: 'Three synchronized gliders drifting diagonally across the garden.',
  },
];

const patternOffsets: Record<Exclude<SeedPresetName, 'glider-fleet'> | 'glider' | 'blinker', CellPosition[]> = {
  acorn: [
    { row: 0, column: 1 },
    { row: 1, column: 3 },
    { row: 2, column: 0 },
    { row: 2, column: 1 },
    { row: 2, column: 4 },
    { row: 2, column: 5 },
    { row: 2, column: 6 },
  ],
  'r-pentomino': [
    { row: 0, column: 1 },
    { row: 0, column: 2 },
    { row: 1, column: 0 },
    { row: 1, column: 1 },
    { row: 2, column: 1 },
  ],
  diehard: [
    { row: 0, column: 6 },
    { row: 1, column: 0 },
    { row: 1, column: 1 },
    { row: 2, column: 1 },
    { row: 2, column: 5 },
    { row: 2, column: 6 },
    { row: 2, column: 7 },
  ],
  rabbits: [
    { row: 0, column: 0 },
    { row: 0, column: 4 },
    { row: 0, column: 5 },
    { row: 0, column: 6 },
    { row: 1, column: 0 },
    { row: 1, column: 1 },
    { row: 1, column: 2 },
    { row: 1, column: 5 },
    { row: 2, column: 1 },
  ],
  glider: [
    { row: 0, column: 1 },
    { row: 1, column: 2 },
    { row: 2, column: 0 },
    { row: 2, column: 1 },
    { row: 2, column: 2 },
  ],
  blinker: [
    { row: 0, column: 0 },
    { row: 0, column: 1 },
    { row: 0, column: 2 },
  ],
};

export function deadCell(): LifeCell {
  return { alive: false, age: 0 };
}

export function aliveCell(age = 1): LifeCell {
  return { alive: true, age };
}

export function createEmptyLifeState(
  rows = 22,
  columns = 32,
  wrapEdges = true,
): LifeSimulationState {
  const grid: LifeCell[][] = Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => deadCell()),
  );

  return {
    grid,
    generation: 0,
    bornLastTick: 0,
    diedLastTick: 0,
    wrapEdges,
  };
}

export function createSeedState(
  preset: SeedPresetName = 'acorn',
  rows = 22,
  columns = 32,
  wrapEdges = true,
): LifeSimulationState {
  const base = createEmptyLifeState(rows, columns, wrapEdges);
  const grid = cloneLifeGrid(base.grid);

  if (preset === 'glider-fleet') {
    const origins: CellPosition[] = [
      { row: Math.max(1, Math.floor(rows * 0.2)), column: Math.max(1, Math.floor(columns * 0.2)) },
      { row: Math.max(1, Math.floor(rows * 0.45)), column: Math.max(1, Math.floor(columns * 0.45)) },
      { row: Math.max(1, Math.floor(rows * 0.7)), column: Math.max(1, Math.floor(columns * 0.15)) },
    ];
    for (const origin of origins) {
      placeOffsets(grid, origin, patternOffsets.glider, wrapEdges);
    }
  } else {
    const offsets = patternOffsets[preset];
    const centerOrigin = getCenteredOrigin(rows, columns, offsets);
    placeOffsets(grid, centerOrigin, offsets, wrapEdges);
  }

  const aliveCount = grid.flat().filter((cell) => cell.alive).length;
  return {
    ...base,
    grid,
    bornLastTick: aliveCount,
  };
}

export function advanceLifeGeneration(state: LifeSimulationState): LifeSimulationState {
  const rows = state.grid.length;
  const columns = state.grid[0]?.length ?? 0;
  let bornLastTick = 0;
  let diedLastTick = 0;

  const grid = state.grid.map((row, rowIndex) =>
    row.map((cell, columnIndex) => {
      const neighbors = countLivingNeighbors(
        state.grid,
        { row: rowIndex, column: columnIndex },
        state.wrapEdges,
      );

      if (cell.alive) {
        if (neighbors === 2 || neighbors === 3) {
          return aliveCell(cell.age + 1);
        }
        diedLastTick += 1;
        return deadCell();
      }

      if (neighbors === 3) {
        bornLastTick += 1;
        return aliveCell(1);
      }

      return deadCell();
    }),
  );

  return {
    ...state,
    grid: rows > 0 && columns > 0 ? grid : state.grid,
    generation: state.generation + 1,
    bornLastTick,
    diedLastTick,
  };
}

export function countLivingNeighbors(
  grid: LifeCell[][],
  position: CellPosition,
  wrapEdges = true,
): number {
  const rows = grid.length;
  const columns = grid[0]?.length ?? 0;
  if (rows === 0 || columns === 0) {
    return 0;
  }

  let count = 0;
  for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
    for (let columnOffset = -1; columnOffset <= 1; columnOffset += 1) {
      if (rowOffset === 0 && columnOffset === 0) {
        continue;
      }

      let targetRow = position.row + rowOffset;
      let targetColumn = position.column + columnOffset;

      if (wrapEdges) {
        targetRow = (targetRow + rows) % rows;
        targetColumn = (targetColumn + columns) % columns;
      } else if (
        targetRow < 0 ||
        targetRow >= rows ||
        targetColumn < 0 ||
        targetColumn >= columns
      ) {
        continue;
      }

      if (grid[targetRow][targetColumn].alive) {
        count += 1;
      }
    }
  }

  return count;
}

export function applyBrushToGrid(
  state: LifeSimulationState,
  position: CellPosition,
  tool: LifeBrushTool,
): LifeSimulationState {
  const rows = state.grid.length;
  const columns = state.grid[0]?.length ?? 0;
  if (
    position.row < 0 ||
    position.row >= rows ||
    position.column < 0 ||
    position.column >= columns
  ) {
    return state;
  }

  const grid = cloneLifeGrid(state.grid);

  if (tool === 'eraser') {
    grid[position.row][position.column] = deadCell();
  } else if (tool === 'single') {
    const current = grid[position.row][position.column];
    grid[position.row][position.column] = current.alive ? deadCell() : aliveCell(1);
  } else {
    const offsets = patternOffsets[tool];
    const bounds = getPatternBounds(offsets);
    const origin = {
      row: position.row - Math.floor(bounds.height / 2),
      column: position.column - Math.floor(bounds.width / 2),
    };
    placeOffsets(grid, origin, offsets, state.wrapEdges);
  }

  return {
    ...state,
    grid,
  };
}

export function computeLifeStats(state: LifeSimulationState): LifeStats {
  let alive = 0;
  let sprouts = 0;
  let perennials = 0;

  for (const row of state.grid) {
    for (const cell of row) {
      if (cell.alive) {
        alive += 1;
        if (cell.age === 1) {
          sprouts += 1;
        } else if (cell.age > 5) {
          perennials += 1;
        }
      }
    }
  }

  return {
    alive,
    sprouts,
    perennials,
    bornLastTick: state.bornLastTick,
    diedLastTick: state.diedLastTick,
  };
}

function getPatternBounds(offsets: CellPosition[]): { height: number; width: number } {
  const maxRow = Math.max(...offsets.map((offset) => offset.row), 0);
  const maxColumn = Math.max(...offsets.map((offset) => offset.column), 0);
  return { height: maxRow + 1, width: maxColumn + 1 };
}

function getCenteredOrigin(
  rows: number,
  columns: number,
  offsets: CellPosition[],
): CellPosition {
  const bounds = getPatternBounds(offsets);
  return {
    row: Math.max(0, Math.floor((rows - bounds.height) / 2)),
    column: Math.max(0, Math.floor((columns - bounds.width) / 2)),
  };
}

function placeOffsets(
  grid: LifeCell[][],
  origin: CellPosition,
  offsets: CellPosition[],
  wrapEdges: boolean,
): void {
  const rows = grid.length;
  const columns = grid[0]?.length ?? 0;

  for (const offset of offsets) {
    let targetRow = origin.row + offset.row;
    let targetColumn = origin.column + offset.column;

    if (wrapEdges) {
      targetRow = ((targetRow % rows) + rows) % rows;
      targetColumn = ((targetColumn % columns) + columns) % columns;
    } else if (
      targetRow < 0 ||
      targetRow >= rows ||
      targetColumn < 0 ||
      targetColumn >= columns
    ) {
      continue;
    }

    grid[targetRow][targetColumn] = aliveCell(1);
  }
}

function cloneLifeGrid(grid: LifeCell[][]): LifeCell[][] {
  return grid.map((row) => row.map((cell) => ({ ...cell })));
}
