import { Component, computed, OnDestroy, signal } from '@angular/core';
import { advanceSimulation, animalCell, countPopulations, createBalancedState, defaultSimulationSettings, emptyCell, paintCell, type Species, type SimulationState } from './ecosystem-engine';
import { EcosystemLessonComponent } from './ecosystem-lesson/ecosystem-lesson.component';
import { MeadowGridComponent } from './meadow-grid/meadow-grid.component';
import { PopulationSummaryComponent } from './population-summary/population-summary.component';
import { SimulationControlsComponent } from './simulation-controls/simulation-controls.component';
import type { BehaviorSettings, CellPosition, PresetName, SimulationSpeed } from './ecosystem-ui.types';
const speedIntervals: Record<SimulationSpeed, number> = { slow: 900, normal: 450, fast: 180 };
const defaultBehaviorSettings: BehaviorSettings = {
  plantGrowthChance: defaultSimulationSettings.plantGrowthChance,
  herbivoreReproductionChance: defaultSimulationSettings.herbivoreReproductionChance,
  herbivoreFoodEnergy: defaultSimulationSettings.herbivoreFoodEnergy,
  predatorReproductionChance: defaultSimulationSettings.predatorReproductionChance,
  predatorFoodEnergy: defaultSimulationSettings.predatorFoodEnergy,
};

@Component({
  imports: [EcosystemLessonComponent, MeadowGridComponent, PopulationSummaryComponent, SimulationControlsComponent],
  selector: 'app-ecosystem-simulator',
  styleUrl: './ecosystem-simulator.css',
  templateUrl: './ecosystem-simulator.html',
})
export class EcosystemSimulatorComponent implements OnDestroy {
  readonly world = signal(createBalancedState(14, 18, mulberry32(24)));
  readonly running = signal(false);
  readonly selectedTool = signal<Species>('plant');
  readonly speed = signal<SimulationSpeed>('normal');
  readonly activeCell = signal({ row: 0, column: 0 });
  readonly behaviorSettings = signal<BehaviorSettings>({ ...defaultBehaviorSettings });
  readonly populations = computed(() => countPopulations(this.world().grid));
  private intervalId?: number;

  ngOnDestroy(): void { this.stop(); }
  toggleRunning(): void { if (this.running()) { this.stop(); } else { this.start(); } }
  step(): void { this.world.update((state) => advanceSimulation(state, undefined, this.behaviorSettings())); }
  reset(): void { this.stop(); this.world.set(createBalancedState(14, 18, mulberry32(24))); this.behaviorSettings.set({ ...defaultBehaviorSettings }); }
  applyPreset(preset: PresetName): void { this.stop(); this.world.set(createPreset(preset)); }
  selectTool(tool: Species): void { this.selectedTool.set(tool); }
  setSpeed(speed: SimulationSpeed): void { this.speed.set(speed); if (this.running()) { this.stop(); this.start(); } }
  paint(position: CellPosition): void { this.activeCell.set(position); this.world.update((state) => paintCell(state, position, this.selectedTool(), this.behaviorSettings())); }
  setActiveCell(position: CellPosition): void { this.activeCell.set(position); }
  updateBehavior(patch: Partial<BehaviorSettings>): void { this.behaviorSettings.update((current) => ({ ...current, ...patch })); }
  ecosystemMessage(): string { const { plant, herbivore, predator } = this.populations(); if (predator === 0) return 'No predators are here. Plant eaters may grow quickly.'; if (herbivore === 0) return 'Predators need plant eaters. Watch their energy closely.'; return plant < herbivore * 2 ? 'Plants are scarce. Plant eaters may start to lose energy.' : 'The food chain is active. Watch each group affect the next one.'; }

  private start(): void { this.running.set(true); this.intervalId = window.setInterval(() => this.step(), speedIntervals[this.speed()]); }
  private stop(): void { if (this.intervalId !== undefined) { window.clearInterval(this.intervalId); this.intervalId = undefined; } this.running.set(false); }
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
