import { Component, computed, OnDestroy, signal } from '@angular/core';
import { advanceSimulation, animalCell, countPopulations, createBalancedState, emptyCell, paintCell, type EcosystemCell, type Species, type SimulationState } from './ecosystem-engine';

type SimulationSpeed = 'slow' | 'normal' | 'fast';
type PresetName = 'balanced' | 'meadow' | 'predator-boom';
const speedIntervals: Record<SimulationSpeed, number> = { slow: 900, normal: 450, fast: 180 };

@Component({
  imports: [],
  selector: 'first-component',
  styleUrl: './first-component.css',
  templateUrl: './first-component.html',
})
export class FirstComponent implements OnDestroy {
  readonly world = signal(createBalancedState(14, 18, mulberry32(24)));
  readonly running = signal(false);
  readonly selectedTool = signal<Species>('plant');
  readonly speed = signal<SimulationSpeed>('normal');
  readonly activeCell = signal({ row: 0, column: 0 });
  readonly populations = computed(() => countPopulations(this.world().grid));
  readonly species: Array<{ id: Species; label: string; mark: string }> = [
    { id: 'plant', label: 'Plant', mark: 'PL' }, { id: 'herbivore', label: 'Plant eater', mark: 'HE' },
    { id: 'predator', label: 'Predator', mark: 'PR' }, { id: 'empty', label: 'Eraser', mark: 'ER' },
  ];
  readonly speeds: SimulationSpeed[] = ['slow', 'normal', 'fast'];
  private intervalId?: number;

  ngOnDestroy(): void { this.stop(); }
  toggleRunning(): void { this.running() ? this.stop() : this.start(); }
  step(): void { this.world.update((state) => advanceSimulation(state)); }
  reset(): void { this.stop(); this.world.set(createBalancedState(14, 18, mulberry32(24))); }
  applyPreset(preset: PresetName): void { this.stop(); this.world.set(createPreset(preset)); }
  selectTool(tool: Species): void { this.selectedTool.set(tool); }
  setSpeed(speed: SimulationSpeed): void { this.speed.set(speed); if (this.running()) { this.stop(); this.start(); } }
  paint(row: number, column: number): void { this.activeCell.set({ row, column }); this.world.update((state) => paintCell(state, { row, column }, this.selectedTool())); }
  cellMark(cell: EcosystemCell): string { return cell.species === 'plant' ? 'PL' : cell.species === 'herbivore' ? 'HE' : cell.species === 'predator' ? 'PR' : ''; }
  cellLabel(cell: EcosystemCell, row: number, column: number): string { const name = cell.species === 'herbivore' ? 'plant eater' : cell.species; return `Row ${row + 1}, column ${column + 1}: ${name}`; }
  cellTabIndex(row: number, column: number): number { const active = this.activeCell(); return active.row === row && active.column === column ? 0 : -1; }
  moveCellFocus(event: KeyboardEvent, row: number, column: number): void {
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
    queueMicrotask(() => document.getElementById(this.cellId(next.row, next.column))?.focus());
  }
  ecosystemMessage(): string { const { plant, herbivore, predator } = this.populations(); if (predator === 0) return 'No predators are here. Plant eaters may grow quickly.'; if (herbivore === 0) return 'Predators need plant eaters. Watch their energy closely.'; return plant < herbivore * 2 ? 'Plants are scarce. Plant eaters may start to lose energy.' : 'The food chain is active. Watch each group affect the next one.'; }

  private start(): void { this.running.set(true); this.intervalId = window.setInterval(() => this.step(), speedIntervals[this.speed()]); }
  private stop(): void { if (this.intervalId !== undefined) { window.clearInterval(this.intervalId); this.intervalId = undefined; } this.running.set(false); }
  private cellId(row: number, column: number): string { return `habitat-cell-${row}-${column}`; }
}

function createPreset(preset: PresetName): SimulationState {
  const random = mulberry32(preset === 'balanced' ? 24 : preset === 'meadow' ? 11 : 77);
  const state = createBalancedState(14, 18, random);
  if (preset === 'balanced') return state;
  return { ...state, grid: state.grid.map((row) => row.map(() => { const roll = random(); if (preset === 'meadow') return roll < 0.7 ? { species: 'plant' } : roll < 0.78 ? animalCell('herbivore', 5) : emptyCell(); return roll < 0.12 ? animalCell('predator', 6) : roll < 0.28 ? animalCell('herbivore', 5) : roll < 0.54 ? { species: 'plant' } : emptyCell(); })) };
}

function mulberry32(seed: number): () => number {
  return () => { let value = (seed += 0x6d2b79f5); value = Math.imul(value ^ (value >>> 15), value | 1); value ^= value + Math.imul(value ^ (value >>> 7), value | 61); return ((value ^ (value >>> 14)) >>> 0) / 4294967296; };
}
