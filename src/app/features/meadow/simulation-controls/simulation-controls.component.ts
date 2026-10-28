import { Component, inject, input, output } from '@angular/core';
import { I18nService } from '../../../shared/i18n/i18n.service';
import type { Species } from '../meadow-engine';
import { speciesImages, type PresetName, type SpeciesTool } from '../meadow-ui.types';
import { simulationSpeeds, type SimulationSpeed } from '../../../shared/simulation.types';

@Component({
  selector: 'app-simulation-controls',
  templateUrl: './simulation-controls.component.html',
  styleUrl: './simulation-controls.component.css',
})
export class SimulationControlsComponent {
  protected readonly t = inject(I18nService).t;
  readonly running = input.required<boolean>();
  readonly speed = input.required<SimulationSpeed>();
  readonly selectedTool = input.required<Species>();
  readonly runToggled = output<void>();
  readonly stepRequested = output<void>();
  readonly resetRequested = output<void>();
  readonly presetSelected = output<PresetName>();
  readonly speedSelected = output<SimulationSpeed>();
  readonly toolSelected = output<Species>();
  readonly speeds = simulationSpeeds;
  readonly tools: SpeciesTool[] = [
    { id: 'plant', mark: 'PL' },
    { id: 'herbivore', mark: 'HE' },
    { id: 'predator', mark: 'PR' },
    { id: 'empty', mark: 'ER' },
  ];
  toolImage(tool: SpeciesTool): string | null {
    return speciesImages[tool.id] ?? null;
  }
}
