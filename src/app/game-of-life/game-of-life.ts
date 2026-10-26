import { Component, computed, OnDestroy, signal } from '@angular/core';
import {
  advanceLifeGeneration,
  applyBrushToGrid,
  computeLifeStats,
  createEmptyLifeState,
  createSeedState,
  seedPresets,
  type CellPosition,
  type LifeBrushTool,
  type LifeCell,
  type SeedPresetInfo,
  type SeedPresetName,
} from './game-of-life-engine';
import type { SimulationSpeed } from '../ecosystem-simulator/ecosystem-ui.types';

interface BrushToolOption {
  id: LifeBrushTool;
  label: string;
  mark: string;
}

const GRID_ROWS = 22;
const GRID_COLUMNS = 32;
const speedIntervals: Record<SimulationSpeed, number> = {
  slow: 550,
  normal: 220,
  fast: 85,
};

@Component({
  selector: 'app-game-of-life',
  templateUrl: './game-of-life.html',
  styleUrl: './game-of-life.css',
})
export class GameOfLifeComponent implements OnDestroy {
  readonly presets: SeedPresetInfo[] = seedPresets;
  readonly speeds: SimulationSpeed[] = ['slow', 'normal', 'fast'];
  readonly brushes: BrushToolOption[] = [
    { id: 'single', label: 'Single Seed (Toggle)', mark: 'S1' },
    { id: 'acorn', label: 'Acorn Seed (7)', mark: 'AC' },
    { id: 'glider', label: 'Glider Sprout (5)', mark: 'GL' },
    { id: 'blinker', label: 'Blinker Row (3)', mark: 'BL' },
    { id: 'eraser', label: 'Prune / Erase', mark: 'ER' },
  ];

  readonly activePreset = signal<SeedPresetName>('acorn');
  readonly world = signal(createSeedState('acorn', GRID_ROWS, GRID_COLUMNS, true));
  readonly running = signal(false);
  readonly speed = signal<SimulationSpeed>('normal');
  readonly selectedBrush = signal<LifeBrushTool>('single');
  readonly activeCell = signal<CellPosition>({
    row: Math.floor(GRID_ROWS / 2),
    column: Math.floor(GRID_COLUMNS / 2),
  });

  readonly stats = computed(() => computeLifeStats(this.world()));
  readonly activeSeedInfo = computed(
    () => this.presets.find((preset) => preset.id === this.activePreset()) ?? this.presets[0],
  );

  private intervalId?: number;

  ngOnDestroy(): void {
    this.stop();
  }

  toggleRunning(): void {
    if (this.running()) {
      this.stop();
    } else {
      this.start();
    }
  }

  step(): void {
    this.world.update((state) => advanceLifeGeneration(state));
    if (this.stats().alive === 0) {
      this.stop();
    }
  }

  reset(): void {
    this.stop();
    this.world.set(
      createSeedState(this.activePreset(), GRID_ROWS, GRID_COLUMNS, this.world().wrapEdges),
    );
  }

  clearField(): void {
    this.stop();
    this.world.set(createEmptyLifeState(GRID_ROWS, GRID_COLUMNS, this.world().wrapEdges));
  }

  selectPreset(preset: SeedPresetName): void {
    this.stop();
    this.activePreset.set(preset);
    this.world.set(createSeedState(preset, GRID_ROWS, GRID_COLUMNS, this.world().wrapEdges));
  }

  selectBrush(brush: LifeBrushTool): void {
    this.selectedBrush.set(brush);
  }

  setSpeed(speed: SimulationSpeed): void {
    this.speed.set(speed);
    if (this.running()) {
      this.stop();
      this.start();
    }
  }

  toggleWrapEdges(): void {
    this.world.update((state) => ({
      ...state,
      wrapEdges: !state.wrapEdges,
    }));
  }

  paintCell(row: number, column: number): void {
    const position = { row, column };
    this.activeCell.set(position);
    this.world.update((state) => applyBrushToGrid(state, position, this.selectedBrush()));
    if (this.stats().alive === 0) {
      this.stop();
    }
  }

  cellStageClass(cell: LifeCell): string {
    if (!cell.alive) {
      return 'dead';
    }
    if (cell.age === 1) {
      return 'sprout';
    }
    if (cell.age <= 5) {
      return 'flora';
    }
    return 'perennial';
  }

  cellLabel(cell: LifeCell, row: number, column: number): string {
    if (!cell.alive) {
      return `Row ${row + 1}, column ${column + 1}: empty soil`;
    }
    const stage =
      cell.age === 1 ? 'fresh sprout' : cell.age <= 5 ? 'growing flora' : 'perennial canopy';
    return `Row ${row + 1}, column ${column + 1}: ${stage} (age ${cell.age})`;
  }

  cellTabIndex(row: number, column: number): number {
    const active = this.activeCell();
    return active.row === row && active.column === column ? 0 : -1;
  }

  moveFocus(event: KeyboardEvent, row: number, column: number): void {
    const rows = this.world().grid.length;
    const columns = this.world().grid[0]?.length ?? 0;
    const next = { row, column };

    if (event.key === 'ArrowUp') next.row = Math.max(0, row - 1);
    else if (event.key === 'ArrowDown') next.row = Math.min(rows - 1, row + 1);
    else if (event.key === 'ArrowLeft') next.column = Math.max(0, column - 1);
    else if (event.key === 'ArrowRight') next.column = Math.min(columns - 1, column + 1);
    else return;

    event.preventDefault();
    this.activeCell.set(next);
    queueMicrotask(() =>
      document.getElementById(`life-cell-${next.row}-${next.column}`)?.focus(),
    );
  }

  colonyMessage(): string {
    const { alive, sprouts, perennials, bornLastTick, diedLastTick } = this.stats();
    const generation = this.world().generation;

    if (alive === 0) {
      return 'The soil is quiet. Select a Methuselah seed preset or click tiles to plant a new colony.';
    }
    if (generation === 0) {
      return `Seed planted: ${this.activeSeedInfo().label} (${alive} cells). Press Play or Step to watch it germinate!`;
    }
    if (bornLastTick === 0 && diedLastTick === 0) {
      return 'Equilibrium reached! Only stable still-lifes remain in the garden.';
    }
    if (sprouts > perennials) {
      return 'Rapid germination underway — new sprouts are blooming across open soil.';
    }
    return 'Mature perennial clusters anchor the colony while oscillators and gliders ripple outward.';
  }

  private start(): void {
    if (this.stats().alive === 0) {
      return;
    }
    this.running.set(true);
    this.intervalId = window.setInterval(() => this.step(), speedIntervals[this.speed()]);
  }

  private stop(): void {
    if (this.intervalId !== undefined) {
      window.clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
    this.running.set(false);
  }
}

