import { Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { I18nService } from '../../shared/i18n/i18n.service';
import {
  advanceSimulation,
  animalCell,
  countPopulations,
  createBalancedState,
  defaultSimulationSettings,
  emptyCell,
  paintCell,
  type Species,
  type SimulationState,
} from './meadow-engine';
import { MeadowGridComponent } from './meadow-grid/meadow-grid.component';
import { MeadowLessonComponent } from './meadow-lesson/meadow-lesson.component';
import { PopulationSummaryComponent } from './population-summary/population-summary.component';
import { SimulationControlsComponent } from './simulation-controls/simulation-controls.component';
import type { BehaviorSettings, PresetName } from './meadow-ui.types';
import type { CellPosition, SimulationSpeed } from '../../shared/simulation.types';
const speedIntervals: Record<SimulationSpeed, number> = { slow: 900, normal: 450, fast: 180 };
const defaultBehaviorSettings: BehaviorSettings = {
  plantGrowthChance: defaultSimulationSettings.plantGrowthChance,
  herbivoreReproductionChance: defaultSimulationSettings.herbivoreReproductionChance,
  herbivoreFoodEnergy: defaultSimulationSettings.herbivoreFoodEnergy,
  predatorReproductionChance: defaultSimulationSettings.predatorReproductionChance,
  predatorFoodEnergy: defaultSimulationSettings.predatorFoodEnergy,
};

@Component({
  imports: [
    MeadowGridComponent,
    MeadowLessonComponent,
    PopulationSummaryComponent,
    SimulationControlsComponent,
  ],
  selector: 'app-meadow',
  styleUrl: './meadow.component.css',
  templateUrl: './meadow.component.html',
})
export class MeadowComponent implements OnDestroy {
  protected readonly t = inject(I18nService).t;
  readonly world = signal(createPreset('balanced'));
  readonly running = signal(false);
  readonly selectedTool = signal<Species>('plant');
  readonly speed = signal<SimulationSpeed>('normal');
  readonly activeCell = signal({ row: 0, column: 0 });
  readonly behaviorSettings = signal<BehaviorSettings>({ ...defaultBehaviorSettings });
  readonly populations = computed(() => countPopulations(this.world().grid));
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
    this.world.update((state) => advanceSimulation(state, undefined, this.behaviorSettings()));
    if (!this.hasLivingAnimals()) {
      this.stop();
    }
  }
  reset(): void {
    this.stop();
    this.world.set(createPreset('balanced'));
    this.behaviorSettings.set({ ...defaultBehaviorSettings });
  }
  applyPreset(preset: PresetName): void {
    this.stop();
    this.world.set(createPreset(preset));
  }
  selectTool(tool: Species): void {
    this.selectedTool.set(tool);
  }
  setSpeed(speed: SimulationSpeed): void {
    this.speed.set(speed);
    if (this.running()) {
      this.stop();
      this.start();
    }
  }
  paint(position: CellPosition): void {
    this.activeCell.set(position);
    this.world.update((state) =>
      paintCell(state, position, this.selectedTool()),
    );
    if (!this.hasLivingAnimals()) {
      this.stop();
    }
  }
  setActiveCell(position: CellPosition): void {
    this.activeCell.set(position);
  }
  updateBehavior(patch: Partial<BehaviorSettings>): void {
    this.behaviorSettings.update((current) => ({ ...current, ...patch }));
  }
  changeBehavior(key: keyof BehaviorSettings, value: string): void {
    this.updateBehavior({ [key]: Number(value) });
  }
  asPercent(value: number): string {
    return `${Math.round(value * 100)}%`;
  }
  ecosystemMessage(): string {
    const { plant, herbivore, predator } = this.populations();
    if (predator === 0) return this.t('meadow.msgNoPredators');
    if (herbivore === 0) return this.t('meadow.msgNoHerbivores');
    return plant < herbivore * 2
      ? this.t('meadow.msgScarce')
      : this.t('meadow.msgActive');
  }

  private hasLivingAnimals(): boolean {
    const { herbivore, predator } = this.populations();
    return herbivore > 0 || predator > 0;
  }
  private start(): void {
    if (!this.hasLivingAnimals()) {
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

function createPreset(preset: PresetName): SimulationState {
  const random = mulberry32(preset === 'balanced' ? 24 : preset === 'meadow' ? 11 : 77);
  const state = createBalancedState(14, 18, random);
  if (preset === 'balanced') return state;
  return {
    ...state,
    grid: state.grid.map((row) =>
      row.map(() => {
        const roll = random();
        if (preset === 'meadow')
          return roll < 0.7
            ? { species: 'plant' }
            : roll < 0.78
              ? animalCell('herbivore', 5)
              : emptyCell();
        return roll < 0.12
          ? animalCell('predator', 6)
          : roll < 0.28
            ? animalCell('herbivore', 5)
            : roll < 0.54
              ? { species: 'plant' }
              : emptyCell();
      }),
    ),
  };
}

function mulberry32(seed: number): () => number {
  return () => {
    let value = (seed += 0x6d2b79f5);
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}
