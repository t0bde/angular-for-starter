import { Component, input, output } from '@angular/core';
import type { LifeBrushTool, SeedPresetInfo, SeedPresetName } from '../game-of-life-engine';
import { simulationSpeeds, type SimulationSpeed } from '../../../shared/simulation.types';

interface BrushToolOption {
  id: LifeBrushTool;
  label: string;
  mark: string;
}

@Component({
  selector: 'app-life-controls',
  templateUrl: './life-controls.component.html',
  styleUrl: './life-controls.component.css',
})
export class LifeControlsComponent {
  readonly running = input.required<boolean>();
  readonly speed = input.required<SimulationSpeed>();
  readonly wrapEdges = input.required<boolean>();
  readonly presets = input.required<SeedPresetInfo[]>();
  readonly activePreset = input.required<SeedPresetName>();
  readonly activeSeedInfo = input.required<SeedPresetInfo>();
  readonly selectedBrush = input.required<LifeBrushTool>();

  readonly runToggled = output<void>();
  readonly stepRequested = output<void>();
  readonly resetRequested = output<void>();
  readonly clearRequested = output<void>();
  readonly speedSelected = output<SimulationSpeed>();
  readonly wrapToggled = output<void>();
  readonly presetSelected = output<SeedPresetName>();
  readonly brushSelected = output<LifeBrushTool>();

  readonly speeds = simulationSpeeds;
  readonly brushes: BrushToolOption[] = [
    { id: 'single', label: 'Single Seed (Toggle)', mark: 'S1' },
    { id: 'acorn', label: 'Acorn Seed (7)', mark: 'AC' },
    { id: 'glider', label: 'Glider Sprout (5)', mark: 'GL' },
    { id: 'blinker', label: 'Blinker Row (3)', mark: 'BL' },
    { id: 'eraser', label: 'Prune / Erase', mark: 'ER' },
  ];
}
