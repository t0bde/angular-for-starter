import { Component, inject, computed, OnDestroy, signal } from '@angular/core';
import { I18nService } from '../../shared/i18n/i18n.service';
import {
  advanceLifeGeneration,
  applyBrushToGrid,
  computeLifeStats,
  createEmptyLifeState,
  createSeedState,
  seedPresets,
  type LifeBrushTool,
  type SeedPresetInfo,
  type SeedPresetName,
} from './game-of-life-engine';
import { LifeControlsComponent } from './life-controls/life-controls.component';
import { LifeGridComponent } from './life-grid/life-grid.component';
import { LifeLessonComponent } from './life-lesson/life-lesson.component';
import { LifeStatsComponent } from './life-stats/life-stats.component';
import type { CellPosition, SimulationSpeed } from '../../shared/simulation.types';

const GRID_ROWS = 22;
const GRID_COLUMNS = 32;
const speedIntervals: Record<SimulationSpeed, number> = {
  slow: 550,
  normal: 220,
  fast: 85,
};

@Component({
  imports: [LifeControlsComponent, LifeGridComponent, LifeLessonComponent, LifeStatsComponent],
  selector: 'app-game-of-life',
  templateUrl: './game-of-life.component.html',
  styleUrl: './game-of-life.component.css',
})
export class GameOfLifeComponent implements OnDestroy {
  protected readonly t = inject(I18nService).t;
  readonly presets: SeedPresetInfo[] = seedPresets;

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

  readonly seedName = () => this.t(`seed.${this.activeSeedInfo().id}.label`);

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

  paintCell(position: CellPosition): void {
    this.activeCell.set(position);
    this.world.update((state) => applyBrushToGrid(state, position, this.selectedBrush()));
    if (this.stats().alive === 0) {
      this.stop();
    }
  }

  setActiveCell(position: CellPosition): void {
    this.activeCell.set(position);
  }

  colonyMessage(): string {
    const { alive, sprouts, perennials, bornLastTick, diedLastTick } = this.stats();
    const generation = this.world().generation;

    if (alive === 0) {
      return this.t('life.msgQuiet');
    }
    if (generation === 0) {
      return this.t('life.msgPlanted', { name: this.seedName(), alive });
    }
    if (bornLastTick === 0 && diedLastTick === 0) {
      return this.t('life.msgEquilibrium');
    }
    if (sprouts > perennials) {
      return this.t('life.msgRapid');
    }
    return this.t('life.msgMature');
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
