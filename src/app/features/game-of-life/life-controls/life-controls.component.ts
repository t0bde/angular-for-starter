import { Component, inject, input, output } from '@angular/core';
import { I18nService } from '../../../shared/i18n/i18n.service';
import type { LifeBrushTool, SeedPresetInfo, SeedPresetName } from '../game-of-life-engine';
import { simulationSpeeds, type SimulationSpeed } from '../../../shared/simulation.types';

interface BrushToolOption {
  id: LifeBrushTool;
  mark: string;
}

@Component({
  selector: 'app-life-controls',
  templateUrl: './life-controls.component.html',
  styleUrl: './life-controls.component.css',
})
export class LifeControlsComponent {
  protected readonly t = inject(I18nService).t;
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
    { id: 'single', mark: 'S1' },
    { id: 'acorn', mark: 'AC' },
    { id: 'glider', mark: 'GL' },
    { id: 'blinker', mark: 'BL' },
    { id: 'eraser', mark: 'ER' },
  ];
}
